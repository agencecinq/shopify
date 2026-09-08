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
//#region src/switch.ts
var a = class extends HTMLElement {
	static observedAttributes = ["checked", "disabled"];
	$input = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null;
	}
	init() {
		this.$input = this.querySelector("input"), this.addEventListener("click", this.#e), this.addEventListener("keydown", this.#t), this.#r();
	}
	attributeChangedCallback(e, t, n) {
		if (e === "disabled") {
			this.#r(), n !== null && this.matches(":focus") && this.blur();
			return;
		}
		if (e === "checked") {
			if (n !== null && !this.checked) {
				this.activate();
				return;
			}
			n === null && this.checked && this.deactivate();
		}
	}
	get checked() {
		return this.getAttribute("aria-checked") === "true";
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true";
	}
	toggle() {
		return this.disabled ? !1 : this.checked ? this.deactivate() : this.activate();
	}
	activate(n = !0) {
		return this.disabled || this.checked || n && !t(this, e.SWITCH_ACTIVATE, this.#n) ? !1 : (this.setAttribute("aria-checked", "true"), this.#r(), this.setAttribute("checked", ""), !0);
	}
	deactivate(n = !0) {
		return this.disabled || !this.checked || n && !t(this, e.SWITCH_DEACTIVATE, this.#n) ? !1 : (this.setAttribute("aria-checked", "false"), this.#r(), this.removeAttribute("checked"), !0);
	}
	destroy() {
		this.removeEventListener("click", this.#e), this.removeEventListener("keydown", this.#t);
	}
	#e = (e) => {
		this.disabled || e.detail !== 0 && this.toggle();
	};
	#t = (e) => {
		this.disabled || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.toggle());
	};
	get #n() {
		return { el: this };
	}
	#r() {
		this.$input && (this.$input.checked = this.checked, this.$input.toggleAttribute("checked", this.checked), this.$input.disabled = this.disabled, this.$input.toggleAttribute("disabled", this.disabled));
	}
};
customElements.get("cinq-switch") || customElements.define("cinq-switch", a);
//#endregion
export { a as Switch };
