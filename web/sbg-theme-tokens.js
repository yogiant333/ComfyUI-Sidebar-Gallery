import { S } from "./sbg-settings-catalog.js";
import { APP_REGISTRY } from "./sbg-theme.js";
import { BASE_COLORS, DEFAULT_THEME, builtInTheme } from "./sbg-theme-model.js";

// Every theme value the Theme tab offers, declared once. The Theme tab draws its
// rows from these, and a preset or backup row names a stored value by them.

// The last column selects what the row paints in the sample.
export const DERIVED_ROWS = [
  ["--sbg-surface-hover", "悬停背景", "表面颜色，略微向文字颜色偏移", ".sbg-gs-sample__hover"],
  ["--sbg-text-dim", "次要文字", "降低亮度的文字颜色", ".sbg-card__meta, .sbg-area__row"],
  ["--sbg-border-hover", "悬停边框", "增强后的边框颜色", ".sbg-gs-sample__hover"],
  ["--sbg-accent-glow", "焦点光晕", "30% 不透明度的强调色", ".sbg-search-tag:not(.sbg-search-tag--neg)"],
  ["--sbg-on-accent", "强调色上的文字", "自动选用在强调色上更清晰的深色或白色", ".sbg-btn--accent"],
  ["--sbg-accent-ink", "强调色文字", "调整至在背景上清晰可读的强调色", ".sbg-folder-btn--root, .sbg-search-refresh"],
  ["--sbg-pill-active-text", "选中标签的文字", "调整至在选中标签上清晰可读的强调色", null],
];

const BASE_HITS = {
  "--sbg-bg": ".sbg-root, .sbg-lb__meta-panel",
  "--sbg-surface": ".sbg-toolbar, .sbg-card, .sbg-section__head",
  "--sbg-border": ".sbg-card, .sbg-section, .sbg-search-wrap",
  "--sbg-text": ".sbg-card__name, .sbg-meta-card__title",
  "--sbg-accent": ".sbg-btn--accent, .sbg-search-tag:not(.sbg-search-tag--neg)",
};

// A row's `def` names where its default is read:
//   `derived`   the colour the theme works out
//   `own`       the stylesheet's value of the variable the row paints, with the theme's own lifted off
//   `token`     the value another token paints now
//   `fallback`  what a base colour row shows before the stylesheet loads
export function themeRows() {
  const rows = [];
  const color = (group, label, key, def, hit, tip, note) => rows.push({ group, label, kind: "color", key, def, hit, tip, note });
  const pair = (group, label, channels, hit, tip) => rows.push({ group, label, kind: "pair", channels, hit, tip });
  const number = (group, label, key, def, unit, hit, extra = {}) => rows.push({ group, label, kind: "number", key, def, unit, hit, ...extra });

  const shipped = builtInTheme(DEFAULT_THEME).values;
  for (const { key, cssVar, label, tip } of BASE_COLORS) {
    color("base", label, key, { token: cssVar, fallback: shipped[key] }, BASE_HITS[cssVar], tip);
  }

  const boxedOnly = "仅适用于带边框卡片";
  color("gallery", "卡片背景", "--sbg-card-bg", { token: "--sbg-surface" }, ".sbg-card", undefined, boxedOnly);
  color("gallery", "卡片边框", "--sbg-card-border", { token: "--sbg-border" }, ".sbg-card");
  number("gallery", "卡片圆角", "--sbg-card-radius", { token: "--sbg-radius" }, "px", ".sbg-card");
  color("gallery", "文件名", "--sbg-card-name", { token: "--sbg-text" }, ".sbg-card__name");
  color("gallery", "大小和日期", "--sbg-card-meta", { token: "--sbg-text-dim" }, ".sbg-card__meta");
  color("gallery", "格式徽标", S.VIDEO_BADGE_COLOR, { own: "--sbg-badge-vid" }, ".sbg-card__kind", "视频和音频缩略图上格式徽标的颜色");
  color("gallery", "收藏星标", S.FAV_COLOR, { token: "--sbg-accent" }, ".sbg-card__fav", "卡片、查看器和文件夹菜单中收藏星标的颜色。未设置时，卡片和查看器星标使用强调色。");
  color("gallery", "高噪声徽标", S.BADGE_HIGH_COLOR, { own: "--sbg-badge-high" }, null, "元数据面板中配对采样器和模型上方高噪声标签的颜色");
  color("gallery", "低噪声徽标", S.BADGE_LOW_COLOR, { own: "--sbg-badge-low" }, null, "元数据面板中配对采样器和模型上方低噪声标签的颜色");

  color("toolbar", "搜索栏", "--sbg-search-bg", { token: "--sbg-well-25" }, ".sbg-search-wrap");
  color("toolbar", "搜索标签", S.SEARCH_TAG_COLOR, { token: "--sbg-accent" }, ".sbg-search-tag:not(.sbg-search-tag--neg)", "搜索栏中搜索标签的颜色。未设置时使用强调色。");
  color("toolbar", "排除标签", S.SEARCH_TAG_NEG_COLOR, { token: "--sbg-danger" }, ".sbg-search-tag--neg", "搜索栏中以减号开头的排除标签颜色。未设置时使用危险状态色。");
  color("toolbar", "筛选按钮", "--sbg-filter-bg", { token: "--sbg-tint-soft" }, ".sbg-kind-group");
  color("toolbar", "进度条", "--sbg-progress-fill", { own: "--sbg-progress-fill" }, null);

  color("lightbox", "遮罩背景", "--sbg-lb-backdrop", { token: "--sbg-scrim-90" }, null);

  for (const [key, label, act, def, cleared, note] of [
    [S.LB_COLOR_FAVORITE, "收藏按钮", "favorite", "--sbg-lb-btn-bg", "表面颜色"],
    [S.LB_COLOR_DOWNLOAD, "下载按钮", "download", "--sbg-lb-btn-bg", "表面颜色"],
    [S.LB_COLOR_COPY_PROMPT, "复制提示词按钮", "copy-prompt", "--sbg-lb-btn-bg", "表面颜色"],
    [S.LB_COLOR_COPY_WF, "复制工作流按钮", "copy-wf", "--sbg-lb-btn-bg", "表面颜色"],
    [S.LB_COLOR_LOAD_WF, "加载工作流按钮", "load-wf", "--sbg-accent", "强调色"],
    [S.LB_COLOR_COMPARE, "对比按钮", "compare", "--sbg-lb-btn-bg", "表面颜色"],
    [S.LB_COLOR_DELETE, "删除按钮", "delete", "--sbg-danger-solid", "柔和红色",
      "图库中的所有删除按钮：查看器、预设标签页和卡片右键菜单"],
  ]) {
    color("lightbox", label, key, { token: def }, `.sbg-lb__act--${act}`, `未设置时使用${cleared}。`, note);
  }
  color("lightbox", "元数据面板", "--sbg-panel-solid", { derived: "--sbg-panel-solid", own: "--sbg-panel-solid" }, ".sbg-lb__meta-panel");
  color("lightbox", "区块标题栏", "--sbg-section-head-bg", { derived: "--sbg-lb-head-bg", token: "--sbg-well-10" }, ".sbg-section__head");
  pair("lightbox", "胶囊标签", [
    { key: "bg", label: "背景", setting: S.PILL_BG_COLOR, def: { derived: "--sbg-lb-pill-bg", token: "--sbg-pill-bg-fallback" }, channel: "bg" },
    { key: "text", label: "文字", setting: S.PILL_TEXT_COLOR, def: { token: "--sbg-panel-ink-pill" }, channel: "text" },
    { key: "border", label: "边框", setting: S.PILL_BORDER_COLOR, def: { derived: "--sbg-lb-pill-border", token: "--sbg-pill-border-fallback" }, channel: "border" },
  ], ".sbg-badge", "未单独设置颜色的字段中，胶囊标签的背景、文字和边框。");
  pair("lightbox", "搜索高亮", [
    { key: "bg", label: "背景", setting: S.HIGHLIGHT_BG, def: { own: "--sbg-highlight-bg" } },
    { key: "text", label: "文字", setting: S.HIGHLIGHT_TEXT_COLOR, def: { token: "--sbg-text" } },
  ], ".sbg-highlight", "元数据面板中搜索匹配文字的背景及文字颜色。背景接近不透明且未设置文字颜色时，自动使用黑色或白色保证可读性。");
  color("lightbox", "源媒体标签页", S.INITIAL_IMAGE_TAB_COLOR, { token: "--sbg-text-dim" }, null, "元数据面板中“生成结果”旁源图像或源音频标签页的颜色。未设置时跟随“生成结果”标签页。");
  for (const a of APP_REGISTRY) color("lightbox", `${a.label} 徽标`, a.settingKey, { own: a.cssVar }, null, `元数据面板顶部 ${a.label} 徽标的颜色`);

  color("states", "危险", "--sbg-danger", { own: "--sbg-danger" }, null);
  color("states", "警告", "--sbg-warn", { own: "--sbg-warn" }, null);
  color("states", "成功", "--sbg-success-text", { own: "--sbg-success-text" }, null);
  number("states", "禁用状态不透明度", "--sbg-disabled-opacity", { own: "--sbg-disabled-opacity" }, "%", null);

  number("shape", "圆角", "--sbg-radius", { own: "--sbg-radius" }, "px", ".sbg-card, .sbg-section");
  number("shape", "小圆角", "--sbg-radius-sm", { own: "--sbg-radius-sm" }, "px", ".sbg-badge, .sbg-btn, .sbg-search-wrap");
  number("shape", "基础字号", "--sbg-font-size", { own: "--sbg-font-size" }, "px", ".sbg-root");

  // More would clip a Boxed card's second line, since the grid reserves a fixed
  // info height for each card style.
  number("shape", "卡片内边距", "--sbg-card-pad", { own: "--sbg-card-pad" }, "px", ".sbg-card__info", { max: 8, note: boxedOnly });
  return rows;
}

let _names = null;

// A match badge is named after the section it matches, which the person can
// rename at any time, so the names are kept only until the code that asked
// first has finished running, and a later ask works them out again.
export function themeValueName(key) {
  if (!_names) {
    _names = new Map(DERIVED_ROWS.map(([token, label]) => [token, label]));
    for (const r of themeRows()) {
      if (r.kind === "pair") for (const ch of r.channels) _names.set(ch.setting || ch.token, `${r.label}, ${ch.label}`);
      else _names.set(r.key, r.label);
    }
    queueMicrotask(() => { _names = null; });
  }
  return _names.get(key);
}
