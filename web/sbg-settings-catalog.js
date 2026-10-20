// Every stored setting, declared once: the id it is stored under, its kind, its
// default, the values it takes and the name it shows. ComfyUI loads each file in
// this folder as its own entry, so a fact one module registered at load could be
// missing when another reads it. This module imports nothing, which makes it
// whole before any module that imports it runs.
//
// `HighlightBg` and the five `CUSTOM_` colours keep ids without the `SBG.`
// prefix, since settings already on disk hold them under those names.

// What a preset and a backup do with each kind. `block` names the preset block
// that holds its entries, and a carried kind is one a preset saves, so a change
// to it dates the Current row. Colours live in the theme, so only an older
// preset or a backup holds the colours block. A library kind goes back only
// with a restore of the whole settings file, and a content kind is the
// install's own record, which no restore puts back.
export const KINDS = Object.freeze({
  pref: { block: "settings", carried: true },
  key: { block: "keys", carried: true },
  color: { block: "colors", carried: false },
  layout: { block: null, carried: true },
  theme: { block: null, carried: true },
  library: { block: null, carried: false },
  content: { block: null, carried: false },
});

const _NAMES = [["basename", "仅名称"], ["relpath", "名称及文件夹路径"]];

export const SORT_OPTIONS = [
  ["created_desc", "创建时间 ↓"], ["created_asc", "创建时间 ↑"],
  ["modified_desc", "修改时间 ↓"], ["modified_asc", "修改时间 ↑"],
  ["name_asc", "名称 ↑"], ["name_desc", "名称 ↓"],
  ["size_desc", "大小 ↓"], ["size_asc", "大小 ↑"],
];

export const SETTINGS = {
  THUMB_SIZE: { id: "SBG.ThumbSize", kind: "pref", def: 110, range: { min: 64, max: 256 }, label: "缩略图大小（像素）" },
  THUMB_SHAPE: { id: "SBG.ThumbShape", kind: "pref", def: "square", choices: [["square", "正方形"], ["ar", "原始比例"]], label: "缩略图形状" },
  THUMB_PER_ROW: {
    id: "SBG.ThumbPerRow", kind: "pref", def: "auto", label: "每行缩略图数量",
    choices: [["auto", "自动"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["8", "8"], ["10", "10"]],
  },
  TOOLBAR_LAYOUT: {
    id: "SBG.ToolbarLayout", kind: "pref", def: "count-in-search", label: "工具栏布局",
    choices: [["rows", "在底部显示数量"], ["count-in-search", "在搜索栏中显示数量"], ["filters-in-search", "在搜索栏中显示筛选器"]],
  },
  CARD_STYLE: {
    id: "SBG.CardStyle", kind: "pref", def: "one-line", label: "卡片样式",
    choices: [["boxed", "带边框卡片"], ["one-line", "图片及单行信息"], ["picture", "仅图片"]],
  },
  CARD_LIFT: { id: "SBG.CardLift", kind: "pref", def: true, label: "悬停动画" },
  SORT: { id: "SBG.DefaultSort", kind: "pref", def: "created_desc", choices: SORT_OPTIONS, label: "默认排序" },
  THEME: { id: "SBG.Theme", kind: "theme" },
  THEME_ORDER: { id: "SBG.ThemeOrder", kind: "library", label: "主题顺序" },
  PINNED_FOLDERS: { id: "SBG.PinnedFolders", kind: "library", label: "置顶文件夹" },
  SETTINGS_CHANGED: { id: "SBG.SettingsChanged", kind: "content" },
  FAVORITE_MEDIA: { id: "SBG.FavoriteMedia", kind: "library", label: "favorites" },
  PICKER_ROOTS_IN_FOLDERS: { id: "SBG.PickerRootsInFolders", kind: "pref", def: false, label: "在文件夹菜单中显示根目录" },
  PICKER_INCLUDE_SUBFOLDERS: { id: "SBG.PickerIncludeSubfolders", kind: "pref", def: true, label: "包含子文件夹中的文件" },
  GRID_WHEEL_SPEED: { id: "SBG.GridWheelSpeed", kind: "pref", def: 100, range: { min: 25, max: 400 }, label: "滚轮滚动速度（%）" },
  KEY_PREV: { id: "SBG.KeyPrev", kind: "key", def: "ArrowLeft,a,j", label: "上一个文件", tip: "在查看器中打开上一个文件" },
  KEY_NEXT: { id: "SBG.KeyNext", kind: "key", def: "ArrowRight,d,l", label: "下一个文件", tip: "在查看器中打开下一个文件" },
  KEY_CLOSE: { id: "SBG.KeyClose", kind: "key", def: "Escape,q,z,0", label: "关闭查看器", tip: "关闭查看器；若处于全屏或对比模式，则先退出该模式。" },
  KEY_TOGGLE: { id: "SBG.KeyToggle", kind: "key", def: "z,0", label: "切换图库" },
  KEY_REFRESH: { id: "SBG.KeyRefresh", kind: "key", def: "", label: "刷新图库" },
  KEY_FULLSCREEN: { id: "SBG.KeyFullscreen", kind: "key", def: "f", label: "全屏" },
  KEY_DOWNLOAD: { id: "SBG.KeyDownload", kind: "key", def: "", label: "下载" },
  KEY_COPY_PROMPT: { id: "SBG.KeyCopyPrompt", kind: "key", def: "", label: "复制提示词", tip: "复制正向提示词" },
  KEY_COPY_WF: { id: "SBG.KeyCopyWF", kind: "key", def: "", label: "复制工作流" },
  KEY_LOAD_WF: { id: "SBG.KeyLoadWF", kind: "key", def: "", label: "加载工作流" },
  KEY_COMPARE: { id: "SBG.KeyCompare", kind: "key", def: "c", label: "对比" },
  KEY_RESET_ZOOM: {
    id: "SBG.KeyResetZoom", kind: "key", def: "MiddleClick,r", label: "重置缩放",
    tip: "将图片缩放至适合屏幕。在独立缩放的对比模式下，仅重置鼠标所在一侧。",
  },
  KEY_ZOOM_IN: {
    id: "SBG.KeyZoomIn", kind: "key", def: "=,+", label: "放大",
    tip: "每按一次放大一级，长按持续放大。遵循缩放灵敏度和缩放方向设置。",
  },
  KEY_ZOOM_OUT: { id: "SBG.KeyZoomOut", kind: "key", def: "-", label: "缩小", tip: "每按一次缩小一级，长按持续缩小。" },
  KEY_MUTE: { id: "SBG.KeyMute", kind: "key", def: "m", label: "静音", tip: "切换当前视频或音频的静音状态" },
  KEY_VOL_UP: { id: "SBG.KeyVolumeUp", kind: "key", def: "ArrowUp", label: "提高音量", tip: "将正在播放的视频或音频音量提高 10%，同时取消静音。" },
  KEY_VOL_DOWN: { id: "SBG.KeyVolumeDown", kind: "key", def: "ArrowDown", label: "降低音量", tip: "将正在播放的视频或音频音量降低 10%。" },
  KEY_FAVORITE: { id: "SBG.KeyFavorite", kind: "key", def: "", label: "收藏", tip: "收藏当前文件或取消收藏" },
  KEY_DELETE: {
    id: "SBG.KeyDelete", kind: "key", def: "", label: "删除",
    tip: "与查看器中的删除按钮相同。两秒内再次按下以确认，关闭“删除前确认”后无需确认。在外观中隐藏删除按钮时，此快捷键无效。",
  },
  KEY_FRAME_PREV: { id: "SBG.KeyFramePrev", kind: "key", def: "Comma", label: "上一帧", tip: "暂停视频并后退一帧；音频则后退 5 秒。" },
  KEY_FRAME_NEXT: { id: "SBG.KeyFrameNext", kind: "key", def: ".", label: "下一帧", tip: "暂停视频并前进一帧；音频则前进 5 秒。" },
  KEY_CMP_CUR_PREV: { id: "SBG.KeyCompareCurPrev", kind: "key", def: "Shift+ArrowLeft,Shift+a", label: "左侧上一个文件" },
  KEY_CMP_CUR_NEXT: { id: "SBG.KeyCompareCurNext", kind: "key", def: "Shift+ArrowRight,Shift+d", label: "左侧下一个文件" },
  TOOLTIP_NAME: { id: "SBG.TooltipName", kind: "pref", def: true, label: "显示文件名" },
  TOOLTIP_SIZE: { id: "SBG.TooltipSize", kind: "pref", def: true, label: "显示文件大小" },
  TOOLTIP_DATE: { id: "SBG.TooltipDate", kind: "pref", def: true, label: "显示修改日期" },
  BADGE_HIGH_COLOR: { id: "SBG.BadgeHighColor", kind: "color" },
  BADGE_LOW_COLOR: { id: "SBG.BadgeLowColor", kind: "color" },
  VIDEO_BADGE_COLOR: { id: "SBG.VideoBadgeColor", kind: "color" },
  FAV_COLOR: { id: "SBG.FavColor", kind: "color" },
  LB_SHOW_DOWNLOAD: { id: "SBG.LbShowDownload", kind: "pref", def: true, label: "下载", group: "Lightbox Buttons" },
  LB_SHOW_COPY_PROMPT: { id: "SBG.LbShowCopyPrompt", kind: "pref", def: true, label: "复制提示词", group: "Lightbox Buttons" },
  LB_SHOW_COPY_WF: { id: "SBG.LbShowCopyWF", kind: "pref", def: true, label: "复制工作流", group: "Lightbox Buttons" },
  LB_SHOW_LOAD_WF: { id: "SBG.LbShowLoadWF", kind: "pref", def: true, label: "加载工作流", group: "Lightbox Buttons" },
  LB_SHOW_COMPARE: { id: "SBG.LbShowCompare", kind: "pref", def: true, label: "对比", group: "Lightbox Buttons" },
  LB_SHOW_FAVORITE: { id: "SBG.LbShowFavorite", kind: "pref", def: true, label: "收藏", group: "Lightbox Buttons" },
  LB_SHOW_DELETE: { id: "SBG.LbShowDelete", kind: "pref", def: true, label: "删除", group: "Lightbox Buttons" },
  DELETE_CONFIRM: { id: "SBG.DeleteConfirm", kind: "pref", def: true, label: "删除前确认" },
  LB_BUTTON_ORDER: { id: "SBG.LbButtonOrder", kind: "pref", label: "查看器按钮" },
  CARD_MENU_ORDER: { id: "SBG.CardMenuOrder", kind: "pref", label: "卡片菜单项目" },
  CARD_MENU_SHOW_FAVORITE: { id: "SBG.CardMenuShowFavorite", kind: "pref", def: true, label: "收藏", group: "Card Menu Items" },
  CARD_MENU_SHOW_DOWNLOAD: { id: "SBG.CardMenuShowDownload", kind: "pref", def: true, label: "下载", group: "Card Menu Items" },
  CARD_MENU_SHOW_COPY_PROMPT: { id: "SBG.CardMenuShowCopyPrompt", kind: "pref", def: true, label: "复制提示词", group: "Card Menu Items" },
  CARD_MENU_SHOW_COPY_WF: { id: "SBG.CardMenuShowCopyWF", kind: "pref", def: true, label: "复制工作流", group: "Card Menu Items" },
  CARD_MENU_SHOW_LOAD_WF: { id: "SBG.CardMenuShowLoadWF", kind: "pref", def: true, label: "加载工作流", group: "Card Menu Items" },
  CARD_MENU_SHOW_DELETE: { id: "SBG.CardMenuShowDelete", kind: "pref", def: true, label: "删除", group: "Card Menu Items" },
  LB_COLOR_DOWNLOAD: { id: "SBG.LbColorDownload", kind: "color" },
  LB_COLOR_COPY_PROMPT: { id: "SBG.LbColorCopyPrompt", kind: "color" },
  LB_COLOR_COPY_WF: { id: "SBG.LbColorCopyWF", kind: "color" },
  LB_COLOR_LOAD_WF: { id: "SBG.LbColorLoadWF", kind: "color" },
  LB_COLOR_COMPARE: { id: "SBG.LbColorCompare", kind: "color" },
  LB_COLOR_FAVORITE: { id: "SBG.LbColorFavorite", kind: "color" },
  LB_COLOR_DELETE: { id: "SBG.LbColorDelete", kind: "color" },
  SEARCH_TAG_COLOR: { id: "SBG.SearchTagColor", kind: "color" },
  SEARCH_TAG_NEG_COLOR: { id: "SBG.SearchTagNegColor", kind: "color" },
  SAVED_SEARCHES: { id: "SBG.SavedSearches", kind: "library", label: "已保存的搜索" },
  SEARCH_AC_ROWS: { id: "SBG.SearchAcRows", kind: "pref", def: 8, range: { min: 3, max: 30 }, label: "搜索建议行数" },
  APP_BADGE_COMFYUI: { id: "SBG.AppBadgeComfyUI", kind: "color" },
  APP_BADGE_A1111: { id: "SBG.AppBadgeA1111", kind: "color" },
  APP_BADGE_FORGE: { id: "SBG.AppBadgeForge", kind: "color" },
  APP_BADGE_SDNEXT: { id: "SBG.AppBadgeSDNext", kind: "color" },
  APP_BADGE_FOOOCUS: { id: "SBG.AppBadgeFooocus", kind: "color" },
  APP_BADGE_CIVITAI: { id: "SBG.AppBadgeCivitAI", kind: "color" },
  INITIAL_IMAGE_TAB_COLOR: { id: "SBG.InitialImageTabColor", kind: "color" },
  PILL_BG_COLOR: { id: "SBG.PillBgColor", kind: "color" },
  PILL_TEXT_COLOR: { id: "SBG.PillTextColor", kind: "color" },
  PILL_BORDER_COLOR: { id: "SBG.PillBorderColor", kind: "color" },
  HIGHLIGHT_TEXT_COLOR: { id: "SBG.HighlightTextColor", kind: "color" },
  FILENAME_STYLE: { id: "SBG.FilenameStyle", kind: "pref", def: "basename", choices: _NAMES, label: "文件名显示" },
  MODEL_NAME_STYLE: { id: "SBG.ModelNameStyle", kind: "pref", def: "basename", choices: _NAMES, label: "模型名显示" },
  VSCROLL_BUFFER: { id: "SBG.VScrollBuffer", kind: "pref", def: 2, range: { min: 1, max: 30 }, label: "滚动缓冲（行）" },
  META_TAB_PERSIST: { id: "SBG.MetaTabPersist", kind: "pref", def: false, label: "浏览时保持当前标签页" },
  LB_ZOOM_SCROLL_MODE: {
    id: "SBG.LbZoomScrollMode", kind: "pref", def: "mouse", label: "滚动输入",
    choices: [["mouse", "鼠标"], ["touchpad", "触控板"], ["auto", "自动"]],
  },
  LB_ZOOM_ANCHOR: {
    id: "SBG.LbZoomAnchor", kind: "pref", def: "cursor", label: "缩放方向",
    choices: [["cursor", "朝向鼠标指针"], ["center", "朝向视图中心"]],
  },
  // Older versions saved an emptied box as 0 and zoomed at the slowest speed for it.
  LB_ZOOM_SENSITIVITY: { id: "SBG.LbZoomSensitivity", kind: "pref", def: 1, range: { min: 0.1, max: 5, step: 0.1, zeroIsMin: true }, label: "缩放灵敏度" },
  LB_COMPARE_ZOOM: {
    id: "SBG.LbCompareZoom", kind: "pref", def: "independent", label: "对比缩放",
    choices: [["independent", "两侧独立"], ["synced", "两侧同步"]],
  },
  LB_ZOOM_KEEP_ON_NAV: { id: "SBG.LbZoomKeepOnNav", kind: "pref", def: false, label: "浏览时保持缩放" },
  LAYOUT_PROFILES: { id: "SBG.Layouts", kind: "layout", label: "layouts" },
  LAYOUT_INDEX: { id: "SBG.LayoutsIndex", kind: "layout", label: "layouts" },
  HIGHLIGHT_BG: { id: "HighlightBg", kind: "color" },
  CUSTOM_BG: { id: "CUSTOM_BG", kind: "color" },
  CUSTOM_SURFACE: { id: "CUSTOM_SURFACE", kind: "color" },
  CUSTOM_BORDER: { id: "CUSTOM_BORDER", kind: "color" },
  CUSTOM_TEXT: { id: "CUSTOM_TEXT", kind: "color" },
  CUSTOM_ACCENT: { id: "CUSTOM_ACCENT", kind: "color" },
  DOWNGRADED_FROM: { id: "SBG._downgradedFrom", kind: "content" },
};

export const S = Object.freeze({
  ...Object.fromEntries(Object.entries(SETTINGS).map(([name, d]) => [name, d.id])),

  LAYOUT_PROFILE_PREFIX: "SBG.Layouts.",
});

// The saved orders store the ids of these two lists, so renaming an id sends
// that item to the end.
export const LB_BUTTONS = Object.freeze([
  { id: "favorite", label: "收藏", show: S.LB_SHOW_FAVORITE, color: S.LB_COLOR_FAVORITE },
  { id: "download", label: "下载", show: S.LB_SHOW_DOWNLOAD, color: S.LB_COLOR_DOWNLOAD },
  { id: "copy-prompt", label: "复制提示词", show: S.LB_SHOW_COPY_PROMPT, color: S.LB_COLOR_COPY_PROMPT },
  { id: "copy-wf", label: "复制工作流", show: S.LB_SHOW_COPY_WF, color: S.LB_COLOR_COPY_WF },
  { id: "load-wf", label: "加载工作流", show: S.LB_SHOW_LOAD_WF, color: S.LB_COLOR_LOAD_WF },
  { id: "compare", label: "对比", show: S.LB_SHOW_COMPARE, color: S.LB_COLOR_COMPARE },
  { id: "delete", label: "删除", show: S.LB_SHOW_DELETE, color: S.LB_COLOR_DELETE },
]);
export const CARD_MENU_ITEMS = Object.freeze([
  { id: "favorite", label: "收藏", show: S.CARD_MENU_SHOW_FAVORITE },
  { id: "download", label: "下载", show: S.CARD_MENU_SHOW_DOWNLOAD },
  { id: "copy-prompt", label: "复制提示词", show: S.CARD_MENU_SHOW_COPY_PROMPT },
  { id: "copy-wf", label: "复制工作流", show: S.CARD_MENU_SHOW_COPY_WF },
  { id: "load-wf", label: "加载工作流", show: S.CARD_MENU_SHOW_LOAD_WF },
  { id: "delete", label: "删除", show: S.CARD_MENU_SHOW_DELETE },
]);

for (const [name, items] of [["LB_BUTTON_ORDER", LB_BUTTONS], ["CARD_MENU_ORDER", CARD_MENU_ITEMS]]) {
  SETTINGS[name].def = items.map((b) => b.id);
  SETTINGS[name].choices = items.map((b) => [b.id, b.label]);
}
Object.freeze(SETTINGS);

// A group's `scope` says where its keys are listened for, and two bindings clash
// only within one scope. The lightbox takes a press first and keeps every one
// bound there, so one key can serve an action in each scope.
export const KEYBIND_GROUPS = [
  { title: "图库", scope: "gallery", keys: ["KEY_TOGGLE", "KEY_REFRESH"] },
  { title: "导航", scope: "lightbox", keys: ["KEY_PREV", "KEY_NEXT", "KEY_CLOSE"] },
  {
    title: "查看器操作", scope: "lightbox",
    keys: ["KEY_FULLSCREEN", "KEY_DOWNLOAD", "KEY_COPY_PROMPT", "KEY_COPY_WF", "KEY_LOAD_WF", "KEY_FAVORITE", "KEY_DELETE", "KEY_COMPARE"],
  },
  { title: "缩放", scope: "lightbox", keys: ["KEY_RESET_ZOOM", "KEY_ZOOM_IN", "KEY_ZOOM_OUT"] },
  { title: "视频和音频", scope: "lightbox", keys: ["KEY_MUTE", "KEY_VOL_UP", "KEY_VOL_DOWN", "KEY_FRAME_PREV", "KEY_FRAME_NEXT"] },
  {
    title: "对比模式", scope: "lightbox",
    desc: "在对比模式下，上一个和下一个快捷键切换右侧文件；以下快捷键切换左侧文件。",
    keys: ["KEY_CMP_CUR_PREV", "KEY_CMP_CUR_NEXT"],
  },
].map((g) => ({ ...g, keys: g.keys.map((name) => SETTINGS[name]) }));

const _SCOPES = Object.fromEntries(KEYBIND_GROUPS.flatMap((g) => g.keys.map((k) => [k.id, g.scope])));

export const keyScope = (id) => _SCOPES[id] ?? null;

const _BY_ID = new Map(Object.values(SETTINGS).map((d) => {
  if (Array.isArray(d.def)) Object.freeze(d.def);
  return [d.id, d];
}));

export const declaration = (id) => _BY_ID.get(id);

// What a reader gets for a stored value: the value when it is one the setting
// takes, brought into its range, and the default otherwise. A hand-edited file
// or a later version can store anything.
export function settingValue(d, raw) {
  if (raw === undefined || raw === null) return d.def;
  if (Array.isArray(d.def)) return Array.isArray(raw) ? raw : d.def;
  if (d.choices) {
    const text = typeof raw === "string" || typeof raw === "number";
    return text && d.choices.some(([v]) => String(v) === String(raw)) ? String(raw) : d.def;
  }
  if (d.range) {
    // A value that is no number reads as unset, and so does zero unless the
    // setting reads it as its lowest value. A value between steps is read as
    // stored, since an older version saved whatever was typed and only the
    // box rounds to the step. A setting without a step holds a whole number,
    // which its readers count with.
    const n = Number(raw);
    const { min, max, step, zeroIsMin } = d.range;
    if (!Number.isFinite(n) || (n === 0 && !zeroIsMin)) return d.def;
    return Math.min(max, Math.max(min, step ? n : Math.round(n)));
  }
  if (typeof d.def === "boolean") return typeof raw === "boolean" ? raw : d.def;
  if (d.kind === "key") return typeof raw === "string" ? raw : d.def;
  return raw;
}
