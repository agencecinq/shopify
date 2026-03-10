function v(i) {
  const t = i.indexOf("#");
  return t === -1 ? "" : i.substring(t + 1);
}
const f = !0, E = 0;
class A {
  el;
  id;
  constructor(t) {
    this.el = t, this.id = t.id;
  }
  deactivate() {
    this.el.setAttribute("hidden", "true"), this.el.classList.remove("is-active");
  }
  activate() {
    this.el.removeAttribute("hidden"), this.el.classList.add("is-active");
  }
  delete = () => this.el.parentElement?.removeChild(this.el);
  destroy() {
    this.el.removeAttribute("hidden"), this.el.classList.remove("is-active");
  }
}
function b(i, t, e) {
  const s = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !1,
    detail: t
  });
  return i.dispatchEvent(s);
}
const a = {
  BEFORE_ACTIVATE: "tab-before-activate",
  ACTIVATE: "tab-activate",
  DELETE: "tab-delete"
};
class g {
  el;
  active = !1;
  id = "";
  index;
  controls;
  constructor(t, e) {
    this.el = t, this.index = e, this.id = t.id, this.controls = t.getAttribute("aria-controls")?.trim().split(" ")[0] || "";
    const s = t.getAttribute("aria-selected");
    this.active = s === "true";
  }
  init = () => this.initEvents();
  initEvents = () => this.el.addEventListener("click", this.handleClick);
  /**
   * Handle click
   */
  handleClick = () => this.toggle();
  /**
   * Toggle
   *
   * @param {boolean} focus
   */
  toggle(t = !0) {
    if (this.active)
      return;
    const e = new CustomEvent(a.BEFORE_ACTIVATE, {
      bubbles: !0,
      cancelable: !0,
      detail: { index: this.index, controls: this.controls, element: this.el }
    });
    this.el.dispatchEvent(e), !e.defaultPrevented && (b(this.el, { controls: this.controls, element: this.el }, a.ACTIVATE), this.activate(t));
  }
  /**
   * Activate tab
   *
   * @param {boolean} focus
   * @return void
   */
  activate(t = !0) {
    this.active = !0, this.el.setAttribute("tabindex", "0"), this.el.setAttribute("aria-selected", "true"), this.el.classList.add("is-active"), t && this.focus();
  }
  /**
   * Deactivate tab
   *
   * @return void
   */
  deactivate() {
    this.active = !1, this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-selected", "false"), this.el.classList.remove("is-active");
  }
  /**
   * Focus tab
   *
   * @return void
   */
  focus = () => this.el.focus();
  /**
   * Delete tab
   *
   * @return void
   */
  delete = () => {
    b(this.el, { controls: this.controls, element: this.el }, a.DELETE), this.el.parentElement?.removeChild(this.el);
  };
  destroy() {
    this.el.removeAttribute("tabindex"), this.el.removeAttribute("aria-selected"), this.el.classList.remove("is-active"), this.el.removeEventListener("click", this.handleClick);
  }
}
class m extends HTMLElement {
  $tabList;
  current = 0;
  tabPanels = [];
  tabs = [];
  href = "";
  hash = f;
  delay = E;
  setActiveTab(t) {
    this.current = t, this.deactivateTabs(), this.deactivateTabPanels();
    const e = this.tabs[t];
    this.tabPanels.find((r) => r.id === e.controls)?.activate(), this.hash && (this.href = e.id, window.location.hash = e.id);
  }
  /** Call after preventing `tab-before-activate` to complete activation (e.g. after async work). */
  activateTab(t) {
    this.setActiveTab(t), this.tabs[t]?.activate(!1);
  }
  constructor() {
    super(), this.$tabList = null;
  }
  connectedCallback() {
    this.$tabList = this.querySelector('[role="tablist"]');
    const t = this.getAttribute("data-tabs-hash"), e = this.getAttribute("data-tabs-delay");
    if (this.hash = t === null ? this.hash : t !== "false" && t !== "0", e !== null) {
      const s = parseInt(e, 10);
      this.delay = Number.isNaN(s) ? 0 : s;
    }
    this.href = this.hash && v(window.location.hash) || "", this.init();
  }
  disconnectedCallback() {
    this.destroy();
  }
  init() {
    this.$tabList && (this.tabs = [...this.$tabList.querySelectorAll('[role="tab"]')].map(
      (t, e) => new g(t, e)
    ), this.tabs.forEach((t, e) => {
      this.tabPanels.push(
        new A(this.querySelector(`#${t.controls}[role="tabpanel"]`))
      ), t.init(), t.el.addEventListener(a.ACTIVATE, () => this.setActiveTab(e)), (t.active || t.id === this.href || this.current === e) && (this.setActiveTab(e), t.activate(!1));
    }), this.initEvents());
  }
  initEvents() {
    this.$tabList?.addEventListener("keydown", this.handleKeydown);
  }
  get isRtl() {
    const t = this.$tabList ?? this;
    return t ? getComputedStyle(t).direction === "rtl" : !1;
  }
  handleKeydown = (t) => {
    const { key: e, code: s, target: r } = t, n = JSON.parse(
      r.getAttribute("aria-selected")
    ), h = () => {
      this.current = 0 > this.current - 1 ? this.tabs.length - 1 : this.current - 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
        this.tabs[this.current].toggle(!1);
      }, this.delay);
    }, l = () => {
      this.current = this.current + 1 > this.tabs.length - 1 ? 0 : this.current + 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
        this.tabs[this.current].toggle(!1);
      }, this.delay);
    }, c = () => {
      t.preventDefault(), this.current = 0, this.tabs[this.current].toggle();
    }, o = () => {
      t.preventDefault(), this.current = this.tabs.length - 1, this.tabs[this.current].toggle();
    }, d = this.isRtl, u = {
      ArrowUp: h,
      ArrowDown: l,
      ArrowLeft: d ? l : h,
      ArrowRight: d ? h : l,
      End: o,
      Home: c,
      PageUp: c,
      PageDown: o,
      Delete: () => n && this.delete(t),
      Backspace: () => n && this.delete(t),
      default: () => !1
    };
    return (u[e || s] || u.default)();
  };
  deactivateTabs = () => this.tabs.forEach((t) => t.deactivate());
  deactivateTabPanels = () => this.tabPanels.forEach((t) => t.deactivate());
  delete({ target: t }) {
    return t.getAttribute("data-deletable") === null ? !1 : (this.tabs[this.current].delete(), this.tabPanels[this.current].delete(), this.tabs.splice(this.current, 1), this.tabPanels.splice(this.current, 1), this.current = 0 > this.current - 1 ? 0 : this.current - 1, this.tabs[this.current].toggle(), !0);
  }
  destroy() {
    this.$tabList?.removeEventListener("keydown", this.handleKeydown), this.tabs.forEach((t) => t.destroy()), this.tabPanels.forEach((t) => t.destroy()), this.tabs = [], this.tabPanels = [];
  }
}
customElements.get("cinq-tabs") || customElements.define("cinq-tabs", m);
export {
  m as Tabs
};
