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
//#region src/disclosure-button.ts
var { DISCLOSURE_BUTTON_OPEN: a, DISCLOSURE_BUTTON_CLOSE: o } = e, s = class extends HTMLElement {
	$button = null;
	elements = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.elements = [];
	}
	init() {
		if (this.$button = this.querySelector("button"), !this.$button) throw Error("DisclosureButton: button element not found");
		this.elements = this.$button.ariaControlsElements ?? [], this.$button.addEventListener("click", this.#t);
	}
	get expanded() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	get #e() {
		return this.elements.filter((e) => !e.hidden);
	}
	toggle() {
		return this.$button ? this.#e.length > 0 ? t(this.$button, o, this.#n(!1)) ? (this.close(!1), !0) : !1 : t(this.$button, a, this.#n(!0)) ? (this.open(!1), !0) : !1 : !1;
	}
	close(e = !0) {
		this.$button && (e && this.#e.length > 0 && !t(this.$button, o, this.#n(!1)) || (this.elements.forEach((e) => {
			e.hidden = !0;
		}), this.update()));
	}
	open(e = !0) {
		this.$button && (e && this.#e.length !== this.elements.length && !t(this.$button, a, this.#n(!0)) || (this.elements.forEach((e) => {
			e.hidden = !1;
		}), this.update()));
	}
	update() {
		this.$button && this.$button.setAttribute("aria-expanded", this.#e.length > 0 ? "true" : "false");
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.#t);
	}
	#t = () => {
		this.toggle();
	};
	#n(e) {
		return {
			ids: this.elements.map((e) => e.id),
			elements: this.elements,
			$button: this.$button,
			open: e
		};
	}
};
customElements.get("cinq-disclosure-button") || customElements.define("cinq-disclosure-button", s);
//#endregion
export { s as DisclosureButton };
