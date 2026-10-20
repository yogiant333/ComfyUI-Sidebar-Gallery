import {
  h,
  api,
  apiPost,
  lsRemove,
  fmtBytes,
  timeAgo,
} from "./sbg-core.js";
import { sectionTitle } from "./sbg-settings-inputs.js";
import { B, B_RETIRED } from "./sbg-settings-store.js";
import { cacheDb } from "./sbg-idb.js";
import { metaCache, storedSummaryOf, fetchSummary } from "./sbg-meta-cache.js";
import { deleteSnapshots } from "./sbg-snapshot.js";
import { thumbCache, resetFailedThumbs } from "./sbg-thumb-cache.js";
import { showToast, showFailure, failureText, confirmClick, noticeRow } from "./sbg-toast.js";
import { progressFeed, indexEndings, runningEntry, progressKind, indexRunningText, indexPct, indexFailedText } from "./sbg-progress.js";

import { itemKey } from "./sbg-media-kind.js";

async function busyButton(btn, busyLabel, fn) {
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = busyLabel;
  try {
    await fn();
  } finally {
    btn.textContent = label;
    btn.disabled = false;
  }
}

function fmtCacheSize(bytes) {
  return !bytes || bytes <= 0 ? "—" : fmtBytes(bytes);
}

// A rebuild started here refreshes the gallery when it ends, with the settings
// panel open or closed, so the wait lives at module level instead of in one drawing of the tab.
let _stopRefreshWait = null;
function _refreshGalleryWhenSettled(galleryCtx) {
  if (_stopRefreshWait) _stopRefreshWait();
  const stop = progressFeed.subscribe((data, meta) => {
    if (!meta.settled) return;
    stop();
    _stopRefreshWait = null;
    galleryCtx.fetchAllItems({ rescan: true });
  });
  _stopRefreshWait = stop;
}

const STORE_REFUSED = "浏览器存储空间已满或被阻止";

// The In Progress row's words for the run going, or null when none is.
function _runningText(progress) {
  const entry = runningEntry(progress);
  if (!entry) return null;
  const kind = progressKind(progress, entry);
  const pct = indexPct(kind, entry);
  const text = indexRunningText(kind, entry);
  return pct >= 0 ? `${text} (${pct}%)` : text;
}

// The row is drawn with its label at once, since the settings search counts
// rows before any status arrives.
function statRow(container, label, title, before = null) {
  const value = h("span", { class: "sbg-gs-value", text: "…" });
  const row = h("div", { class: "sbg-gs-row", title }, [h("span", { class: "sbg-gs-label", text: label }), value]);
  container.insertBefore(row, before);
  return {
    row,
    value,
    set(text) {
      if (text != null) value.textContent = text;
      row.classList.toggle("sbg-hidden", text == null);
    },
  };
}

export function renderDiagnosticsTab({ content, galleryCtx, visitCleanups, indexOnly }) {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  sectionTitle(wrap, "工具");

  const actionRow = h("div", { class: "sbg-gs-actions" });

  // The tab's own failures, under the tools, each until its cross or until what
  // failed works.
  const problemSlot = h("div", { class: "sbg-notices sbg-gs-notices" });
  const problems = new Map();
  const drawProblems = () => {
    problemSlot.textContent = "";
    for (const [key, { text, tint, onDismiss }] of problems) {
      problemSlot.appendChild(noticeRow(text, () => {
        if (onDismiss) onDismiss();
        setProblem(key, null);
        actionRow.querySelector("button").focus();
      }, { failure: !tint }));
    }
  };
  function setProblem(key, text, { tint = false, onDismiss = null } = {}) {
    const had = problems.get(key);
    if (text) {
      if (had && had.text === text) return;
      problems.set(key, { text, tint, onDismiss });
    } else if (!problems.delete(key)) return;
    drawProblems();
  }
  // A rebuild or a search index build that failed is kept by the page, which a
  // failure line in the notification area draws too, so closing either closes
  // both.
  const drawIndexFailures = () => {
    const standing = indexEndings.failures();
    for (const subject of ["full", "facts"]) {
      const f = standing.find((x) => x.subject === subject);
      setProblem(subject, f && indexFailedText(f.kind, f.error), { tint: subject === "facts", onDismiss: () => indexEndings.dismiss(subject) });
    }
  };

  const diagGalleryRefreshBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "刷新图库", title: "重新扫描当前根目录并加载文件列表" });
  diagGalleryRefreshBtn.addEventListener("click", () =>
    busyButton(diagGalleryRefreshBtn, "刷新中…", async () => {
      // The load reports its failure in the notification area, which the
      // settings panel covers, so it is said here as well, in the same words.
      const failed = await galleryCtx.fetchAllItems({ rescan: true });
      if (failed) showFailure("加载文件", failed);
      else showToast("图库已刷新");
      await refreshStats();
    }));

  const diagRefreshBtn = h("button", { class: "sbg-btn", text: "重建索引", title: "重新读取所有文件的元数据并重建索引" });
  // Whether a rebuild was seen running, so its end puts the button back and
  // reads the figures again.
  let seenRun = false;
  // The server refuses a rebuild while a folder's first index runs, so the
  // button waits for it.
  let firstRunning = false;
  const showIdle = () => {
    diagRefreshBtn.disabled = firstRunning;
    diagRefreshBtn.textContent = "重建索引";
  };
  // A root's scanning phase has no percentage, so the button reads 0% there
  // instead of the count line of files found. The search index rebuild never
  // has a total, so it shows its text alone.
  const showRunning = (data, entry) => {
    diagRefreshBtn.disabled = true;
    const kind = progressKind(data, entry);
    diagRefreshBtn.textContent = kind === "facts" ? indexRunningText(kind, entry) : `正在重建（${Math.max(0, indexPct(kind, entry))}%）`;
  };

  const onProgress = (data, meta) => {
    // The feed alone fills the In Progress row, so it counts along with any
    // run, a folder's first index included, and no slower read puts back an
    // older count.
    inProgress.set(_runningText(data));
    const entry = data && data.full;
    if (entry && entry.running) {
      seenRun = true;
      showRunning(data, entry);
      return;
    }
    const first = Object.values((data && data.roots) || {}).some((e) => e && e.running);
    if (first !== firstRunning) {
      firstRunning = first;
      if (!seenRun) showIdle();
    }
    if (!meta.settled || !seenRun) return;
    seenRun = false;
    refreshStats();
    showIdle();
  };
  confirmClick(diagRefreshBtn, async () => {
    diagRefreshBtn.disabled = true;
    diagRefreshBtn.textContent = "正在重建（0%）";
    let answer;
    try {
      answer = await apiPost("/sidebar_gallery/rebuild_index", {});
    } catch (e) {
      showIdle();
      showFailure("开始重建", e);
      return;
    }
    if (answer.status === "already_running") {
      showIdle();
      showToast("无法开始重建：另一个扫描任务正在运行。");
      return;
    }
    seenRun = true;
    _refreshGalleryWhenSettled(galleryCtx);
  });

  const diagCacheMetaBtn = h("button", { class: "sbg-btn", text: "缓存所有元数据", title: "将当前根目录中所有文件的元数据缓存至此浏览器" });
  // The tab's own cache figures show what a run stored, so only what went wrong
  // is said: a store that refused the writes, or else the files that couldn't
  // be fetched.
  diagCacheMetaBtn.addEventListener("click", () =>
    busyButton(diagCacheMetaBtn, "缓存中…", async () => {
      const items = galleryCtx.getAllItems ? galleryCtx.getAllItems() : [];
      let cached = 0;
      let skipped = 0;
      let refused = false;
      const batch = [];
      for (const it of items) {
        if (await storedSummaryOf(it)) { cached++; continue; }
        try {
          batch.push({ key: itemKey(it), value: await fetchSummary(it) });
          cached++;
          if (cached % 50 === 0) diagCacheMetaBtn.textContent = `缓存中… ${cached}/${items.length}`;
          if (batch.length >= 50 && !(await metaCache.putBatch(batch.splice(0)))) refused = true;
        } catch { skipped++; }
      }
      if (batch.length && !(await metaCache.putBatch(batch))) refused = true;
      if (refused) showFailure("缓存元数据", STORE_REFUSED);
      else if (skipped) showToast(`The metadata of ${skipped === 1 ? "1 file" : `${skipped} files`} couldn't be fetched, so it wasn't cached.`);
      await refreshStats();
  }));

  const diagCacheThumbBtn = h("button", { class: "sbg-btn", text: "缓存缩略图", title: "将当前根目录中所有文件的缩略图缓存至此浏览器" });
  diagCacheThumbBtn.addEventListener("click", () =>
    busyButton(diagCacheThumbBtn, "缓存中…", async () => {
      const items = galleryCtx.getAllItems ? galleryCtx.getAllItems() : [];
      const refusedBefore = thumbCache.refused();
      let cached = 0;
      let skipped = 0;
      for (const it of items) {
        // Fetched directly, outside the thumbnail queue and its cap, since this
        // asks for every file on purpose and one at a time already.
        try {
          if (await thumbCache.fillStore(it.thumb_url)) cached++;
          else skipped++;
          if ((cached + skipped) % 20 === 0) {
            diagCacheThumbBtn.textContent = `缓存中… ${cached}/${items.length}`;
          }
        } catch { skipped++; }
      }
      if (thumbCache.refused() > refusedBefore) showFailure("缓存缩略图", STORE_REFUSED);
      else if (skipped) showToast(skipped === 1 ? "1 thumbnail couldn't be fetched, so it wasn't cached." : `${skipped} 张缩略图获取失败，未缓存。`);
      await refreshStats();
  }));

  const diagClearMetaBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "清除元数据缓存", title: "删除此浏览器中保存的元数据缓存" });
  confirmClick(diagClearMetaBtn, async () => {
    if (!(await metaCache.clear())) showFailure("清除元数据缓存", "浏览器存储不可用");
    await refreshStats();
  });

  const diagClearThumbBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "清除缩略图缓存", title: "删除此浏览器中保存的缩略图缓存" });
  confirmClick(diagClearThumbBtn, async () => {
    const ok = await thumbCache.clear();
    // A thumbnail that failed is not asked for again until a rescan, so
    // clearing the cache also gives those files another try.
    resetFailedThumbs();
    if (!ok) showFailure("清除缩略图缓存", "浏览器存储不可用");
    await refreshStats();
  });

  const diagNukeBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "清除所有缓存并刷新", title: "删除此浏览器中的所有图库缓存并刷新页面。设置、预设和文件不受影响。" });
  confirmClick(diagNukeBtn, () => {
    cacheDb.remove();
    deleteSnapshots();
    lsRemove(B.CACHE_EPOCH);
    for (const k of B_RETIRED) lsRemove(k);

    metaCache.clearMemory();
    showToast("已清除所有缓存，正在刷新页面。");
    setTimeout(() => location.reload(), 500);
  }, { label: "确认清除并刷新？", armMs: 3000 });

  actionRow.appendChild(diagGalleryRefreshBtn);
  actionRow.appendChild(diagRefreshBtn);
  actionRow.appendChild(diagCacheMetaBtn);
  actionRow.appendChild(diagCacheThumbBtn);
  actionRow.appendChild(diagClearThumbBtn);
  actionRow.appendChild(diagClearMetaBtn);
  actionRow.appendChild(diagNukeBtn);
  wrap.appendChild(actionRow);

  wrap.appendChild(problemSlot);

  sectionTitle(wrap, "索引", "保存文件及其元数据的数据库，让图库无需重新扫描磁盘即可打开");
  const roots = galleryCtx && galleryCtx.getRoots ? galleryCtx.getRoots() : [];
  const rootRows = new Map(roots.map(r => [r.id, statRow(wrap, r.label, r.path || "此根目录中的索引文件数量及上次扫描完成时间")]));
  const total = statRow(wrap, "总计", "所有根目录中的索引文件数量");
  const kinds = [["image", "图像"], ["video", "视频"], ["audio", "音频"]].map(([kind, label]) => [kind, statRow(wrap, label)]);
  // Shown only when there are any, since a row reading zero would leave users
  // wondering what is missing from their library.
  const missing = statRow(wrap, "缺失", "扫描时无法找到的文件。文件恢复后可重新显示详情；重建索引时移除缺失超过 30 天的记录。");
  missing.set(null);
  const dbPath = statRow(wrap, "数据库路径");
  dbPath.value.classList.add("sbg-gs-value--path");
  const dbSize = statRow(wrap, "数据库大小", "数据库占用的磁盘空间，包括旁边两个 SQLite 工作文件");
  const inProgress = statRow(wrap, "进行中");
  inProgress.row.classList.add("sbg-gs-row--active");
  inProgress.set(null);

  sectionTitle(wrap, "服务器缩略图", "服务器生成并保存在 .thumbs 文件夹中的缩略图，所有浏览器共享");
  const thumbCount = statRow(wrap, "数量");
  const thumbSize = statRow(wrap, "大小");

  sectionTitle(wrap, "浏览器缩略图缓存", "此浏览器保存的缩略图，无需向服务器请求即可显示");
  const tcCount = statRow(wrap, "已缓存");
  const tcSize = statRow(wrap, "大小");

  sectionTitle(wrap, "浏览器元数据缓存", "此浏览器保存的元数据，无需向服务器请求即可打开查看器");
  const mcCount = statRow(wrap, "已存储");
  const mcSize = statRow(wrap, "大小");
  const mcMem = statRow(wrap, "内存中", "页面加载后保存在内存中的元数据");

  async function refreshStats() {
    mcMem.set(`${metaCache.memorySize} 条`);
    Promise.all([thumbCache.stats(), metaCache.stats()]).then(([ts, ms]) => {
      tcCount.set(`${ts.count.toLocaleString()} 张缩略图`);
      tcSize.set(fmtCacheSize(ts.totalSizeBytes));
      mcCount.set(`${ms.count.toLocaleString()} 条`);
      mcSize.set(fmtCacheSize(ms.totalSizeBytes));
    }).catch(() => { });

    try {
      fillStatus(await api("/sidebar_gallery/status"));
      setProblem("status", null);
    } catch (e) {
      setProblem("status", failureText("加载诊断信息", e));
      for (const r of [...rootRows.values(), total, ...kinds.map(([, r]) => r), dbPath, dbSize, thumbCount, thumbSize]) r.set("—");
      missing.set(null);
    }
  }

  function fillStatus(st) {
    const indexInfo = st.index;
    const lastScans = indexInfo.last_scan || {};
    for (const [rid, count] of Object.entries(indexInfo.counts)) {
      if (!rootRows.has(rid)) rootRows.set(rid, statRow(wrap, rid, "此根目录中的索引文件数量及上次扫描完成时间", total.row));
      const when = lastScans[rid] ? " · 扫描于 " + timeAgo(lastScans[rid]) : "";
      rootRows.get(rid).set(Number(count).toLocaleString() + " 个文件" + when);
    }
    total.set(typeof indexInfo.total === "number" ? indexInfo.total.toLocaleString() + " files" : null);
    for (const [kind, row] of kinds) {
      const n = (indexInfo.kinds || {})[kind];
      row.set((typeof n === "number" ? n : 0).toLocaleString());
    }
    missing.set(indexInfo.hidden ? indexInfo.hidden.toLocaleString() : null);
    dbPath.set(indexInfo.db_path || null);
    dbSize.set(indexInfo.db_size_mb !== undefined ? `${indexInfo.db_size_mb} MB` : null);
    thumbCount.set((st.thumbnails?.count || 0).toLocaleString());
    thumbSize.set(`${st.thumbnails?.size_mb || 0} MB`);
  }

  content.appendChild(wrap);

  if (indexOnly) return;
  visitCleanups.push(progressFeed.subscribe(onProgress));
  visitCleanups.push(indexEndings.subscribe(drawIndexFailures));
  drawIndexFailures();
  refreshStats();
}
