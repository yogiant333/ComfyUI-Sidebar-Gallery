import { h } from "./sbg-core.js";
import { sectionTitle, toggle, comboInput, numberInput, orderList } from "./sbg-settings-inputs.js";
import { S, LB_BUTTONS, CARD_MENU_ITEMS } from "./sbg-settings-catalog.js";

export function renderAppearance({ content }) {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });

  sectionTitle(wrap, "网格");
  wrap.appendChild(numberInput(S.THUMB_SIZE, "缩略图宽度为 64 至 256 像素，用于决定每行数量，并拉伸填满整行。仅在每行缩略图数量为“自动”时生效。"));
  wrap.appendChild(comboInput(S.THUMB_PER_ROW, "“自动”根据缩略图大小决定每行数量；选择数字则固定每行数量并填满宽度。"));
  wrap.appendChild(comboInput(S.THUMB_SHAPE, "“正方形”将缩略图裁为方形；“原始比例”尽量保留图片比例，仅裁剪过宽或过高的图片。"));

  sectionTitle(wrap, "卡片");
  wrap.appendChild(comboInput(S.CARD_STYLE,
    "文件在网格中的显示方式。“带边框卡片”在图片下方显示名称、大小和日期；“图片及单行信息”在图片下方用一行显示名称和日期；“仅图片”在悬停时覆盖显示名称、大小和日期。"));
  wrap.appendChild(toggle(S.CARD_LIFT, "悬停时抬起卡片并略微放大图片。立即生效。"));

  sectionTitle(wrap, "工具栏");
  wrap.appendChild(comboInput(S.TOOLBAR_LAYOUT, "文件数量和筛选按钮的显示位置。"));
  wrap.appendChild(toggle(S.PICKER_ROOTS_IN_FOLDERS,
    "有多个根目录时，在文件夹下拉菜单顶部列出根目录。立即生效。"));
  wrap.appendChild(numberInput(S.SEARCH_AC_ROWS,
    "搜索建议列表滚动前显示的行数，范围为 3 至 30。先显示已保存的搜索，再显示字段名称。"));

  sectionTitle(wrap, "卡片悬停提示");
  wrap.appendChild(toggle(S.TOOLTIP_NAME, "悬停在卡片上时显示文件名。"));
  wrap.appendChild(toggle(S.TOOLTIP_SIZE, "悬停在卡片上时显示文件大小。"));
  wrap.appendChild(toggle(S.TOOLTIP_DATE, "悬停时显示文件距上次修改的时间；超过一周则显示日期。"));

  sectionTitle(wrap, "查看器按钮");
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "查看器图片下方的按钮。拖动调整顺序，关闭开关可隐藏。重新打开查看器后生效。" }));
  wrap.appendChild(orderList(S.LB_BUTTON_ORDER, LB_BUTTONS));

  sectionTitle(wrap, "卡片菜单");
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "右键点击卡片时打开的菜单。拖动调整顺序，关闭开关可隐藏。全部关闭后，右键打开浏览器菜单。" }));
  wrap.appendChild(orderList(S.CARD_MENU_ORDER, CARD_MENU_ITEMS));

  sectionTitle(wrap, "文件和模型名称");
  wrap.appendChild(comboInput(S.FILENAME_STYLE, "在文件信息中仅显示文件名，或同时显示文件夹路径。"));
  wrap.appendChild(comboInput(S.MODEL_NAME_STYLE, "仅显示模型及 LoRA 名称，或同时显示文件夹路径。"));

  content.appendChild(wrap);
}
