/**
 * sbg-settings.js: Gallery Settings overlay
 *
 * Contains the full settings panel: Layout Editor, Appearance,
 * Keybindings, Settings, Presets, and Diagnostics tabs.
 */

import {
  h, api, showToast,
  getSetting, saveSetting, fmtBytes, applyCustomThemeVars, confirmClick,
  parseColor, formatColor, formatRgba, checkerBg,
  _metaCache, _metaCacheAPI, _resetIdb,
  _thumbCacheAPI, _thumbMemCache, resetFailedThumbs,
  S, APP_REGISTRY,
  progressPoller, formatProgress,
} from "./sbg-core.js";

import { renderLayout, clearSwatchCache } from "./sbg-layout-editor.js";
import { createColorPicker } from "./sbg-color-picker.js";
import { replaceElementColor } from "./sbg-translation-layer.js";
import { itemKey } from "./sbg-compare-utils.js";

/**
 * Keybinding capture and apply for presets, kept as one pair so the two halves
 * cannot drift apart. An untouched binding is stored as null, and apply treats
 * null and "" alike as "not set here": a stored "" parses to zero chunks and
 * matches no key, so honouring it would silently disable every action the
 * preset author left alone, Escape included. Older presets and the shipped
 * themes hold "" for untouched bindings, so the empty check protects them.
 */
export function _capturePresetKeys() {
  const keys = {};
  for (const [k, id] of Object.entries(S)) {
    if (k.startsWith("KEY_")) keys[id] = getSetting(id, null);
  }
  return keys;
}

export function _applyPresetKeys(keys) {
  for (const [id, val] of Object.entries(keys || {})) {
    if (val !== null && val !== "") saveSetting(id, val);
  }
}

export function openGallerySettings(galleryCtx, defaultTab = "layout") {
const gsOverlay = h("div", { class: "sbg-gs-overlay" });
const gsPanel = h("div", { class: "sbg-gs-panel" });

// Header
const gsClose = h("button", { class: "sbg-gs-close", text: "✕", title: "关闭" });
const gsHeader = h("div", { class: "sbg-gs-header" }, [
  h("span", { class: "sbg-gs-title", text: "⚙ 图库设置" }),
  gsClose,
]);

// Tab bar
const TAB_LABELS = { layout: "布局", appearance: "外观", keybindings: "快捷键", settings: "设置", presets: "预设", diagnostics: "诊断" };
const tabBtns = Object.entries(TAB_LABELS).map(([id, label]) =>
  h("button", { class: "sbg-gs-tab", text: label, "data-tab": id })
);
const tabBar = h("div", { class: "sbg-gs-tabs" }, tabBtns);
const content = h("div", { class: "sbg-gs-content" });

gsPanel.appendChild(gsHeader);
gsPanel.appendChild(tabBar);
gsPanel.appendChild(content);
gsOverlay.appendChild(gsPanel);

// Appending to sbg-root when present makes the panel inherit the native themes.
const sbgRoot = document.querySelector(".sbg-root");
if (sbgRoot) {
  sbgRoot.appendChild(gsOverlay);
} else {
  document.body.appendChild(gsOverlay);
}

// Cleanup callbacks run when the settings panel closes. Color-input popovers
// append panels and global listeners to the document; these must be removed to
// avoid leaking DOM each time settings is opened.
const _gsCleanups = [];
function closeGS() {
  for (const fn of _gsCleanups.splice(0)) { try { fn(); } catch { } }
  document.removeEventListener("keydown", _gsKey);
  gsOverlay.remove();
}
function _gsKey(e) { if (e.key === "Escape") closeGS(); }
gsClose.addEventListener("click", closeGS);
gsOverlay.addEventListener("click", (e) => { if (e.target === gsOverlay) closeGS(); });
document.addEventListener("keydown", _gsKey);

function _fmtCacheSize(bytes) {
  return !bytes || bytes <= 0 ? "—" : fmtBytes(bytes);
}

async function refreshDiagStats(diagStatsContainer) {
  try {
    const st = await api("/sidebar_gallery/status");
    diagStatsContainer.innerHTML = "";

    const indexInfo = st.index || {};
    const counts = indexInfo.counts || st.index || {};
    const indexTitle = h("div", { class: "sbg-diag-section__title", text: "SQLite 索引", title: "服务器端 SQLite 数据库保存文件列表和元数据摘要，便于快速加载图库，无需扫描磁盘" });
    diagStatsContainer.appendChild(indexTitle);

    const countsObj = typeof counts === "object" && !Array.isArray(counts) ? counts : {};
    for (const [rid, count] of Object.entries(countsObj)) {
      if (rid === "db_path" || rid === "db_size_mb" || rid === "counts") continue;
      diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [
        h("span", { class: "sbg-diag-stat__label", text: rid }),
        h("span", { class: "sbg-diag-stat__value", text: Number(count).toLocaleString() + " 个文件" }),
      ]));
    }

    if (indexInfo.db_path) {
      diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat", title: "SQLite 数据库文件的完整路径" }, [
        h("span", { class: "sbg-diag-stat__label", text: "数据库路径" }),
        h("span", { class: "sbg-diag-stat__value sbg-diag-stat__value--path", text: indexInfo.db_path }),
      ]));
    }
    if (indexInfo.db_size_mb !== undefined) {
      diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat", title: "SQLite 数据库文件占用的磁盘空间" }, [
        h("span", { class: "sbg-diag-stat__label", text: "数据库大小" }),
        h("span", { class: "sbg-diag-stat__value", text: `${indexInfo.db_size_mb} MB` }),
      ]));
    }

    try {
      // Keyed shape: {running:<full>, full:{...}|null, roots:{rid:{...}}}.
      // Show the full rebuild if one runs, else any root's first index.
      const prog = await fetch("/sidebar_gallery/reindex_progress").then(r => r.json());
      const entry = (prog.full && prog.full.running)
        ? prog.full
        : Object.values(prog.roots || {}).find(e => e && e.running) || null;
      if (entry) {
        const f = formatProgress(entry);
        diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat", style: "margin-top:6px;color:var(--sbg-accent)" }, [
          h("span", { class: "sbg-diag-stat__label", text: `${entry.phase || "正在建立索引"}…` }),
          h("span", { class: "sbg-diag-stat__value", text: f.text }),
        ]));
      }
    } catch { }

    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-section__title", text: "服务器缩略图", title: "JPEG 缩略图生成后保存在服务器的 .thumbs 文件夹中，供所有浏览器和客户端共用。每次请求都直接从磁盘读取。", style: "margin-top:10px" }));
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "数量" }), h("span", { class: "sbg-diag-stat__value", text: (st.thumbnails?.count || 0).toLocaleString() })]));
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "大小" }), h("span", { class: "sbg-diag-stat__value", text: `${st.thumbnails?.size_mb || 0} MB` })]));

    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-section__title", text: "浏览器缩略图缓存", title: "缩略图缓存在此浏览器的 IndexedDB 中，可直接加载而无需请求服务器。", style: "margin-top:10px" }));
    const _tcCountEl = h("span", { class: "sbg-diag-stat__value", text: "…" });
    const _tcSizeEl = h("span", { class: "sbg-diag-stat__value", text: "…" });
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "已缓存" }), _tcCountEl]));
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "大小" }), _tcSizeEl]));

    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-section__title", text: "浏览器元数据缓存", title: "解析后的元数据摘要缓存在 IndexedDB 和内存中。", style: "margin-top:10px" }));
    const _mcCountEl = h("span", { class: "sbg-diag-stat__value", text: "…" });
    const _mcSizeEl = h("span", { class: "sbg-diag-stat__value", text: "…" });
    const _mcMemEl = h("span", { class: "sbg-diag-stat__value", text: `${_metaCache.size} 条` });
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "IndexedDB" }), _mcCountEl]));
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat" }, [h("span", { class: "sbg-diag-stat__label", text: "大小" }), _mcSizeEl]));
    diagStatsContainer.appendChild(h("div", { class: "sbg-diag-stat", title: "当前会话中保存在 JS 内存里的元数据条目" }, [h("span", { class: "sbg-diag-stat__label", text: "内存中" }), _mcMemEl]));

    Promise.all([_thumbCacheAPI.getStats(), _metaCacheAPI.getStats()]).then(([ts, ms]) => {
      _tcCountEl.textContent = `${ts.count.toLocaleString()} 张缩略图`;
      _tcSizeEl.textContent = _fmtCacheSize(ts.totalSizeBytes);
      _mcCountEl.textContent = `${ms.count.toLocaleString()} 条`;
      _mcSizeEl.textContent = _fmtCacheSize(ms.totalSizeBytes);
    }).catch(() => { });
  } catch (e) {
    diagStatsContainer.innerHTML = `<div style="padding:8px;color:var(--sbg-text-dim)">错误：${e?.message || e}</div>`;
  }
}

function _settingRow(label, input, tooltip) {
  const row = h("div", { class: "sbg-gs-row", title: tooltip || "" });
  row.appendChild(h("label", { class: "sbg-gs-label", text: label }));
  row.appendChild(input);
  return row;
}

function _toggle(id, fallback, label, tooltip) {
  const val = getSetting(id, fallback);
  const cb = h("input", { type: "checkbox" });
  cb.checked = !!val;
  cb.addEventListener("change", () => saveSetting(id, cb.checked));
  return _settingRow(label, cb, tooltip);
}

function _textInput(id, fallback, label, tooltip) {
  const val = getSetting(id, fallback);
  const inp = h("input", { type: "text", class: "sbg-gs-input", value: String(val || "") });
  inp.addEventListener("change", () => saveSetting(id, inp.value));
  return _settingRow(label, inp, tooltip);
}

// Resolve the live accent to a concrete rgb() string, read the same way the CSS
// resolves it: through a hidden probe on the gallery root. The accent is declared as
// var(--p-primary-color, ...), so reading the property value directly returns that
// unresolved var() text. Falls back to the historic accent when the root is absent.
function _resolveAccent() {
  const root = document.querySelector(".sbg-root");
  if (!root) return "#7c6aef";
  const probe = h("span", { style: "display:none;color:var(--sbg-accent,#7c6aef)" });
  root.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c || "#7c6aef";
}

function _colorInput(id, fallback, label, tooltip, callback, replaceChannel) {
  const val = getSetting(id, fallback);
  const wrap = h("div", { class: "sbg-gs-color-wrap", style: "position:relative" });

  // displayColor: what the swatch, text field and picker show. Stored colours are
  // always rgba, and older saved hex still parses. When nothing is stored and no
  // fallback is given (the lightbox buttons, which mean "follow the accent"), show
  // the live accent so the swatch and picker match the button. Unparseable values
  // such as "var(--sbg-accent)" are shown verbatim.
  let displayColor = val || fallback || _resolveAccent();
  // The text field always reads as rgba(...), matching the colour picker, even
  // at full opacity.
  const _toRgba = (c) => { const pc = parseColor(c); return pc ? formatRgba(pc.r, pc.g, pc.b, pc.a) : c; };

  // Pill colour rows only: debounced find-and-replace of matching per-element pill
  // colours. The baseline is the colour before the current edit burst, so dragging
  // the picker (which fires applyColor continuously) commits one old-to-new replace at
  // the end rather than chasing every intermediate value.
  let _replBaseline = displayColor, _replTimer = null;

  function applyColor(color) {
    const prev = displayColor;
    displayColor = color;
    swatch.style.background = checkerBg(color);
    text.value = _toRgba(color);
    saveSetting(id, color);
    if (callback) callback(color);
    // A global colour changed, so drop the layout editor's cached swatch defaults
    // so its param/tab/section colour pickers re-read the new value.
    clearSwatchCache();
    if (replaceChannel) {
      if (_replTimer === null) _replBaseline = prev; // first change of a burst
      clearTimeout(_replTimer);
      _replTimer = setTimeout(() => { _replTimer = null; replaceElementColor(replaceChannel, _replBaseline, displayColor); }, 400);
    }
  }

  const swatch = h("div", {
    class: "sbg-color-swatch",
    style: "width:28px;height:28px;border-radius:6px;border:2px solid var(--sbg-border);cursor:pointer;flex-shrink:0;transition:box-shadow 0.15s;"
  });
  swatch.style.background = checkerBg(displayColor);
  swatch.addEventListener("mouseenter", () => { swatch.style.boxShadow = "0 0 0 2px var(--sbg-accent)"; });
  swatch.addEventListener("mouseleave", () => { swatch.style.boxShadow = ""; });

  // Accepts hex or rgba. Wide enough for a full rgba(r, g, b, a) value.
  const text = h("input", { type: "text", class: "sbg-gs-input sbg-gs-input--sm", style: "min-width:26ch", value: _toRgba(displayColor) });
  text.addEventListener("change", () => {
    const v = text.value.trim();
    const pc = parseColor(v);
    if (pc) { applyColor(formatColor(pc.r, pc.g, pc.b, pc.a)); if (picker) { picker.destroy(); panel.removeChild(picker.panel); picker = null; } }
    else { displayColor = v; swatch.style.background = checkerBg(v); saveSetting(id, v); if (callback) callback(v); }
  });

  const panel = h("div", { class: "sbg-color-panel", style: "display:none;position:fixed;z-index:9999;background:var(--sbg-surface,#1e1e1e);border:1px solid var(--sbg-border);border-radius:10px;padding:12px;box-shadow:0 12px 40px rgba(0,0,0,0.6);width:max-content;min-width:220px;" });
  let picker = null;
  function ensurePicker() {
    if (picker) return;
    picker = createColorPicker({ initialColor: displayColor, onChange: applyColor });
    panel.appendChild(picker.panel);
    picker.init();
  }
  function positionPanel() {
    const swatchRect = swatch.getBoundingClientRect();
    const panelH = panel.offsetHeight || 360, panelW = panel.offsetWidth || 220;
    let left = swatchRect.left;
    if (left + panelW > window.innerWidth - 8) left = window.innerWidth - panelW - 8;
    if (left < 8) left = 8;
    let top = swatchRect.top - panelH - 4;
    if (top < 8) top = swatchRect.bottom + 4;
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  }

  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = panel.style.display !== "none";
    document.querySelectorAll(".sbg-color-panel").forEach(p => { p.style.display = "none"; });
    if (!isOpen) {
      ensurePicker();
      panel.style.display = "block";
      requestAnimationFrame(positionPanel);
    }
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
  const _docClick = () => { panel.style.display = "none"; };
  document.addEventListener("click", _docClick);

  wrap.appendChild(swatch);
  wrap.appendChild(text);
  document.body.appendChild(panel);
  // Remove the body-level panel and global listener when settings closes,
  // otherwise every settings open leaks another panel into the page.
  _gsCleanups.push(() => {
    document.removeEventListener("click", _docClick);
    if (picker) { try { picker.destroy(); } catch { } }
    panel.remove();
  });
  return _settingRow(label, wrap, tooltip);
}

const OPTION_LABELS = {
  comfyui: "跟随 ComfyUI", dark: "深色", blue: "蓝色", midnight: "午夜",
  synthwave: "合成波", retro: "复古", custom: "自定义",
  auto: "自动", square: "方形", ar: "原始比例",
  created_desc: "创建时间：最新优先", created_asc: "创建时间：最早优先",
  modified_desc: "修改时间：最新优先", modified_asc: "修改时间：最早优先",
  name_asc: "名称：升序", name_desc: "名称：降序",
  size_desc: "大小：从大到小", size_asc: "大小：从小到大",
  mouse: "鼠标", touchpad: "触控板", cursor: "光标", center: "中心",
  independent: "独立", synced: "同步",
  enhanced: "增强", initial: "初始", remember: "记住上次选择",
  basename: "仅文件名", relpath: "相对路径",
};

function _comboInput(id, fallback, options, label, tooltip, callback) {
  const val = getSetting(id, fallback);
  const sel = h("select", { class: "sbg-gs-select" }, options.map(o => h("option", { value: o, text: OPTION_LABELS[o] || o })));
  sel.value = val;
  sel.addEventListener("change", () => { saveSetting(id, sel.value); if (callback) callback(sel.value); });
  return _settingRow(label, sel, tooltip);
}

function _numberInput(id, fallback, label, tooltip) {
  const val = getSetting(id, fallback);
  const inp = h("input", { type: "number", class: "sbg-gs-input sbg-gs-input--sm", value: String(val || fallback) });
  inp.addEventListener("change", () => saveSetting(id, Number(inp.value)));
  return _settingRow(label, inp, tooltip);
}

// Tab Renderers


/* Layout Editor, rendered by sbg-layout-editor.js */















function renderAppearance() {
  // The colour rows attach their panels and document listeners to the body,
  // and a re-visit rebuilds every row, so the previous visit's set is flushed
  // here (closeGS still covers the final set).
  for (const fn of _gsCleanups.splice(0)) { try { fn(); } catch { } }
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  function _badgePreview(text, color) {
    return h("span", { text, style: `display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;color:#fff;background:${color};margin-right:4px;` });
  }

  // One builder for the colour rows: the preview chip sits in the label slot
  // (with optional text around it) and re-colours through onColor as the
  // input changes. onColor receives the raw picked value ("" = default).
  function _chipRow(id, fallback, chip, opts) {
    const row = _colorInput(id, fallback, "", opts.tooltip || "", opts.onColor);
    const label = row.querySelector(".sbg-gs-label");
    if (label) {
      label.innerHTML = "";
      if (opts.prefix) label.appendChild(document.createTextNode(opts.prefix));
      label.appendChild(chip);
      if (opts.caption) label.appendChild(document.createTextNode(opts.caption));
    }
    wrap.appendChild(row);
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "徽标颜色" }));

  for (const [key, def, text, caption, tip] of [
    [S.BADGE_HIGH_COLOR, "#f87171", "HIGH", " 徽标", "HIGH／基础 KSampler 和模型徽标的颜色"],
    [S.BADGE_LOW_COLOR, "#60a5fa", "LOW", " 徽标", "LOW／精修 KSampler 和模型徽标的颜色"],
    [S.VIDEO_BADGE_COLOR, "#facc15", "MP4", " 徽标", "视频和音频缩略图的格式徽标颜色"],
    [S.SEARCH_TAG_COLOR, "#6495ed", "search", " 搜索徽标", "搜索栏中搜索标签徽标的颜色"],
    [S.SEARCH_TAG_NEG_COLOR, "#ef4444", "\u2212exclude", " 排除徽标", "排除搜索标签徽标的颜色"],
  ]) {
    const chip = _badgePreview(text, getSetting(key, def) || def);
    if (key === S.VIDEO_BADGE_COLOR) chip.style.color = "#000";
    _chipRow(key, def, chip, { caption, tooltip: tip, onColor: (c) => { chip.style.background = c; } });
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "高亮颜色", style: "margin-top:16px" }));
  const hlColor = localStorage.getItem("SBG.GS.HighlightBg") || "rgba(250, 204, 21, 0.35)";
  const hlSample = h("span", { text: "高亮", style: `background:${hlColor};padding:1px 4px;border-radius:2px;` });
  _chipRow("HighlightBg", "rgba(250, 204, 21, 0.35)", hlSample, {
    prefix: "搜索",
    tooltip: "元数据面板中搜索结果的高亮背景色",
    onColor: (c) => {
      localStorage.setItem("SBG.GS.HighlightBg", c);
      document.documentElement.style.setProperty("--sbg-highlight-bg", c);
      hlSample.style.background = c || "rgba(250, 204, 21, 0.35)";
    },
  });

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "主题", style: "margin-top:16px" }));

  const customWrap = h("div", { class: "sbg-gs-form sbg-gs-custom-theme", style: getSetting(S.THEME, "comfyui") === "custom" ? "display:block; margin-top:10px; padding:10px; background:rgba(0,0,0,0.15); border-radius:5px; border:1px solid var(--sbg-border)" : "display:none" });

  wrap.appendChild(_comboInput(S.THEME, "comfyui", ["comfyui", "dark", "blue", "midnight", "synthwave", "retro", "custom"], "图库主题", "图库侧边栏的配色主题", (val) => {
    const rootEl = document.querySelector(".sbg-root");
    if (rootEl) {
      if (val !== "comfyui") rootEl.setAttribute("data-theme", val);
      else rootEl.removeAttribute("data-theme");
      applyCustomThemeVars(rootEl, val);
    }
    customWrap.style.display = val === "custom" ? "block" : "none";
  }));

  customWrap.appendChild(h("div", { class: "sbg-gs-desc", text: "配置自定义界面颜色。" }));
  const applyVar = (v, c) => { if (getSetting(S.THEME, "comfyui") === "custom") document.querySelector(".sbg-root")?.style.setProperty(v, c); };
  customWrap.appendChild(_colorInput("CUSTOM_BG", "#1a1a1a", "背景", "基础背景色", (c) => applyVar("--sbg-bg", c)));
  customWrap.appendChild(_colorInput("CUSTOM_SURFACE", "#222222", "表面", "表面背景色", (c) => applyVar("--sbg-surface", c)));
  customWrap.appendChild(_colorInput("CUSTOM_BORDER", "#444444", "边框元素", "边框和分隔线", (c) => applyVar("--sbg-border", c)));
  customWrap.appendChild(_colorInput("CUSTOM_TEXT", "#e0e0e0", "文字", "主要文字颜色", (c) => applyVar("--sbg-text", c)));
  customWrap.appendChild(_colorInput("CUSTOM_ACCENT", "#7c6aef", "强调色", "主要强调色", (c) => applyVar("--sbg-accent", c)));
  wrap.appendChild(customWrap);

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "查看器按钮颜色", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "留空则使用默认颜色。" }));

  const _ACCENT = "var(--sbg-accent,#7c6aef)";
  function _btnPreview(text, color) {
    return h("span", { text, style: `display:inline-block;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:500;color:#fff;background:${color || _ACCENT};cursor:default;` });
  }

  for (const [key, text, tip] of [
    [S.LB_COLOR_DOWNLOAD, "下载", "下载按钮的背景色"],
    [S.LB_COLOR_COPY_PROMPT, "复制提示词", "复制提示词按钮的背景色"],
    [S.LB_COLOR_COPY_WF, "复制工作流", "复制工作流按钮的背景色"],
    [S.LB_COLOR_LOAD_WF, "加载工作流", "加载工作流按钮的背景色"],
    [S.LB_COLOR_COMPARE, "对比", "对比按钮的背景色"],
  ]) {
    const chip = _btnPreview(text, getSetting(key, ""));
    _chipRow(key, "", chip, { tooltip: tip, onColor: (c) => { chip.style.background = c || _ACCENT; } });
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "应用徽标颜色", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "自定义各来源应用的徽标颜色。留空则使用默认颜色。" }));

  // Rows derive from the single app registry in sbg-core.js, so the preview
  // here, the boot-time CSS vars, and the lightbox badge read the same defaults.
  for (const a of APP_REGISTRY) {
    const chip = _badgePreview(a.label, getSetting(a.settingKey, "") || a.defaultColor);
    _chipRow(a.settingKey, a.defaultColor, chip, {
      tooltip: `Color for ${a.label} source badge`,
      onColor: (c) => {
        const color = c || a.defaultColor;
        chip.style.background = color;
        document.documentElement.style.setProperty(a.cssVar, color);
      },
    });
    const saved = getSetting(a.settingKey, "");
    if (saved) document.documentElement.style.setProperty(a.cssVar, saved);
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "初始图像标签页", style: "margin-top:16px" }));
  const initTabBadge = _badgePreview("初始图像", getSetting(S.INITIAL_IMAGE_TAB_COLOR, "") || "#94a3b8");
  _chipRow(S.INITIAL_IMAGE_TAB_COLOR, "#94a3b8", initTabBadge, {
    tooltip: "查看器元数据面板中“初始图像”标签按钮的颜色",
    onColor: (c) => { initTabBadge.style.background = c || "#94a3b8"; },
  });

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "默认胶囊标签颜色", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "未单独设置颜色的字段会使用这些胶囊标签背景、文字和边框颜色。留空则使用主题默认值。" }));
  const pillPreview = _badgePreview("示例标签", getSetting(S.PILL_BG_COLOR, "") || "rgba(255,255,255,0.06)");
  pillPreview.style.color = getSetting(S.PILL_TEXT_COLOR, "") || "rgba(255,255,255,0.8)";
  pillPreview.style.border = `1px solid ${getSetting(S.PILL_BORDER_COLOR, "") || "rgba(255,255,255,0.08)"}`;
  const pillBgRow = _colorInput(S.PILL_BG_COLOR, "rgba(255,255,255,0.06)", "背景", "胶囊标签背景色", (c) => {
    pillPreview.style.background = c || "rgba(255,255,255,0.06)";
    if (c) document.documentElement.style.setProperty("--sbg-pill-bg", c);
    else document.documentElement.style.removeProperty("--sbg-pill-bg");
  }, "bg");
  const pillTextRow = _colorInput(S.PILL_TEXT_COLOR, "rgba(255,255,255,0.8)", "文字", "胶囊标签文字颜色", (c) => {
    pillPreview.style.color = c || "rgba(255,255,255,0.8)";
    if (c) document.documentElement.style.setProperty("--sbg-pill-text", c);
    else document.documentElement.style.removeProperty("--sbg-pill-text");
  }, "text");
  const pillBorderRow = _colorInput(S.PILL_BORDER_COLOR, "rgba(255,255,255,0.08)", "边框", "胶囊标签边框颜色", (c) => {
    pillPreview.style.border = `1px solid ${c || "rgba(255,255,255,0.08)"}`;
    if (c) document.documentElement.style.setProperty("--sbg-pill-border", c);
    else document.documentElement.style.removeProperty("--sbg-pill-border");
  }, "border");
  const pillPreviewRow = h("div", { style: "display:flex;align-items:center;gap:8px;margin-bottom:8px" });
  pillPreviewRow.appendChild(h("span", { class: "sbg-gs-label", text: "预览：", style: "font-size:11px;opacity:0.6" }));
  pillPreviewRow.appendChild(pillPreview);
  wrap.appendChild(pillPreviewRow);
  wrap.appendChild(pillBgRow);
  wrap.appendChild(pillTextRow);
  wrap.appendChild(pillBorderRow);

  content.appendChild(wrap);
}

function renderKeybindings() {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "键盘快捷键" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "用逗号分隔按键名称，例如 ArrowLeft,a。组合键用加号连接，如 Shift+ArrowLeft 或 Ctrl+d。鼠标按键可写为 MiddleClick、Mouse4、Mouse5；逗号键写作 Comma，加号键写作 Plus。" }));
  wrap.appendChild(_textInput(S.KEY_PREV, "ArrowLeft,a,j", "上一张图像", "在查看器中切换到上一张图像"));
  wrap.appendChild(_textInput(S.KEY_NEXT, "ArrowRight,d,l", "下一张图像", "在查看器中切换到下一张图像"));
  wrap.appendChild(_textInput(S.KEY_CLOSE, "Escape,q,z,0", "关闭查看器", "关闭查看器的快捷键"));
  wrap.appendChild(_textInput(S.KEY_TOGGLE, "z,0", "切换图库", "打开或关闭图库侧边栏"));
  wrap.appendChild(_textInput(S.KEY_REFRESH, "", "刷新图库", "刷新图库的快捷键（留空则禁用）"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "查看器操作", style: "margin-top:16px" }));
  wrap.appendChild(_textInput(S.KEY_FULLSCREEN, "f", "全屏", "在查看器中切换全屏"));
  wrap.appendChild(_textInput(S.KEY_DOWNLOAD, "", "下载", "下载当前文件（留空则禁用）"));
  wrap.appendChild(_textInput(S.KEY_COPY_PROMPT, "", "复制提示词", "复制正向提示词（留空则禁用）"));
  wrap.appendChild(_textInput(S.KEY_COPY_WF, "", "复制工作流", "复制工作流 JSON（留空则禁用）"));
  wrap.appendChild(_textInput(S.KEY_LOAD_WF, "", "加载工作流", "将工作流加载到 ComfyUI（留空则禁用）"));
  wrap.appendChild(_textInput(S.KEY_COMPARE, "c", "对比模式", "在查看器中切换对比模式"));
  wrap.appendChild(_textInput(S.KEY_RESET_ZOOM, "MiddleClick,r", "重置缩放", "将图像恢复为适合窗口的大小。独立缩放对比时优先作用于光标所在窗格，其次为最左侧已缩放窗格。"));
  wrap.appendChild(_textInput(S.KEY_ZOOM_IN, "=,+", "放大", "每按一次放大一级；按住可持续放大。受缩放灵敏度和缩放方向设置控制。"));
  wrap.appendChild(_textInput(S.KEY_ZOOM_OUT, "-", "缩小", "每按一次缩小一级；按住可持续缩小。"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "视频", style: "margin-top:16px" }));
  wrap.appendChild(_textInput(S.KEY_MUTE, "m", "静音", "切换当前视频的静音状态"));
  wrap.appendChild(_textInput(S.KEY_FRAME_PREV, "Comma", "上一帧", "暂停视频并后退一帧"));
  wrap.appendChild(_textInput(S.KEY_FRAME_NEXT, ".", "下一帧", "暂停视频并前进一帧"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "对比模式", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "普通导航键切换右侧对比图像；以下快捷键切换左侧当前图像。" }));
  wrap.appendChild(_textInput(S.KEY_CMP_CUR_PREV, "Shift+ArrowLeft,Shift+a", "当前图像上一张", "在对比模式中切换左侧当前图像到上一张"));
  wrap.appendChild(_textInput(S.KEY_CMP_CUR_NEXT, "Shift+ArrowRight,Shift+d", "当前图像下一张", "在对比模式中切换左侧当前图像到下一张"));

  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "注意：全屏时方向键用于视频快进／后退，A／D 键始终用于切换图像。" }));
  content.appendChild(wrap);
}

function renderSettings() {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "图库" }));
  wrap.appendChild(_numberInput(S.THUMB_SIZE, 110, "缩略图大小（像素）", "缩略图网格单元大小（64–256）。仅在“每行项目数”为自动时用于计算列数。"));
  wrap.appendChild(_comboInput(S.THUMB_PER_ROW, "auto", ["auto", "1", "2", "3", "4", "5", "6", "8", "10"], "每行项目数", "自动：根据缩略图大小决定列数。数字：每行固定显示该数量，缩略图按纵横比填满行。重新打开图库后生效。"));
  wrap.appendChild(_comboInput(S.THUMB_SHAPE, "square", ["square", "ar"], "缩略图形状", "方形会裁切；原始比例会保留宽高比"));
  // Normalize a legacy stored sort value so the combo shows the right selection.
  {
    const _sortAlias = { newest: "created_desc", oldest: "created_asc" };
    const _cur = getSetting(S.SORT, "created_desc");
    if (_sortAlias[_cur]) saveSetting(S.SORT, _sortAlias[_cur]);
  }
  wrap.appendChild(_comboInput(S.SORT, "created_desc",
    ["created_desc", "created_asc", "modified_desc", "modified_asc", "name_asc", "name_desc", "size_desc", "size_asc"],
    "默认排序", "图库项目的默认排序方式（与图库排序菜单一致）"));
  wrap.appendChild(_numberInput(S.VSCROLL_BUFFER, 8, "滚动缓冲（行）", "在视口上下预先渲染的额外行数（2–30）。数值越大，快速滚动时空白越少，但 DOM 节点越多。"));

  // Shared config helpers, defined before the first server-backed row so it can
  // call them directly. _postConfig checks the response, so a failed save
  // surfaces as an error toast instead of a false "saved" message.
  async function _postConfig(patch) {
    const r = await fetch("/sidebar_gallery/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error("保存失败（HTTP " + r.status + ")");
    return r.json();
  }
  const _loadCfg = () => fetch("/sidebar_gallery/config").then(r => r.json());

  // Auto-refresh interval lives in server config (auto_refresh_interval_s)
  // rather than localStorage, so it POSTs to /config instead of using _numberInput.
  // The server clamps to 0 or >=5s; the input and toast echo the effective
  // value from the response.
  {
    let arBusy = false;
    const arInput = h("input", { type: "number", class: "sbg-gs-input sbg-gs-input--sm", min: "0", step: "5", value: "15" });
    _loadCfg().then((cfg) => {
      if (cfg && typeof cfg.auto_refresh_interval_s === "number") arInput.value = String(cfg.auto_refresh_interval_s);
    }).catch(() => { });
    arInput.addEventListener("change", async () => {
      if (arBusy) return;
      arBusy = true;
      const n = Math.max(0, Math.floor(Number(arInput.value) || 0));
      try {
        const cfg = await _postConfig({ auto_refresh_interval_s: n });
        const eff = (cfg && typeof cfg.auto_refresh_interval_s === "number") ? cfg.auto_refresh_interval_s : n;
        arInput.value = String(eff);
        if (eff <= 0) showToast("已关闭定时自动刷新（返回图库时仍会检查）");
        else if (eff !== n) showToast(`每 ${eff} 秒自动刷新（最短 5 秒）`);
        else showToast(`每 ${eff} 秒自动刷新`);
        if (galleryCtx.refreshConfig) await galleryCtx.refreshConfig();
      } catch (e) {
        arInput.value = String(n);
        showToast("更新失败：" + (e?.message || e));
      }
      finally { arBusy = false; }
    });
    wrap.appendChild(_settingRow("自动刷新间隔", arInput,
      "图库打开时检查磁盘中文件新增、删除或重命名的间隔（最短 5 秒）。设为 0 可关闭后台定时检查；返回图库时仍会检查一次。立即生效。"));
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "悬停提示", style: "margin-top:16px" }));
  wrap.appendChild(_toggle(S.TOOLTIP_NAME, true, "显示文件名", "在卡片悬停提示中显示文件名"));
  wrap.appendChild(_toggle(S.TOOLTIP_SIZE, true, "显示文件大小", "在卡片悬停提示中显示文件大小"));
  wrap.appendChild(_toggle(S.TOOLTIP_DATE, true, "显示日期", "在卡片悬停提示中显示日期"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "查看器按钮", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "显示或隐藏查看器工具栏中的各个按钮。" }));
  wrap.appendChild(_toggle(S.LB_SHOW_DOWNLOAD, true, "下载按钮", "在查看器中显示下载按钮"));
  wrap.appendChild(_toggle(S.LB_SHOW_COPY_PROMPT, true, "复制提示词按钮", "在查看器中显示复制提示词按钮"));
  wrap.appendChild(_toggle(S.LB_SHOW_COPY_WF, true, "复制工作流按钮", "在查看器中显示复制工作流按钮"));
  wrap.appendChild(_toggle(S.LB_SHOW_LOAD_WF, true, "加载工作流按钮", "在查看器中显示加载工作流按钮"));
  wrap.appendChild(_toggle(S.LB_SHOW_COMPARE, true, "对比按钮", "在查看器中显示对比按钮"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "查看器缩放", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "在查看器中缩放和平移图像或视频。双指捏合始终用于缩放；放大后拖动可平移。" }));
  wrap.appendChild(_comboInput(S.LB_ZOOM_SCROLL_MODE, "mouse", ["mouse", "touchpad", "auto"], "滚动输入",
    "普通滚动在图像上的作用。鼠标：滚轮缩放。触控板：放大后双指滚动平移（捏合始终缩放）。自动：根据滚动事件识别设备。"));
  wrap.appendChild(_comboInput(S.LB_ZOOM_ANCHOR, "cursor", ["cursor", "center"], "缩放方向",
    "朝鼠标光标或视图中心缩放。"));
  wrap.appendChild(_numberInput(S.LB_ZOOM_SENSITIVITY, 1, "缩放灵敏度",
    "缩放速度倍数，范围 0.1–5。1 为默认值；数值越大，每次滚动缩放越快。"));
  wrap.appendChild(_comboInput(S.LB_COMPARE_ZOOM, "independent", ["independent", "synced"], "对比缩放",
    "对比模式下，仅缩放／平移光标所在一侧，或让两侧保持相同缩放比例和相对位置。"));
  wrap.appendChild(_toggle(S.LB_ZOOM_KEEP_ON_NAV, false, "浏览时保持缩放",
    "切换到上一张或下一张图像／视频时保持当前缩放和位置。关闭后每次切换都会恢复为适合屏幕的大小。"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "元数据", style: "margin-top:16px" }));
  wrap.appendChild(_comboInput(S.PROMPT_VIEW, "remember", ["enhanced", "initial", "remember"], "默认标签页", "标签式区块初次打开时显示的标签页。提示词区块可选择增强或初始；“记住”会保留每个区块上次打开的标签页。"));
  wrap.appendChild(_comboInput(S.PROMPT_PADDING, "6", ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"], "提示词内边距", "提示词文本框的水平内边距（像素）；上下内边距比该值小 2 像素。", (v) => {
    document.documentElement.style.setProperty("--sbg-prompt-padding", v + "px");
  }));
  wrap.appendChild(_comboInput(S.FILENAME_STYLE, "basename", ["basename", "relpath"], "文件名显示", "在文件信息中显示文件名或完整相对路径。"));
  wrap.appendChild(_comboInput(S.MODEL_NAME_STYLE, "basename", ["basename", "relpath"], "模型名显示", "模型和 LoRA 名称可显示文件名或完整相对路径。"));
  wrap.appendChild(_toggle(S.META_TAB_PERSIST, false, "记住元数据标签页", "切换图像时保留当前元数据标签页（生成图像／初始图像）。"));

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "文件夹", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "除 ComfyUI 输出文件夹外，可浏览和建立索引的其他文件夹。路径位于运行 ComfyUI 的机器上。" }));
  const foldersList = h("div", {});
  wrap.appendChild(foldersList);

  const _postRoots = (extraRoots) => _postConfig({ extra_roots: extraRoots });

  async function _renderFolders(cfg) {
    foldersList.innerHTML = "";
    if (!cfg) { try { cfg = await _loadCfg(); } catch { cfg = { extra_roots: [], roots: [] }; } }
    const row = (label, sub, removeRaw) => {
      const el = h("div", { class: "sbg-gs-row", style: "align-items:center" });
      el.appendChild(h("span", { class: "sbg-gs-label", text: label, title: sub || "" }));
      if (sub) el.appendChild(h("span", { style: "opacity:.55;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:50%", text: sub }));
      if (removeRaw != null) {
        const del = h("button", { class: "sbg-iconbtn sbg-iconbtn--danger", text: "🗑", title: "从图库中移除此文件夹（不会删除磁盘上的文件）" });
        del.addEventListener("click", async () => {
          try {
            await _postRoots((cfg.extra_roots || []).filter(p => p !== removeRaw));
            showToast("已移除文件夹");
            if (galleryCtx.refreshConfig) await galleryCtx.refreshConfig();
            _renderFolders();
          } catch (e) { showToast("移除文件夹失败：" + (e?.message || e)); }
        });
        el.appendChild(del);
      } else {
        el.appendChild(h("span", { style: "opacity:.4;font-size:11px", text: "内置" }));
      }
      return el;
    };
    foldersList.appendChild(row("输出", "ComfyUI 输出文件夹", null));
    for (const p of cfg.extra_roots || []) foldersList.appendChild(row(p.split(/[\\/]/).pop() || p, p, p));

    const addHint = h("div", { class: "sbg-gs-desc", style: "margin-top:8px" });
    addHint.appendChild(document.createTextNode(
      "要添加文件夹，请打开 sidebar_gallery_config.json，在 extra_roots 列表中填入路径，例如 "));
    addHint.appendChild(h("code", { text: '{"extra_roots": ["C:/Renders"]}' }));
    addHint.appendChild(document.createTextNode("。图库将在几秒内识别此更改。"));
    foldersList.appendChild(addHint);
    if (cfg.config_path) {
      foldersList.appendChild(h("div", { class: "sbg-gs-desc", style: "font-family:monospace;overflow-wrap:anywhere;user-select:text", text: cfg.config_path, title: cfg.config_path }));
    }
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "排除的文件夹", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "扫描时要跳过的文件夹名称（例如 thumbnails、backup）。按文件夹名称匹配，而非完整路径，且不区分大小写。更改将在下次扫描时生效。" }));
  const excludedList = h("div", {});
  wrap.appendChild(excludedList);

  // Serialises edits in this section so two fast clicks can't race on a stale
  // snapshot and lose an update.
  let excludedBusy = false;

  const _postExcluded = (excludedDirs) => _postConfig({ excluded_dirs: excludedDirs });

  async function _renderExcluded(cfg) {
    excludedList.innerHTML = "";
    if (!cfg) { try { cfg = await _loadCfg(); } catch { cfg = { excluded_dirs: [] }; } }
    const current = cfg.excluded_dirs || [];

    const hiddenChk = h("input", { type: "checkbox" });
    hiddenChk.checked = !!cfg.index_hidden_dirs;
    hiddenChk.addEventListener("change", async () => {
      if (excludedBusy) { hiddenChk.checked = !hiddenChk.checked; return; }
      excludedBusy = true;
      try {
        await _postConfig({ index_hidden_dirs: hiddenChk.checked });
        showToast(hiddenChk.checked
          ? "下次扫描将包含隐藏文件夹"
          : "下次扫描将跳过隐藏文件夹");
        if (galleryCtx.refreshConfig) await galleryCtx.refreshConfig();
      } catch (e) {
        hiddenChk.checked = !hiddenChk.checked;
        showToast("更新失败：" + (e?.message || e));
      } finally { excludedBusy = false; }
    });
    excludedList.appendChild(_settingRow("包含隐藏文件夹", hiddenChk,
      "同时扫描名称以点开头的文件夹（例如 .thumbs）。默认关闭，隐藏文件夹会被跳过。"));

    const row = (name) => {
      const el = h("div", { class: "sbg-gs-row", style: "align-items:center" });
      el.appendChild(h("span", { class: "sbg-gs-label", text: name }));
      const del = h("button", { class: "sbg-iconbtn sbg-iconbtn--danger", text: "🗑", title: "停止排除此文件夹（其中的文件将在下次扫描后重新显示）" });
      del.addEventListener("click", async () => {
        if (excludedBusy) return;
        excludedBusy = true;
        try {
          await _postExcluded(current.filter(d => d !== name));
          showToast("已取消排除文件夹，下次扫描时将重新建立索引");
          if (galleryCtx.refreshConfig) await galleryCtx.refreshConfig();
          _renderExcluded();
        } catch (e) { showToast("更新失败：" + (e?.message || e)); }
        finally { excludedBusy = false; }
      });
      el.appendChild(del);
      return el;
    };
    if (current.length === 0) {
      excludedList.appendChild(h("div", { class: "sbg-gs-row", style: "opacity:.5;font-size:11px", text: "没有额外排除的文件夹。" }));
    } else {
      for (const name of current) excludedList.appendChild(row(name));
    }

    const addWrap = h("div", { class: "sbg-gs-row", style: "align-items:center;gap:6px" });
    const inp = h("input", { type: "text", class: "sbg-gs-input", placeholder: "缩略图", style: "flex:1" });
    const addBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "+ 添加" });
    const doAdd = async () => {
      if (excludedBusy) return;
      // Accept a plain name or a pasted path; keep just the last real path segment.
      const name = (inp.value.split(/[\\/]/).filter(Boolean).pop() || "").trim().toLowerCase();
      if (!name || name === "." || name === "..") { showToast("请输入要排除的文件夹名称"); return; }
      if (current.includes(name)) { showToast("已经排除此文件夹"); inp.value = ""; return; }
      excludedBusy = true;
      try {
        await _postExcluded([...current, name]);
        showToast("已排除此文件夹，下次扫描时将跳过");
        inp.value = "";
        if (galleryCtx.refreshConfig) await galleryCtx.refreshConfig();
        _renderExcluded();
      } catch (e) { showToast("添加失败：" + (e?.message || e)); }
      finally { excludedBusy = false; }
    };
    addBtn.addEventListener("click", doAdd);
    inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") doAdd(); });
    addWrap.appendChild(inp);
    addWrap.appendChild(addBtn);
    excludedList.appendChild(addWrap);
  }

  // Initial render: a single config fetch shared by both sections.
  (async () => {
    let cfg;
    try { cfg = await _loadCfg(); } catch { }
    _renderFolders(cfg);
    _renderExcluded(cfg);
  })();

  content.appendChild(wrap);
}

function renderPresets() {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "预设" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "保存和加载图库配置预设。" }));

  const PRESETS_KEY = "SBG.Presets";
  let presets = [];
  try { presets = JSON.parse(localStorage.getItem(PRESETS_KEY)) || []; } catch { }

  const saveChecks = h("div", { class: "sbg-gs-preset-checks" });
  const incLayout = h("input", { type: "checkbox" }); incLayout.checked = true;
  const incColors = h("input", { type: "checkbox" }); incColors.checked = true;
  const incSettings = h("input", { type: "checkbox" }); incSettings.checked = true;
  const incKeys = h("input", { type: "checkbox" }); incKeys.checked = true;
  saveChecks.appendChild(h("label", {}, [incLayout, document.createTextNode(" 布局")]));
  saveChecks.appendChild(h("label", {}, [incColors, document.createTextNode(" 颜色")]));
  saveChecks.appendChild(h("label", {}, [incSettings, document.createTextNode(" 设置")]));
  saveChecks.appendChild(h("label", {}, [incKeys, document.createTextNode(" 快捷键")]));
  wrap.appendChild(saveChecks);

  // Every colour the Appearance tab manages, as setting ids: the S entries
  // whose names carry COLOR, the custom theme variables, the per-app badge
  // keys, and the highlight background's settings copy.
  function _appearanceColorIds() {
    const ids = [];
    for (const [k, id] of Object.entries(S)) if (k.includes("COLOR")) ids.push(id);
    ids.push("CUSTOM_BG", "CUSTOM_SURFACE", "CUSTOM_BORDER", "CUSTOM_TEXT", "CUSTOM_ACCENT");
    for (const a of APP_REGISTRY) ids.push(a.settingKey);
    ids.push("HighlightBg");
    return ids;
  }

  // The one capture and the one apply, shared by the local preset buttons and
  // the server theme buttons, so the call sites cannot drift on what a
  // preset contains or how it lands.
  function capturePreset(name) {
    const preset = { name, created: Date.now() };
    if (incLayout.checked) {
      // The per-app x per-media section profiles ("SBG.Layouts", translation layer).
      preset.layouts = getSetting("SBG.Layouts", null);
    }
    if (incColors.checked) {
      // The legacy four keys stay, so exports keep loading in older builds.
      preset.colors = {
        high: getSetting(S.BADGE_HIGH_COLOR, "#f87171"),
        low: getSetting(S.BADGE_LOW_COLOR, "#60a5fa"),
        video: getSetting(S.VIDEO_BADGE_COLOR, "#facc15"),
        highlight: localStorage.getItem("SBG.GS.HighlightBg") || "",
        all: {},
      };
      for (const id of _appearanceColorIds()) {
        const v = getSetting(id, null);
        // null means never set, while an empty string is a deliberate clear
        // and must load as one.
        if (v !== null) preset.colors.all[id] = v;
      }
    }
    if (incSettings.checked) {
      preset.settings = {};
      for (const [k, id] of Object.entries(S)) {
        if (k.startsWith("KEY_")) continue; // keybindings saved separately
        preset.settings[id] = getSetting(id, null);
      }
    }
    if (incKeys.checked) preset.keys = _capturePresetKeys();
    return preset;
  }

  function applyPreset(p) {
    if (p.layouts) {
      saveSetting("SBG.Layouts", p.layouts);
      document.dispatchEvent(new CustomEvent("sbg-layout-changed"));
    }
    if (p.colors) {
      saveSetting(S.BADGE_HIGH_COLOR, p.colors.high);
      saveSetting(S.BADGE_LOW_COLOR, p.colors.low);
      saveSetting(S.VIDEO_BADGE_COLOR, p.colors.video);
      if (p.colors.highlight) {
        localStorage.setItem("SBG.GS.HighlightBg", p.colors.highlight);
        saveSetting("HighlightBg", p.colors.highlight);
      }
      for (const [id, v] of Object.entries(p.colors.all || {})) {
        saveSetting(id, v);
        // HighlightBg is dual-copy and the render path reads the localStorage
        // side, so a carried clear must land there too.
        if (id === "HighlightBg") localStorage.setItem("SBG.GS.HighlightBg", v);
      }
    }
    if (p.settings) {
      for (const [id, val] of Object.entries(p.settings)) {
        if (val !== null) saveSetting(id, val);
      }
    }
    if (p.keys) _applyPresetKeys(p.keys);
  }

  const nameInput = h("input", { type: "text", class: "sbg-gs-input", placeholder: "预设名称" });
  const saveBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "💾 保存预设" });
  saveBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) { showToast("请输入预设名称"); return; }
    const preset = capturePreset(name);
    presets = presets.filter(p => p.name !== name);
    presets.unshift(preset);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    showToast(`预设“${name}”已保存`);
    renderPresets();
  });
  const saveRow = h("div", { class: "sbg-gs-preset-save" }, [nameInput, saveBtn]);
  wrap.appendChild(saveRow);

  if (presets.length > 0) {
    wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "已保存的预设", style: "margin-top:16px" }));
    for (const p of presets) {
      const row = h("div", { class: "sbg-gs-preset-item" });
      row.appendChild(h("span", { class: "sbg-gs-preset-name", text: p.name }));
      const loadBtn = h("button", { class: "sbg-btn sbg-btn--accent sbg-btn--sm", text: "加载" });
      confirmClick(loadBtn, () => {
        applyPreset(p);
        showToast(`预设“${p.name}”已加载。刷新图库后生效。`);
      }, { background: "var(--sbg-danger)" });
      const delBtn = h("button", { class: "sbg-btn sbg-btn--danger sbg-btn--sm", text: "✕" });
      confirmClick(delBtn, () => {
        presets = presets.filter(x => x.name !== p.name);
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        renderPresets();
      });
      const expBtn = h("button", { class: "sbg-btn sbg-btn--sm", text: "📤" });
      expBtn.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = h("a", { href: url, download: `${p.name}.json` });
        a.click();
        URL.revokeObjectURL(url);
      });
      row.appendChild(loadBtn);
      row.appendChild(expBtn);
      row.appendChild(delBtn);
      wrap.appendChild(row);
    }
  }

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "导入", style: "margin-top:16px" }));
  const importBtn = h("button", { class: "sbg-btn", text: "📥 导入预设" });
  importBtn.addEventListener("click", () => {
    const fi = h("input", { type: "file", accept: ".json" });
    fi.addEventListener("change", async () => {
      if (!fi.files.length) return;
      try {
        const text = await fi.files[0].text();
        const p = JSON.parse(text);
        if (!p.name) { showToast("无效的预设文件"); return; }
        presets = presets.filter(x => x.name !== p.name);
        presets.unshift(p);
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        showToast(`预设“${p.name}”已导入`);
        renderPresets();
      } catch (e) { showToast(`导入失败：${e.message}`); }
    });
    fi.click();
  });
  wrap.appendChild(importBtn);

  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "服务器主题", style: "margin-top:16px" }));
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "保存在扩展 themes/ 文件夹中的预设，重新安装后仍可保留。" }));
  const serverList = h("div", { class: "sbg-gs-preset-list" });
  serverList.textContent = "加载中…";
  wrap.appendChild(serverList);

  fetch("/sidebar_gallery/presets").then(r => r.json()).then(data => {
    serverList.innerHTML = "";
    if (!data.presets || data.presets.length === 0) {
      serverList.textContent = "未找到服务器主题。";
      return;
    }
    for (const sp of data.presets) {
      const row = h("div", { class: "sbg-gs-preset-item" });
      row.appendChild(h("span", { class: "sbg-gs-preset-name", text: sp.name }));
      const loadBtn = h("button", { class: "sbg-btn sbg-btn--accent sbg-btn--sm", text: "加载" });
      confirmClick(loadBtn, async () => {
        try {
          const resp = await fetch(`/sidebar_gallery/preset?filename=${encodeURIComponent(sp.filename)}`);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const p = await resp.json();
          applyPreset(p);
          showToast(`服务器主题“${sp.name}”已加载。刷新图库后生效。`);
        } catch (e) { showToast("加载主题失败：" + e.message); }
      }, { background: "var(--sbg-danger)" });
      const delBtn = h("button", { class: "sbg-btn sbg-btn--danger sbg-btn--sm", text: "\u2715" });
      confirmClick(delBtn, async () => {
        try {
          const r = await fetch("/sidebar_gallery/presets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", name: sp.name }),
          });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
        } catch (e) { showToast("删除主题失败：" + e.message); }
        renderPresets();
      });
      row.appendChild(loadBtn);
      row.appendChild(delBtn);
      serverList.appendChild(row);
    }
  }).catch(() => { serverList.textContent = "无法加载服务器主题。"; });

  const saveServerBtn = h("button", { class: "sbg-btn", text: "💾 保存到服务器", style: "margin-top:8px" });
  saveServerBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) { showToast("请先输入预设名称"); return; }
    const preset = capturePreset(name);
    try {
      const r = await fetch("/sidebar_gallery/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", name, data: preset }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      showToast(`主题“${name}”已保存到服务器`);
      renderPresets();
    } catch (e) { showToast("保存到服务器失败：" + e.message); }
  });
  wrap.appendChild(saveServerBtn);

  content.appendChild(wrap);
}

function renderDiagnosticsTab() {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  wrap.appendChild(h("div", { class: "sbg-gs-section-title", text: "诊断与工具" }));

  const actionRow = h("div", { style: "display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap" });

  const diagGalleryRefreshBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "🔃 刷新", title: "从服务器重新获取所有项目并刷新图库" });
  diagGalleryRefreshBtn.addEventListener("click", async () => {
    diagGalleryRefreshBtn.disabled = true;
    diagGalleryRefreshBtn.textContent = "刷新中…";
    try {
      await galleryCtx.fetchAllItems({ rescan: true });
      showToast("图库已刷新");
      await refreshDiagStats(diagStatsContainer);
    } catch (e) {
      showToast(`错误：${e?.message || e}`);
    } finally {
      diagGalleryRefreshBtn.disabled = false;
      diagGalleryRefreshBtn.textContent = "🔃 刷新";
    }
  });

  const diagRefreshBtn = h("button", { class: "sbg-btn sbg-btn--accent", text: "🔄 重建数据库索引", title: "重新扫描所有根目录并重建服务器上的元数据／标签索引" });
  confirmClick(diagRefreshBtn, async () => {
    diagRefreshBtn.disabled = true;
    diagRefreshBtn.textContent = "🔄 正在重建数据库…（0%）";
    try {
      await fetch("/sidebar_gallery/rebuild_index", { method: "POST" });
    } catch { }

    // Shared progress poller (same formatter as the status bar / modal).
    // Wait for `settled` (2+ idle ticks) rather than a single !running read, so
    // the between-roots gap of a multi-root rebuild can't end this early. A
    // refused start (another scan already running) recovers the button instead
    // of sitting at 0% forever.
    let sawRunning = false;
    let active = true;
    const unsub = progressPoller.subscribe((data, meta) => {
      if (!active || !data) return;
      const e = data.full;
      if (data.running) sawRunning = true;
      if (e && data.running) {
        const f = formatProgress(e);
        diagRefreshBtn.textContent = f.pct >= 0
          ? `🔄 正在重建数据库…（${f.pct}%）`
          : `🔄 正在重建数据库…（${f.text}）`;
      }
      if (meta.settled) {
        active = false;
        unsub();
        diagRefreshBtn.textContent = sawRunning
          ? "🔄 数据库索引已重建！"
          : "无法开始，另一个扫描正在运行";
        setTimeout(() => {
          diagRefreshBtn.disabled = false;
          diagRefreshBtn.textContent = "🔄 重建数据库索引";
        }, 3000);
        if (sawRunning) {
          galleryCtx.fetchAllItems({ rescan: true });
          refreshDiagStats(diagStatsContainer);
        }
      }
    });
  }, { background: "#f59e0b", color: "#000" });

  const diagCacheMetaBtn = h("button", { class: "sbg-btn", text: "📦 缓存所有元数据", title: "获取所有文件的元数据摘要并缓存到 IndexedDB" });
  diagCacheMetaBtn.addEventListener("click", async () => {
    diagCacheMetaBtn.disabled = true;
    diagCacheMetaBtn.textContent = "缓存中…";
    try {
      const items = galleryCtx.allItems || [];
      let cached = 0;
      const batch = [];
      for (const it of items) {
        const key = itemKey(it);
        if (_metaCache.has(key)) { cached++; continue; }
        try {
          const m = await api("/sidebar_gallery/metadata", { root_id: it.root_id, relpath: it.relpath, summary_only: "1" });
          _metaCache.set(key, m);
          batch.push({ key, value: m });
          cached++;
          if (cached % 50 === 0) {
            diagCacheMetaBtn.textContent = `缓存中… ${cached}/${items.length}`;
            if (batch.length >= 50) { await _metaCacheAPI.putBatch(batch.splice(0)); }
          }
        } catch { cached++; }
      }
      if (batch.length) await _metaCacheAPI.putBatch(batch);
      diagCacheMetaBtn.textContent = "📦 缓存所有元数据";
      diagCacheMetaBtn.disabled = false;
      showToast(`已缓存 ${cached} 项元数据`);
      await refreshDiagStats(diagStatsContainer);
    } catch (e) {
      diagCacheMetaBtn.textContent = "📦 缓存所有元数据";
      diagCacheMetaBtn.disabled = false;
      showToast(`错误：${e?.message || e}`);
    }
  });

  const diagCacheThumbBtn = h("button", { class: "sbg-btn", text: "🖼️ 缓存缩略图", title: "将所有延迟加载的缩略图缓存到本地浏览器 IndexedDB" });
  diagCacheThumbBtn.addEventListener("click", async () => {
    diagCacheThumbBtn.disabled = true;
    diagCacheThumbBtn.textContent = "缓存中…";
    try {
      const items = galleryCtx.allItems || [];
      let cached = 0;
      let skipped = 0;
      for (const it of items) {
        if (!it.thumb_url) continue;
        // Already cached: count it and move on. The returned object URL is the
        // LIVE memory-cache entry that visible cards share; revoking it here
        // broke every mounted card using it and left the dead URL being served
        // for the rest of the session.
        const existing = await _thumbCacheAPI.tryGet(it.thumb_url);
        if (existing) { cached++; continue; }
        try {
          // A raw-URL result is the server's 404 (no thumbnail exists), and
          // rejections are transient failures. Neither counts as cached.
          const got = await _thumbCacheAPI.getOrFetch(it.thumb_url);
          if (got !== it.thumb_url) cached++;
          else skipped++;
          if ((cached + skipped) % 20 === 0) {
            diagCacheThumbBtn.textContent = `缓存中… ${cached}/${items.length}`;
          }
        } catch { skipped++; }
      }
      diagCacheThumbBtn.textContent = "🖼️ 缓存缩略图";
      diagCacheThumbBtn.disabled = false;
      showToast(skipped
        ? `已缓存 ${cached} 张缩略图（${skipped} 张不可用）`
        : `已缓存 ${cached} 张缩略图`);
      await refreshDiagStats(diagStatsContainer);
    } catch (e) {
      diagCacheThumbBtn.textContent = "🖼️ 缓存缩略图";
      diagCacheThumbBtn.disabled = false;
      showToast(`错误：${e?.message || e}`);
    }
  });

  const diagClearMetaBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "🗑️ 清除元数据缓存", title: "清除浏览器 IndexedDB 元数据缓存" });
  confirmClick(diagClearMetaBtn, async () => {
    try {
      const ok = await _metaCacheAPI.clear();
      _metaCache.clear();
      showToast(ok ? "元数据缓存已清除" : "无法清除元数据缓存（浏览器存储不可用）");
      await refreshDiagStats(diagStatsContainer);
    } catch (e) { showToast("清除元数据缓存时出错：" + e.message); }
  }, { background: "#f59e0b", color: "#000" });

  const diagClearThumbBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "🗑️ 清除缩略图缓存", title: "清除浏览器 IndexedDB 缩略图缓存" });
  confirmClick(diagClearThumbBtn, async () => {
    try {
      const ok = await _thumbCacheAPI.clear();
      // Also drop the in-memory blob cache and the failed-URL blacklist, so
      // thumbnails that failed to load (e.g. requests that timed out during a
      // DB rebuild) can be retried after the cache is cleared.
      for (const [url, blobUrl] of [..._thumbMemCache]) {
        // Don't revoke blobs still shown by a visible card.
        try {
          if (!document.querySelector(`img.sbg-card__thumb[src="${blobUrl}"]`)) URL.revokeObjectURL(blobUrl);
        } catch { }
        _thumbMemCache.delete(url);
      }
      resetFailedThumbs();
      showToast(ok ? "缩略图缓存已清除" : "无法清除缩略图缓存（浏览器存储不可用）");
      await refreshDiagStats(diagStatsContainer);
    } catch (e) { showToast("清除缩略图缓存时出错：" + e.message); }
  }, { background: "#f59e0b", color: "#000" });

  const diagNukeBtn = h("button", { class: "sbg-btn sbg-btn--danger", text: "💣 清除所有缓存", title: "删除所有浏览器缓存数据库（包括旧版），重置版本记录，清理旧设置项并重新加载页面。可用于修复缓存损坏。" });
  confirmClick(diagNukeBtn, () => {
    // Nuke IDB: current + legacy databases
    try { _resetIdb(); } catch (e) { /* ignore */ }
    try { indexedDB.deleteDatabase("sbg-cache"); } catch (e) { /* ignore */ }
    try { indexedDB.deleteDatabase("sbg-gallery-cache"); } catch (e) { /* ignore */ }

    localStorage.removeItem("SBG._dbVersion");
    localStorage.removeItem("SBG._cacheEpoch");
    // Retired keys that aren't read anymore.
    for (const k of ["SBG.Layout", "SBG.LayoutRenames", "SBG.MetaSectionOrder", "SBG.GS.HiddenSections"]) {
      localStorage.removeItem(k);
    }

    _metaCache.clear();
    showToast("所有缓存已清除，正在重新加载…");
    setTimeout(() => location.reload(true), 500);
  }, { label: "⚠️ 确定吗？页面将重新加载", armMs: 3000, background: "#ef4444", color: "#fff" });

  actionRow.appendChild(diagGalleryRefreshBtn);
  actionRow.appendChild(diagRefreshBtn);
  actionRow.appendChild(diagCacheMetaBtn);
  actionRow.appendChild(diagCacheThumbBtn);
  actionRow.appendChild(diagClearThumbBtn);
  actionRow.appendChild(diagClearMetaBtn);
  actionRow.appendChild(diagNukeBtn);
  wrap.appendChild(actionRow);

  const diagStatsContainer = h("div", { class: "sbg-diag-stats" });
  wrap.appendChild(diagStatsContainer);
  content.appendChild(wrap);

  refreshDiagStats(diagStatsContainer);
}

// Tab switching
const TAB_RENDERERS = { layout: () => renderLayout(content, galleryCtx, closeGS), appearance: renderAppearance, keybindings: renderKeybindings, settings: renderSettings, presets: renderPresets, diagnostics: renderDiagnosticsTab };
for (const btn of tabBtns) {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("sbg-gs-tab--active"));
    btn.classList.add("sbg-gs-tab--active");
    TAB_RENDERERS[btn.dataset.tab]?.();
  });
}
const defaultBtn = [...tabBtns].find(b => b.dataset.tab === defaultTab) || tabBtns[0];
defaultBtn.classList.add("sbg-gs-tab--active");
if (TAB_RENDERERS[defaultTab]) {
  TAB_RENDERERS[defaultTab]();
} else {
  renderLayout(content, galleryCtx, closeGS);
}
}
