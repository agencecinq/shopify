import { EVENTS as e, clamp as t, dispatchEvent as n, parseNumber as r, throttle as i } from "@agencecinq/utils";
//#region src/spinbutton.ts
var a = {
	step: 1,
	delay: 100
}, o = class extends HTMLElement {
	$input = null;
	$increase = null;
	$decrease = null;
	$live = null;
	options = { ...a };
	value = {
		min: !1,
		max: !1,
		now: 0
	};
	#e;
	#t = () => {};
	get formatValue() {
		return this.#e;
	}
	set formatValue(e) {
		if (this.#e = e, !this.$input || !e) return;
		let t = e(this.value.now);
		this.$input.setAttribute("aria-valuetext", t), this.$live && (this.$live.textContent = t);
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null, this.$increase = null, this.$decrease = null, this.$live = null;
	}
	init() {
		if (this.$input = this.querySelector("input"), !this.$input) throw Error("Spinbutton must have an input element");
		this.$increase = this.querySelector("button[name=\"increase\"]"), this.$decrease = this.querySelector("button[name=\"decrease\"]"), this.$live = this.querySelector("[aria-live]"), this.options.step = r(this.getAttribute("data-step"), a.step), this.options.delay = r(this.getAttribute("data-delay"), a.delay);
		let t = this.$input.getAttribute("aria-valuemin"), o = this.$input.getAttribute("aria-valuemax"), s = r(this.$input.getAttribute("aria-valuenow"), 0);
		this.value = {
			min: t !== null && r(t, 0),
			max: o !== null && r(o, 0),
			now: s
		}, this.$input.addEventListener("keydown", this.#r), this.$input.addEventListener("change", this.#n), this.$increase?.addEventListener("click", this.increase), this.$decrease?.addEventListener("click", this.decrease), this.#t = i(() => {
			n(this, e.SPINBUTTON_CHANGE, { value: this.value.now });
		}, this.options.delay);
	}
	#n = ({ target: e }) => {
		if (!(e instanceof HTMLInputElement)) return;
		let { value: t } = e;
		this.setValue(r(t, this.value.now));
	};
	#r = (e) => {
		let { step: t } = this.options, n = {
			ArrowUp: () => this.setValue(this.value.now + t),
			ArrowDown: () => this.setValue(this.value.now - t),
			PageUp: () => this.setValue(this.value.now + t * 5),
			PageDown: () => this.setValue(this.value.now - t * 5),
			Home: () => this.value.min !== !1 && this.setValue(this.value.min),
			End: () => this.value.max !== !1 && this.setValue(this.value.max)
		}[e.key];
		n && (e.preventDefault(), n());
	};
	decrease = () => {
		this.setValue(this.value.now - this.options.step);
	};
	increase = () => {
		this.setValue(this.value.now + this.options.step);
	};
	setMin(e, t = !0) {
		this.value.min = e, this.$input?.setAttribute("aria-valuemin", e.toString()), this.setValue(this.value.now, t);
	}
	setMax(e, t = !0) {
		this.value.max = e, this.$input?.setAttribute("aria-valuemax", e.toString()), this.setValue(this.value.now, t);
	}
	setValue(e, n = !0) {
		if (!this.$input) return;
		let r = this.value.min === !1 ? -(2 ** 53 - 1) : this.value.min, i = this.value.max === !1 ? 2 ** 53 - 1 : this.value.max;
		if (e < r || e > i ? this.$input.setAttribute("aria-invalid", "true") : this.$input.removeAttribute("aria-invalid"), this.value.now = t(e, r, i), this.$increase?.toggleAttribute("disabled", this.value.max !== !1 && this.value.now === this.value.max), this.$decrease?.toggleAttribute("disabled", this.value.min !== !1 && this.value.min === this.value.now), this.$input.setAttribute("aria-valuenow", this.value.now.toString()), this.$input.value = this.value.now.toString(), this.$input.setAttribute("value", this.value.now.toString()), this.#e) {
			let e = this.#e(this.value.now);
			this.$input.setAttribute("aria-valuetext", e), this.$live && (this.$live.textContent = e);
		}
		n && this.#t();
	}
	destroy() {
		this.$input?.removeEventListener("keydown", this.#r), this.$input?.removeEventListener("change", this.#n), this.$increase?.removeEventListener("click", this.increase), this.$decrease?.removeEventListener("click", this.decrease), this.#t = () => {};
	}
};
customElements.get("cinq-spinbutton") || customElements.define("cinq-spinbutton", o);
//#endregion
export { o as Spinbutton };
