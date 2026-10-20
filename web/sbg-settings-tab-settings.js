import { h, api, apiPost } from "./sbg-core.js";
import { sectionTitle, settingRow, toggle, comboInput, numberInput } from "./sbg-settings-inputs.js";
import { S } from "./sbg-settings-catalog.js";
import { showToast, showFailure, failureText, confirmClick, noticeRow } from "./sbg-toast.js";
import { TRASH_ICON } from "./sbg-icons.js";
import { announceConfigFiles } from "./sbg-gallery-data.js";
import { galleryCache } from "./sbg-gallery-store.js";

const _postConfig = (patch) => apiPost("/sidebar_gallery/config", patch);

// The focused control stays enabled because disabling it would drop the focus,
// so a box goes read-only instead and a button or switch refuses in its handler.
function _hold(editors, on) {
  for (const el of editors) {
    const keep = on && el === document.activeElement;
    el.disabled = on && !keep;
    if (el.tagName === "INPUT") el.readOnly = keep;
  }
}

export function renderSettings({ content, galleryCtx, indexOnly }) {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });

  const _loadCfg = async () => {
    const cfg = await api("/sidebar_gallery/config");
    announceConfigFiles(cfg);
    return cfg;
  };

  // The save has already landed, so a failed reload is only logged, and the
  // gallery retries the read on its own.
  const _reloadGallery = async () => {
    if (!galleryCtx.refreshConfig) return;
    try { await galleryCtx.refreshConfig(); }
    catch (e) { console.warn("[SBG] The gallery could not reload the folder settings after a save:", e); }
  };

  const _held = (cfg) => !cfg || !!cfg.unreadable;

  sectionTitle(wrap, "排序");
  wrap.appendChild(comboInput(S.SORT,
    "图库打开时使用的排序。手动选择排序后，在刷新页面前会保留该排序。"));

  sectionTitle(wrap, "删除");
  wrap.appendChild(toggle(S.DELETE_CONFIRM,
    "在查看器或卡片右键菜单中删除文件时，需要再次点击确认后才移至回收站。关闭后单击即可删除。"));

  sectionTitle(wrap, "查看器缩放和平移");
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "在查看器中缩放和平移图片或视频。双指捏合始终缩放；放大后可拖动平移。" }));
  wrap.appendChild(comboInput(S.LB_ZOOM_SCROLL_MODE,
    "在图片上滚动时的行为。“鼠标”滚动缩放；“触控板”在放大后双指滚动平移；“自动”识别输入设备。"));
  wrap.appendChild(comboInput(S.LB_ZOOM_ANCHOR, "朝向鼠标指针或视图中心缩放。"));
  wrap.appendChild(numberInput(S.LB_ZOOM_SENSITIVITY, "缩放速度为 0.1 至 5，默认值为 1。"));
  wrap.appendChild(comboInput(S.LB_COMPARE_ZOOM, "在对比模式中，仅缩放和平移鼠标所在一侧，或两侧同步操作。"));
  wrap.appendChild(toggle(S.LB_ZOOM_KEEP_ON_NAV,
    "切换上一个或下一个文件时保持缩放和位置。关闭后，每个文件打开时均适合屏幕。"));

  sectionTitle(wrap, "查看器元数据面板");
  wrap.appendChild(toggle(S.META_TAB_PERSIST, "切换文件时保留当前标签页。"));

  sectionTitle(wrap, "媒体库");

  let arSaved = "";
  const arInput = h("input", { type: "number", class: "sbg-gs-input", min: "0", step: "5", value: "" });
  arInput.disabled = true;

  const _applyAr = (cfg) => {
    if (cfg && typeof cfg.auto_refresh_interval_s === "number") arInput.value = arSaved = String(cfg.auto_refresh_interval_s);
    arInput.disabled = _held(cfg);
  };
  arInput.addEventListener("change", async () => {
    const n = Math.max(0, Math.floor(Number(arInput.value) || 0));
    _hold([arInput], true);
    let cfg = null;
    try {
      cfg = await _postConfig({ auto_refresh_interval_s: n });
    } catch (e) {
      arInput.value = arSaved;
      _hold([arInput], false);
      showFailure("保存此设置", e);
      return;
    }
    // The server clamps the interval, so the box takes the value it saved and
    // the toast speaks only when that differs from what was typed.
    const eff = (cfg && typeof cfg.auto_refresh_interval_s === "number") ? cfg.auto_refresh_interval_s : n;
    arInput.value = arSaved = String(eff);
    _hold([arInput], false);

    if (eff > 0 && eff !== n) showToast(`自动刷新间隔已设为 ${eff} 秒，这是允许的${eff > n ? "最短" : "最长"}间隔。`);
    await _reloadGallery();
  });
  wrap.appendChild(settingRow("自动刷新间隔（秒）", arInput,
    "图库检查磁盘中文件新增、删除或重命名的间隔，最短 5 秒，0 表示关闭。返回图库时仍会检查。立即生效。"));

  const noticeSlot = h("div", { class: "sbg-notices sbg-gs-notices" });
  wrap.appendChild(noticeSlot);

  function _renderNotice(cfg, failure, retried = false) {
    noticeSlot.innerHTML = "";
    if (!_held(cfg)) return;
    const text = cfg
      ? `${failureText("打开文件夹设置文件", cfg.unreadable)}。打开该文件后才能编辑下方文件夹。`
      : `${failureText("加载下方文件夹", failure)}。加载完成后才能编辑。`;
    const line = noticeRow(retried ? `${text} 已重试。` : text, () => { noticeSlot.innerHTML = ""; content.focus(); }, { failure: true });
    const again = h("button", { class: "sbg-btn sbg-btn--sm", text: "重试" });
    again.addEventListener("click", async () => {
      again.disabled = true;
      again.textContent = "重试中…";
      await _loadAll(true);
    });
    line.insertBefore(again, line.querySelector(".sbg-notice__x"));
    noticeSlot.appendChild(line);
  }

  // Each list entry goes straight into the form as its own row, since the
  // settings search counts and marks the form's children one by one.
  const listRow = (label, sub) => {
    const el = h("div", { class: "sbg-gs-row" });
    el.appendChild(h("span", { class: "sbg-gs-label", text: label, title: sub || "" }));
    if (sub) el.appendChild(h("span", { class: "sbg-gs-desc--inline sbg-gs-subpath", text: sub }));
    return el;
  };
  const trashButton = (title) => h("button", { class: "sbg-btn sbg-btn--icon sbg-btn--icon-danger", html: TRASH_ICON, title });

  sectionTitle(wrap, "文件夹");
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "除 ComfyUI 输出文件夹外，可浏览和建立索引的其他文件夹。路径位于运行 ComfyUI 的机器上。" }));
  const outputRow = listRow("输出", "ComfyUI 输出文件夹");
  outputRow.appendChild(h("span", { class: "sbg-gs-desc--inline", text: "始终包含" }));
  wrap.appendChild(outputRow);
  const addHint = h("div", { class: "sbg-gs-desc sbg-gs-desc--top-gap" });
  addHint.appendChild(document.createTextNode(
    "要添加文件夹，请打开 sidebar_gallery_config.json，在 extra_roots 列表中填入路径，例如 "));
  addHint.appendChild(h("code", { text: '{"extra_roots": ["C:/Renders"]}' }));
  addHint.appendChild(document.createTextNode("。图库将在几秒内识别此更改。"));
  wrap.appendChild(addHint);
  const configPath = h("div", { class: "sbg-gs-path sbg-hidden" });
  wrap.appendChild(configPath);

  // A removal names one folder and the server takes it from what the file holds,
  // so a list drawn before the file changed cannot drop a folder added since.
  let foldersBusy = false;
  let folderRows = [];
  let folderBins = [];

  function _renderFolders(cfg) {
    const held = _held(cfg);
    for (const el of folderRows) el.remove();
    folderRows = [];
    folderBins = [];
    for (const p of (cfg && cfg.extra_roots) || []) {
      const el = listRow(p.split(/[\\/]/).pop() || p, p);
      const del = trashButton("从图库中移除此文件夹（不会删除磁盘上的文件）");
      del.disabled = held;
      confirmClick(del, async () => {
        if (foldersBusy) return;
        foldersBusy = true;
        _hold(folderBins, true);
        let next;
        try { next = await _postConfig({ extra_roots_remove: [p] }); }
        catch (e) { showFailure("移除文件夹", e); return; }
        finally { foldersBusy = false; _hold(folderBins, false); }
        const had = document.activeElement === del;
        const at = folderBins.indexOf(del);
        _renderFolders(next);
        if (had) (folderBins[at] || folderBins[at - 1] || inp).focus();
        await _reloadGallery();
      }, { label: "确认移除？", busy: () => foldersBusy });
      el.appendChild(del);
      folderRows.push(el);
      folderBins.push(del);
      wrap.insertBefore(el, addHint);
    }
    const path = (cfg && cfg.config_path) || "";
    configPath.textContent = path;
    configPath.title = path;
    configPath.classList.toggle("sbg-hidden", !path);
  }

  sectionTitle(wrap, "排除的文件夹");
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "扫描时跳过的文件夹名称，例如 thumbnails 或 backup。匹配任意深度的同名文件夹，不区分大小写。下次扫描时生效。" }));

  let excludedBusy = false;
  let excluded = [];
  let excludedRows = [];
  let excludedBins = [];

  const hiddenChk = h("input", { type: "checkbox", class: "sbg-gs-switch" });
  hiddenChk.disabled = true;

  // The focused switch stays enabled while it saves, so a second press is
  // stopped here before it can flip the box.
  hiddenChk.addEventListener("click", (e) => { if (excludedBusy) e.preventDefault(); });
  hiddenChk.addEventListener("change", async () => {
    setBusy(true);
    try { await _postConfig({ index_hidden_dirs: hiddenChk.checked }); }
    catch (e) {
      hiddenChk.checked = !hiddenChk.checked;
      showFailure("保存此设置", e);
      return;
    } finally { setBusy(false); }
    await _reloadGallery();
  });
  wrap.appendChild(settingRow("包含隐藏文件夹", hiddenChk,
    "同时扫描名称以点开头的文件夹，例如 .thumbs。"));

  const addRow = h("div", { class: "sbg-gs-row sbg-gs-row--gap" });
  const inp = h("input", { type: "text", class: "sbg-gs-input sbg-gs-grow", placeholder: "thumbnails" });
  const addBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "+ 添加" });
  inp.disabled = true;
  addBtn.disabled = true;
  addRow.append(inp, addBtn);
  wrap.appendChild(addRow);

  const setBusy = (on) => {
    excludedBusy = on;
    _hold([hiddenChk, inp, addBtn, ...excludedBins], on);
  };

  function _renderExcluded(cfg) {
    const held = _held(cfg);
    excluded = (cfg && cfg.excluded_dirs) || [];
    for (const el of excludedRows) el.remove();
    excludedRows = [];
    excludedBins = [];
    hiddenChk.checked = !!(cfg && cfg.index_hidden_dirs);
    for (const el of [hiddenChk, inp, addBtn]) el.disabled = held;
    for (const name of excluded) {
      const el = listRow(name);
      const del = trashButton("停止排除此文件夹（其中的文件将在下次扫描后重新显示）");
      del.disabled = held;
      del.addEventListener("click", async () => {
        if (excludedBusy) return;
        setBusy(true);
        let next;
        try { next = await _postConfig({ excluded_dirs_remove: [name] }); }
        catch (e) { showFailure("保存此设置", e); return; }
        finally { setBusy(false); }
        const had = document.activeElement === del;
        const at = excludedBins.indexOf(del);
        _renderExcluded(next);
        if (had) (excludedBins[at] || excludedBins[at - 1] || inp).focus();
        await _reloadGallery();
      });
      el.appendChild(del);
      excludedRows.push(el);
      excludedBins.push(del);
    }
    if (!excluded.length) excludedRows.push(h("div", { class: "sbg-gs-row sbg-gs-desc--inline", text: "没有额外排除的文件夹。" }));
    for (const el of excludedRows) wrap.insertBefore(el, addRow);
  }

  const doAdd = async () => {
    if (excludedBusy) return;

    // An exclude matches a folder name, so a pasted path keeps only its last segment.
    const name = (inp.value.split(/[\\/]/).filter(Boolean).pop() || "").trim().toLowerCase();
    if (!name || name === "." || name === "..") { showToast("请输入要排除的文件夹名称"); return; }
    if (excluded.includes(name)) { showToast(`“${name}”已被排除。`); inp.value = ""; return; }
    setBusy(true);
    let next;
    try { next = await _postConfig({ excluded_dirs_add: [name] }); }
    catch (e) { showFailure("排除文件夹", e); return; }
    finally { setBusy(false); }
    inp.value = "";
    _renderExcluded(next);
    await _reloadGallery();
  };
  addBtn.addEventListener("click", doAdd);
  inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") doAdd(); });

  sectionTitle(wrap, "性能");
  wrap.appendChild(numberInput(S.VSCROLL_BUFFER, "在屏幕上下方预先创建的卡片行数，范围为 1 至 30。行数越多，缩略图加载越提前，浏览器负担也越大。"));
  wrap.appendChild(numberInput(S.GRID_WHEEL_SPEED,
    "鼠标滚轮及触控板每次滚动的距离，范围为 25 至 400。100 为浏览器正常速度。立即生效。"));

  function _show(cfg, failure = "", retried = false) {
    _applyAr(cfg);
    _renderNotice(cfg, failure, retried);
    _renderFolders(cfg);
    _renderExcluded(cfg);
  }
  async function _loadAll(retried = false) {
    let cfg = null;
    let failure = "";
    try { cfg = await _loadCfg(); } catch (e) { failure = e; }
    _show(cfg, failure, retried);
  }

  // The settings search renders this tab into a detached element to count its
  // matches, so it draws the lists from the config the gallery last read.
  if (!indexOnly) _loadAll();
  else if (galleryCache.config.last) _show(galleryCache.config.last);

  content.appendChild(wrap);
}
