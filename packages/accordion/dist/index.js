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
}, n = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", r = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, i = document.documentElement, { body: a } = document;
i.hasAttribute("data-debug"), window.addEventListener("pointermove", r(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/utils.ts
var o = (e) => {
	e.classList.remove("is-active");
}, s = (e) => {
	e.classList.add("is-active");
}, c = () => decodeURIComponent(document.location.hash.replace(/^#\/?/, "")), l = class {
	el;
	$body = null;
	$button = null;
	$inner = null;
	index;
	isDeselect = !1;
	isOpen = !1;
	height = 0;
	transitionDuration = 0;
	#e = 0;
	#t = 0;
	constructor(e, t) {
		this.el = e, this.index = t;
	}
	init() {
		if (this.$button = this.el.querySelector("[data-header]") || this.el.querySelector("button"), !this.$button) throw Error("Accordion panel: header button not found");
		if (this.$body = (this.$button.ariaControlsElements ?? [])[0] ?? document.getElementById(this.$button.getAttribute("aria-controls") || ""), !this.$body) throw Error("Accordion panel: aria-controls target not found");
		this.$inner = this.$body.querySelector("[data-inner]") || this.$body.firstElementChild, this.isDeselect = n(this.el.getAttribute("data-deselect")), this.isOpen = this.$button.getAttribute("aria-expanded") === "true", this.#o(), this.$button.addEventListener("click", this.#r), this.$button.addEventListener("focus", this.#i), this.$button.addEventListener("blur", this.#a), window.addEventListener("resize", this.#o);
	}
	get open() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	openPanel(n = !0) {
		return !this.$button || !this.$body || this.open || n && !t(this.el, e.ACCORDION_OPEN, this.#s) ? !1 : (this.$button.setAttribute("aria-expanded", "true"), this.el.setAttribute("data-open", "true"), this.$body.removeAttribute("hidden"), this.#o(), this.$body.style.setProperty("max-height", "0"), this.#n(), this.#e = requestAnimationFrame(() => {
			this.#e = 0, this.$body && (this.$body.style.setProperty("max-height", `${this.height}px`), this.#t = window.setTimeout(() => {
				this.#t = 0, this.$body?.style.removeProperty("max-height");
			}, this.transitionDuration));
		}), s(this.el), this.isOpen = !0, !0);
	}
	close(n = !0) {
		return !this.$button || !this.$body || !this.open || n && !t(this.el, e.ACCORDION_CLOSE, this.#s) ? !1 : (this.$button.setAttribute("aria-expanded", "false"), this.el.setAttribute("data-open", "false"), this.#o(), this.$body.style.setProperty("max-height", `${this.height}px`), this.#n(), this.#e = requestAnimationFrame(() => {
			this.#e = 0, this.$body?.style.setProperty("max-height", "0");
		}), this.#t = window.setTimeout(() => {
			this.#t = 0, this.$body?.setAttribute("hidden", "");
		}, this.transitionDuration), o(this.el), this.isOpen = !1, !0);
	}
	toggle() {
		return !this.isDeselect && this.open ? !1 : this.open ? this.close() : this.openPanel();
	}
	focus() {
		this.$button?.focus();
	}
	destroy() {
		this.#n(), this.$button?.removeEventListener("click", this.#r), this.$button?.removeEventListener("focus", this.#i), this.$button?.removeEventListener("blur", this.#a), window.removeEventListener("resize", this.#o), this.$body && (this.$body.style.removeProperty("max-height"), this.$body.style.removeProperty("overflow")), o(this.el), this.$body = null, this.$button = null, this.$inner = null;
	}
	#n() {
		this.#e &&= (cancelAnimationFrame(this.#e), 0), this.#t &&= (clearTimeout(this.#t), 0);
	}
	#r = () => {
		this.toggle();
	};
	#i = () => {
		this.$button?.classList.add("focus");
	};
	#a = () => {
		this.$button?.classList.remove("focus");
	};
	#o = () => {
		if (!this.$body) return;
		this.$body.removeAttribute("hidden"), this.height = this.$inner?.offsetHeight || this.$body.scrollHeight || 0, this.$body.style.setProperty("overflow", "hidden");
		let e = parseFloat(getComputedStyle(this.$body).transitionDuration);
		this.transitionDuration = Number.isNaN(e) ? 0 : e * 1e3, this.open ? this.$body.style.removeProperty("max-height") : (this.$body.setAttribute("hidden", ""), this.$body.style.setProperty("max-height", "0"));
	};
	get #s() {
		return {
			el: this.el,
			index: this.index
		};
	}
}, u = {
	multiselectable: !1,
	hash: !0
}, d = class extends HTMLElement {
	panels = [];
	current = 0;
	options = { ...u };
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.options = {
			multiselectable: n(this.getAttribute("data-multiselectable")),
			hash: n(this.getAttribute("data-hash"), u.hash)
		}, this.panels = [...this.querySelectorAll("[data-panel]")].filter((e) => e.closest("cinq-accordion") === this).map((e, t) => {
			let n = new l(e, t);
			return n.init(), n;
		}), this.addEventListener(e.ACCORDION_OPEN, this.#e), this.addEventListener("keydown", this.#n), this.options.hash && (window.addEventListener("hashchange", this.#t), this.#t());
	}
	closeAll() {
		this.panels.forEach((e) => e.close(!1));
	}
	destroy() {
		this.removeEventListener(e.ACCORDION_OPEN, this.#e), this.removeEventListener("keydown", this.#n), window.removeEventListener("hashchange", this.#t), this.panels.forEach((e) => e.destroy()), this.panels = [];
	}
	#e = (e) => {
		let { el: t, index: n } = e.detail;
		t.closest("cinq-accordion") === this && (this.current = n, !this.options.multiselectable && this.panels.forEach((e, t) => {
			t !== n && e.close(!1);
		}));
	};
	#t = () => {
		let e = c();
		e && this.panels.forEach((t, n) => {
			t.$body && t.$body.id === e && (this.current = n, this.panels.forEach((e, t) => {
				t !== n && e.close(!1);
			}), t.openPanel(!1));
		});
	};
	#n = (e) => {
		let t = e.target, n = this.panels.findIndex((e) => e.$button != null && e.$button.contains(t));
		if (n < 0) return;
		this.current = n;
		let r = () => {
			this.current = this.current - 1 < 0 ? this.panels.length - 1 : this.current - 1, this.panels[this.current]?.focus(), e.preventDefault();
		}, i = () => {
			this.current = this.current + 1 > this.panels.length - 1 ? 0 : this.current + 1, this.panels[this.current]?.focus(), e.preventDefault();
		};
		({
			ArrowUp: r,
			ArrowDown: i,
			ArrowLeft: r,
			ArrowRight: i,
			Home: () => {
				this.current = 0, this.panels[0]?.focus(), e.preventDefault();
			},
			End: () => {
				this.current = this.panels.length - 1, this.panels[this.current]?.focus(), e.preventDefault();
			}
		})[e.key]?.();
	};
};
customElements.get("cinq-accordion") || customElements.define("cinq-accordion", d);
//#endregion
export { d as Accordion, l as Panel };
