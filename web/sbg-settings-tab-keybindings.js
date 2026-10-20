import { h } from "./sbg-core.js";
import { sectionTitle, keyInput } from "./sbg-settings-inputs.js";
import { KEYBIND_GROUPS } from "./sbg-settings-catalog.js";

// Every row gets every action, since a clash can cross groups within a scope,
// and the row itself skips the actions in the other scope.
const ALL_KEYS = KEYBIND_GROUPS.flatMap(g => g.keys);

export function renderKeybindings({ content, visitCleanups }) {
  content.innerHTML = "";
  const wrap = h("div", { class: "sbg-gs-form" });
  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "点击“添加”，然后按下键盘按键或鼠标按钮。点击按键旁的叉号可移除。轻按 Esc 绑定该键，长按 Esc 取消。" }));

  for (const group of KEYBIND_GROUPS) {
    sectionTitle(wrap, group.title);
    if (group.desc) wrap.appendChild(h("div", { class: "sbg-gs-desc", text: group.desc }));
    for (const spec of group.keys) wrap.appendChild(keyInput(spec, ALL_KEYS, visitCleanups));
  }

  wrap.appendChild(h("div", { class: "sbg-gs-desc", text: "非对比模式的全屏视频中，“上一个文件”和“下一个文件”将后退或前进视频总时长的十分之一。" }));
  content.appendChild(wrap);
}
