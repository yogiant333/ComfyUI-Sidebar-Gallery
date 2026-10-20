import { h } from "./sbg-core.js";
import { sectionTitle, titleWithKeys } from "./sbg-settings-inputs.js";
import { S, KEYBIND_GROUPS } from "./sbg-settings-catalog.js";
import { getSetting } from "./sbg-settings-store.js";
import { APP_REGISTRY } from "./sbg-theme.js";

const _ALL_KEYS = KEYBIND_GROUPS.flatMap((g) => g.keys);

function keyed(id) {
  return titleWithKeys(_ALL_KEYS.find((k) => k.id === id).label, getSetting(id));
}

const bound = (id) => !!getSetting(id).trim();

function joined(items, last) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} ${last} ${items[items.length - 1]}` : items.join("");
}

function rich(text) {
  return text.split(/(`[^`]+`)/).filter(Boolean).map((part) =>
    part.startsWith("`") ? h("code", { class: "sbg-help__inline", text: part.slice(1, -1) }) : document.createTextNode(part));
}

function para(text) {
  return h("p", { class: "sbg-help__p" }, rich(text));
}

function bullets(items) {
  return h("ul", { class: "sbg-help__list" }, items.map((t) => h("li", {}, rich(t))));
}

function subtitle(text) {
  return h("div", { class: "sbg-help__subtitle", text });
}

function section(wrap, title, nodes) {
  sectionTitle(wrap, title);
  wrap.append(...nodes);
}

export function renderHelp({ content, tabs }) {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form sbg-help" });
  // Named as the rail names it, so a renamed tab reads the same here.
  const tabName = (id) => (tabs.find((t) => t.id === id) || {}).label;

  wrap.append(para("侧边栏图库显示 ComfyUI 输出文件夹及其他添加目录中的图片、视频和音频，以及生成这些文件时使用的设置。"));

  section(wrap, "浏览", [
    bullets([
      "点击卡片可在查看器中打开，右键点击打开卡片菜单，Shift+右键点击打开浏览器菜单。",
      "将卡片拖至“加载图像”节点以使用该图片，或拖至画布加载其工作流。图片会复制到 ComfyUI 输入文件夹；同名且相同的文件会复用，内容不同则以新名称保存副本。",
      "悬停时点击卡片上的星标可收藏文件。文件夹菜单中的“收藏”显示当前根目录的收藏文件。",
      "新文件自动出现。ComfyUI 生成任务完成后会立即显示输出文件；返回页面时检查其他磁盘更改。搜索栏的刷新按钮可扫描当前根目录。",
      "有多个根目录时，各自保存文件夹、置顶、收藏和搜索状态。搜索仅覆盖当前根目录。",
    ]),
  ]);

  section(wrap, "搜索", [
    bullets([
      "输入搜索词后按回车。回车前输入的全部内容（包括空格）视为一个搜索词。",
      "普通搜索词匹配文件名、文件夹名及负向提示词以外的全部元数据。",
      "要搜索指定字段，可使用“名称:搜索词”，例如 `lora:detail` 或 `cfg:7`。元数据面板中的字段、区块及节点名称均可使用，例如 `ksampler:euler`。",
      "搜索词前加减号表示排除，例如 `-euler` 显示不包含 euler 的结果。",
      "有多个搜索词时，搜索栏中的“与”要求全部匹配，“或”要求任一匹配。",
      "搜索受当前文件夹和筛选条件限制。没有结果时，请检查是否选错文件夹。",
      "点击搜索栏并选择“保存当前搜索”即可保存搜索。",
    ]),
    subtitle("使用提示"),
    bullets([
      "仅输入字段名称（例如 `lora`）可查找包含该字段的所有文件。",
      "搜索词匹配值中的任意位置，因此 `cfg:7` 也会匹配 7.5 和 17。",
      `\`app:\` takes ${joined(APP_REGISTRY.map((a) => a.id), "或")}.`,
      "搜索结果的徽标显示匹配的区块。",
    ]),
  ]);

  // Reset Zoom and Fullscreen have no button in the lightbox, so with no key
  // bound they go unnamed. Compare always keeps its line, since a button carries
  // that name.
  const view = [[S.KEY_RESET_ZOOM, "将图片缩放至适合屏幕"], [S.KEY_FULLSCREEN, "全屏显示"]]
    .filter(([id]) => bound(id)).map(([id, what]) => `${keyed(id)} ${what}`);
  section(wrap, "查看器", [
    bullets([
      "滚动或双指捏合进行缩放，放大后拖动平移。" + (view.length ? ` ${view.join(", and ")}.` : ""),
      `${keyed(S.KEY_COMPARE)} 将上一个文件放在当前文件旁进行对比，元数据面板会标记各区块是否相同。上一个和下一个快捷键切换右侧文件，配合 Shift 切换左侧。`,
      "使用其他图片或音频生成的文件，在“生成结果”旁有“源图像”或“源音频”标签页；两者都有则显示“源媒体”，可查看源文件及其设置。",
      "删除会将文件移至回收站；如果没有可用回收站（例如网络驱动器），则移至根目录下的 `.sbg-trash` 文件夹。",
    ]),
  ]);

  section(wrap, "快捷键", [
    bullets([
      `“${tabName("keybindings")}”标签页列出各操作的键盘和鼠标快捷键，可在此修改。`,
      ...(bound(S.KEY_TOGGLE) ? [`${keyed(S.KEY_TOGGLE)} 可在 ComfyUI 页面上除文本输入框外的任何位置使用。`] : []),
      "空格键播放或暂停视频和音频。",
    ]),
  ]);

  section(wrap, "设置说明", [
    bullets([
      "展开预设可查看加载后会发生的变化，并勾选要加载的部分。加载或恢复后，可在备份区点击“撤销”。",
      "预设不包含收藏、已保存的搜索、置顶文件夹和主题顺序。",
      `在“${tabName("layout")}”标签页中，可直接编辑区块或字段名称。新名称可作为搜索前缀，匹配卡片的徽标也会使用新区块名称。各应用的布局在单独编辑前跟随 ComfyUI 布局。`,
      "修改内置主题会先创建副本。主题可通过 `.sbgtheme` 文件导入和导出。",
      `ComfyUI 输出文件夹始终包含在图库中。添加其他文件夹时，在 \`sidebar_gallery_config.json\` 的 \`extra_roots\` 中填写路径并刷新页面。配置文件位置见“${tabName("settings")}”标签页的文件夹区。`,
    ]),
  ]);

  section(wrap, "支持的内容", [
    bullets([
      "支持读取 ComfyUI、Automatic1111、Forge、SD.Next、Fooocus 和 CivitAI 生成器保存的设置。",
      "支持 PNG、JPEG、WebP 图片；MP4、WebM、MOV、MKV、AVI 视频；MP3、FLAC、WAV、OGG、Opus、M4A 音频。其他文件类型不会显示。",
      "无法读取生成设置的文件仍可显示和打开，但仅提供文件详情。",
    ]),
  ]);

  section(wrap, "排查问题", [
    bullets([
      "文件缺失或已删除文件仍显示时，点击搜索栏的刷新按钮。",
      "更新后生成设置异常或缺失时，在“诊断”中点击“重建索引”。图库仍可使用，后台会重新读取所有文件。",
      "缩略图或详情未更新时，在“诊断”中清除浏览器缓存。",
    ]),
  ]);

  content.appendChild(wrap);
}
