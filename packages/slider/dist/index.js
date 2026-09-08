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
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, r = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, i = document.documentElement, { body: a } = document;
i.hasAttribute("data-debug"), window.addEventListener("pointermove", r(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var o = (e, t, n) => Math.min(Math.max(e, t), n), s = (e, t, n) => {
	let r = n - t;
	return r > 0 ? (e - t) / r : 0;
}, c = (e, t, n) => t + e * (n - t), l = (e, t, n, r) => o(r <= 0 ? e : t + Math.round((e - t) / r) * r, t, n), u = (e, t) => Math.max(0, e - t), d = (e, t) => Math.max(0, e - 2 * t), f = (e, t, n, r) => r || n ? e === "min" ? t : 0 : e === "max" ? t : 0, p = (e, t, n, r, i) => {
	let a = i ? t.height : t.width, s = i ? t.top : t.left, c = u(a, n);
	if (c <= 0) return 0;
	let l = o((e - s - n / 2) / c, 0, 1);
	return i || r ? 1 - l : l;
}, m = (e, t, n, r, i, a, s, c, l) => {
	let u = f(n, s, c, l), d = o(e - (l ? t.top : t.left) - u, 0, a), p = a > 0 ? d / a : 0, m = i - r;
	return Math.round(l || c ? i - m * p : r + m * p);
}, h = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r = !1) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = r;
	}
	delta(e) {
		let t = this.#e, n = -this.#e, r = this.#t, i = -this.#t;
		if (this.#r) {
			let r = {
				ArrowUp: t,
				ArrowDown: n,
				ArrowRight: t,
				ArrowLeft: n
			};
			if (e in r) return {
				delta: r[e],
				preventDefault: !0
			};
		} else {
			let r = this.#n ? {
				ArrowLeft: t,
				ArrowRight: n,
				ArrowUp: t,
				ArrowDown: n
			} : {
				ArrowRight: t,
				ArrowLeft: n,
				ArrowUp: t,
				ArrowDown: n
			};
			if (e in r) return {
				delta: r[e],
				preventDefault: !0
			};
		}
		return e === "PageUp" ? {
			delta: r,
			preventDefault: !0
		} : e === "PageDown" ? {
			delta: i,
			preventDefault: !0
		} : e === "Home" || e === "End" ? {
			delta: 0,
			preventDefault: !0
		} : null;
	}
	static isHome(e) {
		return e === "Home";
	}
	static isEnd(e) {
		return e === "End";
	}
}, g = class extends HTMLElement {
	static observedAttributes = ["data-step", "data-page"];
	step = 1;
	page = 10;
	#e;
	#t = null;
	#n = null;
	onThumbFocus(e) {}
	get formatValue() {
		return this.#e;
	}
	set formatValue(e) {
		this.#e = e, this.syncValuetext();
	}
	get isRtl() {
		return getComputedStyle(this).direction === "rtl";
	}
	get isVertical() {
		return this.orientation === "vertical";
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	attributeChangedCallback(e, t, r) {
		if (e === "data-step") {
			this.step = n(r, 1);
			return;
		}
		e === "data-page" && (this.page = n(r, 10));
	}
	rect() {
		return this.getBoundingClientRect();
	}
	observeResize() {
		this.#t?.disconnect(), this.#t = new ResizeObserver(() => {
			this.sync();
		}), this.#t.observe(this);
	}
	disconnectResize() {
		this.#t?.disconnect(), this.#t = null;
	}
	setValuetext(e, t) {
		let n = this.formatValue ? this.formatValue(t) : String(t);
		e.setAttribute("aria-valuetext", n);
	}
	bindThumb(e) {
		e.tabIndex < 0 && !e.hasAttribute("tabindex") && (e.tabIndex = 0), e.style.touchAction = "none", e.addEventListener("keydown", this.#r), e.addEventListener("pointerdown", this.#a), e.addEventListener("pointermove", this.#o), e.addEventListener("pointerup", this.#s), e.addEventListener("pointercancel", this.#s), e.addEventListener("lostpointercapture", this.#s), e.addEventListener("focus", this.#i);
	}
	unbindThumb(e) {
		e.removeEventListener("keydown", this.#r), e.removeEventListener("pointerdown", this.#a), e.removeEventListener("pointermove", this.#o), e.removeEventListener("pointerup", this.#s), e.removeEventListener("pointercancel", this.#s), e.removeEventListener("lostpointercapture", this.#s), e.removeEventListener("focus", this.#i), e.style.removeProperty("touch-action");
	}
	clearDragState() {
		this.#n = null, this.removeAttribute("dragging");
	}
	#r = (e) => {
		this.onKeydown(e);
	};
	#i = (e) => {
		this.onThumbFocus(e);
	};
	#a = (e) => {
		let t = e.currentTarget, { button: n, clientY: r, clientX: i, pointerId: a } = e;
		if (n !== 0) return;
		t.focus({ preventScroll: !0 }), e.preventDefault();
		let { top: o, left: s, width: c, height: l } = t.getBoundingClientRect(), u = s + c / 2 - i;
		this.isVertical && (u = o + l / 2 - r), this.#n = {
			id: a,
			offset: u,
			$thumb: t
		}, this.setAttribute("dragging", ""), t.setPointerCapture(a), this.commitPointerValue(e, t);
	};
	#o = (e) => {
		if (!this.#n) return;
		let { id: t, $thumb: n } = this.#n, { pointerId: r } = e;
		r === t && (this.commitPointerValue(e, n), e.preventDefault());
	};
	#s = (e) => {
		if (!this.#n) return;
		let { id: t, $thumb: n } = this.#n, { pointerId: r } = e;
		r === t && (this.#n = null, this.removeAttribute("dragging"), n.hasPointerCapture?.(t) && n.releasePointerCapture(t));
	};
	get offset() {
		return this.#n?.offset ?? 0;
	}
}, _ = class extends g {
	$thumb = null;
	get orientation() {
		return this.$thumb?.getAttribute("aria-orientation") ?? null;
	}
	get min() {
		return n(this.$thumb?.getAttribute("aria-valuemin"), 0);
	}
	get max() {
		return n(this.$thumb?.getAttribute("aria-valuemax"), 100);
	}
	get value() {
		return n(this.$thumb?.getAttribute("aria-valuenow"), this.min);
	}
	get ratio() {
		return s(this.value, this.min, this.max);
	}
	init() {
		let e = this.querySelectorAll("[role=\"slider\"]");
		if (e.length !== 1) throw Error("cinq-slider: exactly one [role=\"slider\"] thumb is required");
		this.$thumb = e[0], this.step = n(this.getAttribute("data-step"), 1), this.page = n(this.getAttribute("data-page"), 10), this.bindThumb(this.$thumb), this.observeResize(), this.sync();
	}
	destroy() {
		this.$thumb && this.unbindThumb(this.$thumb), this.disconnectResize(), this.clearDragState(), this.$thumb = null;
	}
	syncValuetext() {
		this.$thumb && this.setValuetext(this.$thumb, this.value);
	}
	sync() {
		this.#e(this.value, !1);
	}
	setValue(e, t = {}) {
		let { emit: n = !0 } = t, r = l(e, this.min, this.max, this.step);
		this.#e(r, n);
	}
	valueFromPointer(e, t) {
		let { clientY: n, clientX: r } = e, i = this.getBoundingClientRect(), { min: a, max: o } = this, { offsetHeight: s, offsetWidth: l } = t, u = this.isVertical, d = p((u ? n : r) + this.offset, i, u ? s : l, this.isRtl, u);
		return Math.round(c(d, a, o));
	}
	commitPointerValue(e, t) {
		this.setValue(this.valueFromPointer(e, t));
	}
	onKeydown(e) {
		if (!this.$thumb) return;
		let { key: t } = e;
		if (h.isHome(t)) {
			e.preventDefault(), this.setValue(this.min);
			return;
		}
		if (h.isEnd(t)) {
			e.preventDefault(), this.setValue(this.max);
			return;
		}
		let n = new h(this.step, this.page, this.isRtl, this.isVertical).delta(t);
		if (!n) return;
		let { preventDefault: r, delta: i } = n;
		r && e.preventDefault(), i !== 0 && this.setValue(this.value + i);
	}
	#e(n, r) {
		if (!this.$thumb) return;
		let { min: i, max: a } = this, o = s(n, i, a);
		this.$thumb.setAttribute("aria-valuenow", String(n)), this.setValuetext(this.$thumb, n), this.style.setProperty("--value", String(n)), this.style.setProperty("--ratio", String(o)), r && t(this, e.SLIDER_CHANGE, {
			min: n,
			max: n,
			$thumb: this.$thumb
		}, { cancelable: !1 });
	}
};
customElements.get("cinq-slider") || customElements.define("cinq-slider", _);
//#endregion
//#region src/slider-range.ts
var v = class extends g {
	$max = null;
	$min = null;
	#e = "min";
	#t = 0;
	#n = 100;
	get boundsMin() {
		return this.#t;
	}
	get boundsMax() {
		return this.#n;
	}
	get min() {
		return n(this.$min?.getAttribute("aria-valuenow"), this.#t);
	}
	get max() {
		return n(this.$max?.getAttribute("aria-valuenow"), this.#n);
	}
	get orientation() {
		return this.$max?.getAttribute("aria-orientation") ?? null;
	}
	init() {
		let e = [...this.querySelectorAll("[role=\"slider\"]")];
		if (e.length !== 2) throw Error("cinq-slider-range: exactly two [role=\"slider\"] thumbs are required");
		let [t, r] = e;
		this.$max = t, this.$min = r, this.step = n(this.getAttribute("data-step"), 1), this.page = n(this.getAttribute("data-page"), 10), this.#t = n(this.$max.getAttribute("aria-valuemin"), 0), this.#n = n(this.$max.getAttribute("aria-valuemax"), 100), this.bindThumb(this.$max), this.bindThumb(this.$min), this.observeResize(), this.sync();
	}
	destroy() {
		for (let e of [this.$max, this.$min]) e && this.unbindThumb(e);
		this.disconnectResize(), this.clearDragState(), this.removeAttribute("data-active"), this.removeAttribute("data-collapsed"), this.$max = null, this.$min = null;
	}
	syncValuetext() {
		this.$min && this.setValuetext(this.$min, this.min), this.$max && this.setValuetext(this.$max, this.max);
	}
	sync() {
		this.#a(this.min, this.max, this.#e, !1);
	}
	setValues(e, t, n = {}) {
		let { active: r = this.#e, emit: i = !0 } = n;
		this.#a(e, t, r, i);
	}
	onThumbFocus(e) {
		let t = this.#r(e.currentTarget);
		t && (this.#e = t, this.setAttribute("data-active", t));
	}
	valueFromPointer(e, t) {
		let { clientY: n, clientX: r } = e, { offsetHeight: i, offsetWidth: a } = t, o = t === this.$min ? "min" : "max", s = this.isVertical ? i : a;
		return m(this.isVertical ? n + this.offset : r + this.offset, this.getBoundingClientRect(), o, this.#t, this.#n, this.#i(s), s, this.isRtl, this.isVertical);
	}
	commitPointerValue(e, t) {
		let n = this.valueFromPointer(e, t);
		if ((t === this.$min ? "min" : "max") == "min") {
			this.setValues(n, this.max, { active: "min" });
			return;
		}
		this.setValues(this.min, n, { active: "max" });
	}
	onKeydown(e) {
		let t = this.#r(e.currentTarget);
		if (!t) return;
		this.#e = t;
		let { key: n } = e, r = t === "min" ? this.min : this.max;
		if (h.isHome(n)) {
			e.preventDefault();
			let n = t === "min" ? this.#t : this.min;
			t === "min" ? this.setValues(n, this.max, { active: "min" }) : this.setValues(this.min, n, { active: "max" });
			return;
		}
		if (h.isEnd(n)) {
			e.preventDefault();
			let n = t === "max" ? this.#n : this.max;
			t === "min" ? this.setValues(n, this.max, { active: "min" }) : this.setValues(this.min, n, { active: "max" });
			return;
		}
		let i = new h(this.step, this.page, this.isRtl, this.isVertical).delta(n);
		if (!i) return;
		let { delta: a } = i;
		if (a !== 0) {
			if (e.preventDefault(), t === "min") {
				this.setValues(r + a, this.max, { active: "min" });
				return;
			}
			this.setValues(this.min, r + a, { active: "max" });
		}
	}
	#r(e) {
		return e === this.$min ? "min" : e === this.$max ? "max" : null;
	}
	#i(e) {
		return d(this.isVertical ? this.clientHeight : this.clientWidth, e);
	}
	#a(n, r, i, a) {
		if (!this.$min || !this.$max) return;
		let o = this.#t, c = this.#n, u = l(n, o, c, this.step), d = l(r, o, c, this.step);
		i === "min" ? u = Math.min(u, d) : d = Math.max(d, u), this.#e = i, this.setAttribute("data-active", i), this.$min.setAttribute("aria-valuenow", String(u)), this.$max.setAttribute("aria-valuenow", String(d)), this.$min.setAttribute("aria-valuemax", String(d)), this.$max.setAttribute("aria-valuemin", String(u)), this.setValuetext(this.$min, u), this.setValuetext(this.$max, d);
		let f = s(u, o, c), p = s(d, o, c);
		if (this.style.setProperty("--min", String(u)), this.style.setProperty("--max", String(d)), this.style.setProperty("--min-ratio", String(f)), this.style.setProperty("--max-ratio", String(p)), u === d ? this.setAttribute("data-collapsed", "") : this.removeAttribute("data-collapsed"), a) {
			let n = i === "min" ? this.$min : this.$max;
			t(this, e.SLIDER_CHANGE, {
				min: u,
				max: d,
				$thumb: n
			}, { cancelable: !1 });
		}
	}
};
customElements.get("cinq-slider-range") || customElements.define("cinq-slider-range", v);
//#endregion
export { _ as Slider, v as SliderRange };
