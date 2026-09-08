import { EVENTS as e, dispatchEvent as t, getFocusableElements as n } from "@agencecinq/utils";
//#region src/modal.ts
var r = class extends HTMLElement {
	trigger = null;
	$modal = null;
	#e = (e) => {
		e.target === e.currentTarget && this.close();
	};
	#t = (e) => {
		e.preventDefault(), this.close();
	};
	#n = (e) => {
		let { modal: t, trigger: n } = e.detail;
		if (t === this.id) {
			if (this.hasAttribute("open")) {
				this.close();
				return;
			}
			n && (this.trigger = n), this.show();
		}
	};
	constructor() {
		super();
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$modal = null;
	}
	init() {
		if (this.$modal = this.querySelector("[data-dialog]") || this.querySelector("dialog"), !this.$modal) throw Error("Modal: No dialog found");
		if (!this.id) throw Error("Modal: id attribute is required");
		this.$modal.addEventListener("click", this.#e), this.$modal.addEventListener("cancel", this.#t), document.documentElement.addEventListener(e.MODAL_TOGGLE, this.#n);
	}
	destroy() {
		this.$modal && (this.$modal.removeEventListener("click", this.#e), this.$modal.removeEventListener("cancel", this.#t), this.hasAttribute("open") && this.$modal.open && this.$modal.close()), document.documentElement.removeEventListener(e.MODAL_TOGGLE, this.#n);
	}
	show() {
		if (this.hasAttribute("open")) return !1;
		let n = () => this.setAttribute("open", "");
		return t(document.documentElement, e.MODAL_BEFORE_OPEN, {
			modal: this.id,
			instance: this,
			trigger: this.trigger,
			resolve: n
		}, { bubbles: !1 }) ? (n(), !0) : this.hasAttribute("open");
	}
	close() {
		if (!this.hasAttribute("open")) return !1;
		let n = () => this.removeAttribute("open");
		return t(document.documentElement, e.MODAL_BEFORE_CLOSE, {
			modal: this.id,
			instance: this,
			resolve: n
		}, { bubbles: !1 }) ? (n(), !0) : !this.hasAttribute("open");
	}
	attributeChangedCallback(r, i, a) {
		if (!(!this.isConnected || r !== "open")) {
			if (a !== null) {
				if (this.$modal && !this.$modal.open) {
					this.$modal.showModal(), t(document.documentElement, e.MODAL_OPEN, {
						modal: this.id,
						trigger: this.trigger
					}, {
						bubbles: !1,
						cancelable: !1
					});
					let r = n(this.$modal);
					r.length > 0 && r[0].focus();
				}
				return;
			}
			this.$modal?.open && this.$modal.close(), t(document.documentElement, e.MODAL_CLOSE, { modal: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
};
customElements.get("cinq-modal") || customElements.define("cinq-modal", r);
//#endregion
//#region src/modal-button.ts
var i = class extends HTMLElement {
	$button = null;
	controls = [];
	#e = (e) => {
		this.$button && this.controls.includes(e.detail.modal) && this.$button.setAttribute("aria-pressed", "false");
	};
	#t = (e) => {
		this.$button && this.controls.includes(e.detail.modal) && this.$button.setAttribute("aria-pressed", "true");
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.controls = [];
	}
	init() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("ModalButton: No button found");
		this.controls = (this.$button.ariaControlsElements ?? []).map((e) => e.id), this.$button.addEventListener("click", this.show), document.documentElement.addEventListener(e.MODAL_CLOSE, this.#e), document.documentElement.addEventListener(e.MODAL_OPEN, this.#t);
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.show), document.documentElement.removeEventListener(e.MODAL_CLOSE, this.#e), document.documentElement.removeEventListener(e.MODAL_OPEN, this.#t);
	}
	show = () => {
		this.$button && this.controls.forEach((n) => {
			let r = this.$button?.getAttribute("data-trap"), i = {
				trigger: this.$button,
				trap: r ? document.getElementById(r) : null,
				modal: n
			};
			t(document.documentElement, e.MODAL_TOGGLE, i, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", i);
//#endregion
export { r as Modal, i as ModalButton };
