import { EVENTS as e, addTrapFocus as t, disableScroll as n, dispatchEvent as r, enableScroll as i, getFocusableElements as a, rememberReturnFocus as o, removeTrapFocus as s, scheduleRestoreReturnFocus as c } from "@agencecinq/utils";
//#region src/drawer.ts
var l = class extends HTMLElement {
	trigger = null;
	trap = null;
	$overlay = null;
	$panel = null;
	constructor() {
		super(), this.trap = this;
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (!this.id) throw Error("Drawer: id attribute is required");
		if (this.$panel = this.querySelector("[role=\"dialog\"]"), !this.$panel) throw Error("Drawer: No [role=\"dialog\"] panel found");
		this.$overlay = this.querySelector("[data-dom=\"overlay\"]") || this.querySelector("[overlay]"), this.$overlay && this.$overlay.addEventListener("click", this.#e), document.documentElement.addEventListener("keyup", this.#t), document.documentElement.addEventListener(e.DRAWER_OPEN, this.#n), document.documentElement.addEventListener(e.DRAWER_TOGGLE, this.#r);
	}
	destroy() {
		this.$panel?.removeEventListener("transitionend", this.#i), this.$overlay && this.$overlay.removeEventListener("click", this.#e), document.documentElement.removeEventListener("keyup", this.#t), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.#n), document.documentElement.removeEventListener(e.DRAWER_TOGGLE, this.#r), this.hasAttribute("open") && (s(), i(!1), this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden"), c(this)), this.$overlay = null, this.$panel = null;
	}
	#e = () => this.toggle({
		trigger: null,
		trap: null
	});
	#t = (e) => {
		e.key === "Escape" && this.hasAttribute("open") && this.close();
	};
	#n = (e) => {
		if (e.detail.drawer !== this.id && this.hasAttribute("open")) {
			this.close();
			return;
		}
		e.detail.drawer === this.id && !this.hasAttribute("open") && (e.detail.trigger && (this.trigger = e.detail.trigger), this.open());
	};
	#r = (e) => {
		let { trigger: t, trap: n, drawer: r } = e.detail;
		r === this.id && this.toggle({
			trigger: t,
			trap: n
		});
	};
	toggle({ trigger: e, trap: t }) {
		let n = !this.hasAttribute("open");
		return n && e && (this.trigger = e), this.trap = t || this, n ? this.open() : (this.close(), this.hasAttribute("open"));
	}
	#i = (e) => {
		e.target === e.currentTarget && (this.$panel?.removeEventListener("transitionend", this.#i), !this.hasAttribute("open") && (this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden")));
	};
	open() {
		if (this.hasAttribute("open")) return !1;
		let t = () => this.setAttribute("open", "");
		return r(document.documentElement, e.DRAWER_BEFORE_OPEN, {
			drawer: this.id,
			instance: this,
			trigger: this.trigger,
			resolve: t
		}, { bubbles: !1 }) ? (t(), !0) : this.hasAttribute("open");
	}
	close() {
		if (!this.hasAttribute("open")) return !1;
		let t = () => this.removeAttribute("open");
		return r(document.documentElement, e.DRAWER_BEFORE_CLOSE, {
			drawer: this.id,
			instance: this,
			resolve: t
		}, { bubbles: !1 }) ? (t(), !0) : !this.hasAttribute("open");
	}
	attributeChangedCallback(l, u, d) {
		if (!(!this.isConnected || l !== "open")) {
			if (d !== null) {
				this.$panel?.removeEventListener("transitionend", this.#i), this.style.setProperty("opacity", "1"), this.style.setProperty("visibility", "visible"), o(this.trigger), r(document.documentElement, e.DRAWER_OPEN, {
					drawer: this.id,
					trigger: this.trigger
				}, {
					bubbles: !1,
					cancelable: !1
				});
				let i = this.trap || this, s = a(i);
				s.length > 0 && t(i, s[0]), n();
				return;
			}
			this.$panel?.removeEventListener("transitionend", this.#i), s(), i(!1), c(this), r(document.documentElement, e.DRAWER_CLOSE, { drawer: this.id }, {
				bubbles: !1,
				cancelable: !1
			}), this.$panel?.addEventListener("transitionend", this.#i);
		}
	}
};
customElements.get("cinq-drawer") || customElements.define("cinq-drawer", l);
//#endregion
//#region src/drawer-button.ts
var u = class extends HTMLElement {
	controls = [];
	$button = null;
	#e = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "false");
	};
	#t = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "true");
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.controls = [];
	}
	init() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("DrawerButton: button element not found");
		this.controls = (this.$button.ariaControlsElements ?? []).map((e) => e.id), this.$button.addEventListener("click", this.#n), document.documentElement.addEventListener(e.DRAWER_CLOSE, this.#e), document.documentElement.addEventListener(e.DRAWER_OPEN, this.#t);
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.#n), document.documentElement.removeEventListener(e.DRAWER_CLOSE, this.#e), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.#t);
	}
	#n = () => {
		let t = this.$button?.getAttribute("data-trap");
		this.controls.forEach((n) => {
			let i = {
				trigger: this.$button,
				trap: t ? document.getElementById(t) : null,
				drawer: n
			};
			r(document.documentElement, e.DRAWER_TOGGLE, i, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-drawer-button") || customElements.define("cinq-drawer-button", u);
//#endregion
export { l as Drawer, u as DrawerButton };
