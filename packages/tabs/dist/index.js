//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	DRAWER_CLOSE: "drawer:close",
	DRAWER_OPEN: "drawer:open",
	DRAWER_TOGGLE: "drawer:toggle",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
	MODAL_CLOSE: "modal:close",
	MODAL_OPEN: "modal:open",
	MODAL_TOGGLE: "modal:toggle",
	SPINBUTTON_CHANGE: "spinbutton:change",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_OPEN: "accordion:open",
	ACCORDION_CLOSE: "accordion:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	SLIDER_CHANGE: "slider:change",
	CALENDAR_CHANGE: "calendar:change",
	TABS_BEFORE_ACTIVATE: "tabs:before-activate",
	TABS_ACTIVATE: "tabs:activate",
	TABS_DELETE: "tabs:delete",
	CART_BEFORE_ADD: "cart:before-add",
	CART_BEFORE_UPDATE: "cart:before-update",
	CART_UPDATE: "cart:update",
	VARIANT_CHANGE: "variant:change"
}, t = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, n = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, r = document.documentElement, { body: i } = document;
r.hasAttribute("data-debug"), window.addEventListener("pointermove", n(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/utils/getHash.ts
function a(e) {
	let t = e.indexOf("#");
	return t === -1 ? "" : e.substring(t + 1);
}
//#endregion
//#region src/TabPanel.ts
var o = class {
	el;
	id;
	constructor(e) {
		this.el = e, this.id = e.id;
	}
	deactivate() {
		console.log("TabPanel.deactivate", this.id), this.el.setAttribute("hidden", "true"), this.el.classList.remove("is-active");
	}
	activate() {
		this.el.removeAttribute("hidden"), this.el.classList.add("is-active");
	}
	delete = () => this.el.parentElement?.removeChild(this.el);
	destroy() {
		this.el.removeAttribute("hidden"), this.el.classList.remove("is-active");
	}
}, s = class {
	el;
	active = !1;
	id = "";
	index;
	controls;
	constructor(e, t) {
		this.el = e, this.index = t, this.id = e.id;
		let n = (e.ariaControlsElements ?? [])[0];
		this.controls = n?.id ?? "";
		let r = e.getAttribute("aria-selected");
		this.active = r === "true";
	}
	init = () => this.initEvents();
	initEvents = () => this.el.addEventListener("click", this.handleClick);
	handleClick = () => this.toggle();
	toggle(n = !0) {
		this.active || t(this.el, e.TABS_BEFORE_ACTIVATE, {
			index: this.index,
			controls: this.controls,
			element: this.el
		}) && (t(this.el, e.TABS_ACTIVATE, {
			controls: this.controls,
			element: this.el
		}, { cancelable: !1 }), this.activate(n));
	}
	activate(e = !0) {
		this.active = !0, this.el.setAttribute("tabindex", "0"), this.el.setAttribute("aria-selected", "true"), this.el.classList.add("is-active"), e && this.focus();
	}
	deactivate() {
		this.active = !1, this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-selected", "false"), this.el.classList.remove("is-active");
	}
	focus = () => this.el.focus();
	delete = () => {
		t(this.el, e.TABS_DELETE, {
			controls: this.controls,
			element: this.el
		}, { cancelable: !1 }), this.el.parentElement?.removeChild(this.el);
	};
	destroy() {
		this.el.removeAttribute("tabindex"), this.el.removeAttribute("aria-selected"), this.el.classList.remove("is-active"), this.el.removeEventListener("click", this.handleClick);
	}
}, c = class extends HTMLElement {
	$tabList;
	current = 0;
	tabPanels = [];
	tabs = [];
	href = "";
	hash = !1;
	delay = 0;
	constructor() {
		super(), this.$tabList = null;
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.$tabList = this.querySelector("[role=\"tablist\"]");
		let t = this.getAttribute("data-hash"), n = this.getAttribute("data-delay");
		if (this.hash = t === null ? this.hash : t !== "false" && t !== "0", n !== null) {
			let e = parseInt(n, 10);
			this.delay = Number.isNaN(e) ? 0 : e;
		}
		if (this.href = this.hash && a(window.location.hash) || "", !this.$tabList) return;
		if (this.tabs = [...this.$tabList.querySelectorAll("[role=\"tab\"]")].map((e, t) => new s(e, t)), this.tabs.forEach((t, n) => {
			this.tabPanels.push(new o(this.querySelector(`#${t.controls}[role="tabpanel"]`))), t.init(), t.el.addEventListener(e.TABS_ACTIVATE, () => {
				this.current = n, this.deactivateTabs(), this.deactivateTabPanels(), t.activate(!1), this.tabPanels.find((e) => e.id === t.controls)?.activate(), this.hash && (this.href = t.id, window.location.hash = t.id);
			});
		}), this.href) {
			let e = this.tabs.findIndex((e) => e.id === this.href);
			e >= 0 && (this.current = e);
		}
		if (!this.href || this.current === 0) {
			let e = this.tabs.findIndex((e) => e.active);
			e >= 0 && (this.current = e);
		}
		let r = this.tabs[this.current];
		r && (this.deactivateTabs(), this.deactivateTabPanels(), r.activate(!1), this.tabPanels.find((e) => e.id === r.controls)?.activate()), this.initEvents();
	}
	initEvents() {
		this.$tabList?.addEventListener("keydown", this.handleKeydown);
	}
	get #e() {
		let e = this.$tabList ?? this;
		return e ? getComputedStyle(e).direction === "rtl" : !1;
	}
	handleKeydown = (e) => {
		let { key: t, code: n, target: r } = e, i = JSON.parse(r.getAttribute("aria-selected")), a = () => {
			this.current = 0 > this.current - 1 ? this.tabs.length - 1 : this.current - 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
				this.tabs[this.current].toggle(!1);
			}, this.delay);
		}, o = () => {
			this.current = this.current + 1 > this.tabs.length - 1 ? 0 : this.current + 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
				this.tabs[this.current].toggle(!1);
			}, this.delay);
		}, s = () => {
			e.preventDefault(), this.current = 0, this.tabs[this.current].toggle();
		}, c = () => {
			e.preventDefault(), this.current = this.tabs.length - 1, this.tabs[this.current].toggle();
		}, l = this.#e, u = {
			ArrowUp: a,
			ArrowDown: o,
			ArrowLeft: l ? o : a,
			ArrowRight: l ? a : o,
			End: c,
			Home: s,
			PageUp: s,
			PageDown: c,
			Delete: () => i && this.delete(e),
			Backspace: () => i && this.delete(e),
			default: () => !1
		};
		return (u[t || n] || u.default)();
	};
	deactivateTabs = () => this.tabs.forEach((e) => e.deactivate());
	deactivateTabPanels = () => this.tabPanels.forEach((e) => e.deactivate());
	delete({ target: e }) {
		return e.getAttribute("data-deletable") !== null && (this.tabs[this.current].delete(), this.tabPanels[this.current].delete(), this.tabs.splice(this.current, 1), this.tabPanels.splice(this.current, 1), this.current = 0 > this.current - 1 ? 0 : this.current - 1, this.tabs[this.current].toggle(), !0);
	}
	destroy() {
		this.$tabList?.removeEventListener("keydown", this.handleKeydown), this.tabs.forEach((e) => e.destroy()), this.tabPanels.forEach((e) => e.destroy()), this.tabs = [], this.tabPanels = [];
	}
};
customElements.get("cinq-tabs") || customElements.define("cinq-tabs", c);
//#endregion
export { c as Tabs };
