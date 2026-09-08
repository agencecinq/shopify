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
}, r = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", i = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, a = document.documentElement, { body: o } = document;
a.hasAttribute("data-debug"), window.addEventListener("pointermove", i(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/utils.ts
function s(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function c(e) {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function l(e, t, n) {
	return e <= n && e >= t;
}
function u(e, t) {
	return 32 - new Date(e, t, 32).getDate();
}
function d(e, t, n = 0) {
	return (new Date(t, e).getDay() - n + 7) % 7;
}
function f(e) {
	let t = new Intl.Locale(e).getWeekInfo?.();
	return t ? t.firstDay === 7 ? 0 : t.firstDay : 0;
}
function p(e, t = "short") {
	return Array.from({ length: 7 }, (n, r) => new Date(2020, 0, 5 + r).toLocaleDateString(e, { weekday: t }));
}
function m(e, t) {
	return new Date(2020, t, 1).toLocaleDateString(e, { month: "long" });
}
//#endregion
//#region src/keyboard.ts
var h = class {
	host;
	constructor(e) {
		this.host = e;
	}
	setFocusDay(e, { focus: t = !0 } = {}) {
		this.host.$body?.querySelectorAll(".js-day").forEach((e) => {
			e.tabIndex = -1;
		}), e.tabIndex = 0, this.host.current.day = e.getAttribute("data-day"), t && e.focus(), this.host.current.day && this.host.previewRange(this.host.current.day);
	}
	dayInView() {
		let { current: e } = this.host, t = e.day ? c(e.day).getDate() : 1, n = u(e.year, e.month);
		return s(new Date(e.year, e.month, Math.min(t, n)));
	}
	focusDayByOffset(e, t) {
		let n = c(e);
		n.setDate(n.getDate() + t);
		let r = s(n);
		this.host.current.day = r, this.host.current.year = n.getFullYear(), this.host.current.month = n.getMonth();
		let i = this.host.$body?.querySelector(`[data-day="${r}"]`);
		if (i) {
			this.setFocusDay(i);
			return;
		}
		this.host.render({ focus: !0 });
	}
	sync({ focus: e = !1 } = {}) {
		if (!this.host.$body) return;
		let t = Array.from(this.host.$body.querySelectorAll(".js-day"));
		if (!t.length) return;
		let n = (e) => t.find((t) => t.getAttribute("data-day") === e), r = this.host.current.day && (n(this.host.current.day) || n(this.dayInView())) || t.find((e) => this.host.picked.includes(e.getAttribute("data-day") || "")) || n(this.host.day) || t[0];
		this.setFocusDay(r, { focus: e });
	}
	attach() {
		this.host.$body?.addEventListener("keydown", this.#e, !1);
	}
	detach() {
		this.host.$body?.removeEventListener("keydown", this.#e, !1);
	}
	#e = (e) => {
		let t = e.target.closest(".js-day");
		if (!t) return;
		let n = t.getAttribute("data-day"), r = (c(n).getDay() - this.host.options.firstDay + 7) % 7, { key: i, code: a } = e, o = () => {
			t.getAttribute("aria-disabled") !== "true" && (e.preventDefault(), t.click());
		}, s = {
			ArrowLeft: () => {
				e.preventDefault(), this.focusDayByOffset(n, -1);
			},
			ArrowRight: () => {
				e.preventDefault(), this.focusDayByOffset(n, 1);
			},
			ArrowUp: () => {
				e.preventDefault(), this.focusDayByOffset(n, -7);
			},
			ArrowDown: () => {
				e.preventDefault(), this.focusDayByOffset(n, 7);
			},
			Home: () => {
				e.preventDefault(), this.focusDayByOffset(n, -r);
			},
			End: () => {
				e.preventDefault(), this.focusDayByOffset(n, 6 - r);
			},
			PageUp: () => {
				e.preventDefault(), this.host.move(e.shiftKey ? -12 : -1);
			},
			PageDown: () => {
				e.preventDefault(), this.host.move(e.shiftKey ? 12 : 1);
			},
			Enter: o,
			" ": o,
			default: () => !1
		};
		return (s[i || a] || s.default)();
	};
}, g = {
	active: "active",
	range: "range",
	start: "start",
	end: "end"
}, _ = [
	"single",
	"range",
	"multiple"
], v = (e) => {
	let t = e.getAttribute("mode");
	return t && _.includes(t) ? t : "single";
}, y = (e, t, n, { disabled: r, selected: i, current: a, tabIndex: o }) => `
	<button
		type="button"
		class="js-day${n ? ` ${n}` : ""}"
		data-day="${e}"
		tabindex="${o}"
		${r ? "aria-disabled=\"true\"" : ""}
		${i ? "aria-selected=\"true\"" : ""}
		${a ? "aria-current=\"date\"" : ""}
	>
		${t}
	</button>
`, b = class extends HTMLElement {
	today = /* @__PURE__ */ new Date();
	day = "";
	options = {
		mode: "single",
		firstDay: 0,
		stateClasses: { ...g },
		locale: "en",
		buttonClass: "",
		deselect: !1,
		allowPast: !1
	};
	current = {
		month: 0,
		year: 0,
		day: null
	};
	#e = null;
	$body = null;
	$title = null;
	$next = null;
	$previous = null;
	picked = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.#e = null, this.$body = null, this.$title = null, this.$next = null, this.$previous = null;
	}
	#t() {
		let e = this.getAttribute("locale") || this.getAttribute("data-locale") || document.documentElement.getAttribute("lang") || "en", t = this.getAttribute("first-day");
		return {
			mode: v(this),
			firstDay: t != null && t !== "" ? n(t, f(e)) : f(e),
			stateClasses: { ...g },
			locale: e,
			buttonClass: this.getAttribute("button-class") || "",
			deselect: r(this.getAttribute("deselect"), !1),
			allowPast: r(this.getAttribute("allow-past"), !1),
			name: this.getAttribute("name") || void 0
		};
	}
	init() {
		let e = /* @__PURE__ */ new Date();
		if (this.today = new Date(e.getFullYear(), e.getMonth(), e.getDate()), this.day = s(this.today), this.options = this.#t(), this.current = {
			month: n(this.getAttribute("data-month"), this.today.getMonth()),
			year: n(this.getAttribute("data-year"), this.today.getFullYear()),
			day: null
		}, this.$title = this.querySelector(".js-title"), this.$body = this.querySelector(".js-body"), this.$next = this.querySelector(".js-next"), this.$previous = this.querySelector(".js-previous"), !this.$body) throw Error("Calendar: .js-body element not found");
		this.#e = new h(this), this.picked = JSON.parse(this.getAttribute("data-picked") || "[]"), this.render(), this.addEventListener("click", this.#n), this.#e.attach(), this.options.mode === "range" && this.$body.addEventListener("mousemove", this.#r, !1);
	}
	destroy() {
		this.removeEventListener("click", this.#n), this.#e && (this.#e.detach(), this.$body?.removeEventListener("mousemove", this.#r, !1)), this.reset(), this.#i = () => {};
	}
	move(e, { focus: t = !0 } = {}) {
		let { year: n, month: r } = this.current, i = new Date(n, r + e, 1);
		this.current.year = i.getFullYear(), this.current.month = i.getMonth(), this.render({ focus: t });
	}
	setPicked(e, t = !0) {
		this.picked = e, this.setAttribute("data-picked", JSON.stringify(this.picked)), t && this.#i();
	}
	setDaySelected(e, t) {
		return t ? (e.classList.add(this.options.stateClasses.active), e.setAttribute("aria-selected", "true")) : (e.classList.remove(this.options.stateClasses.active), e.removeAttribute("aria-selected"));
	}
	#n = (e) => {
		let { target: t } = e;
		if (!(t instanceof HTMLElement)) return;
		if (t.closest(".js-next") || t.closest(".js-title")) return this.move(1, { focus: !1 });
		if (t.closest(".js-previous")) return this.move(-1, { focus: !1 });
		let n = t.closest(".js-day");
		if (!n || n.getAttribute("aria-disabled") === "true") return;
		let r = n.getAttribute("data-day");
		if (this.#e?.setFocusDay(n, { focus: !1 }), this.options.mode === "multiple") {
			let e = this.picked.indexOf(r);
			return e >= 0 ? (this.picked.splice(e, 1), this.setDaySelected(n, !1)) : (this.picked.push(r), this.picked.sort(), this.setDaySelected(n, !0)), this.setPicked(this.picked);
		}
		return this.options.mode === "single" ? n.classList.contains(this.options.stateClasses.active) && this.options.deselect ? (this.picked = [], this.setDaySelected(n, !1), this.setPicked(this.picked)) : (this.picked.forEach((e) => {
			let t = this.$body?.querySelector(`[data-day="${e}"]`);
			t && this.setDaySelected(t, !1);
		}), this.picked = [r], this.setDaySelected(n, !0), this.setPicked(this.picked)) : (1 < this.picked.length && (this.$body?.querySelectorAll(".js-day").forEach((e) => {
			e.classList.remove(this.options.stateClasses.range), this.setDaySelected(e, !1);
		}), this.picked = []), this.picked.push(r), this.picked.sort(), this.setDaySelected(n, !0), this.setPicked(this.picked));
	};
	previewRange(e) {
		if (this.options.mode !== "range" || this.picked.length !== 1 || !this.$body) return;
		let t = this.$body.querySelector(`[data-day="${e}"]`);
		if (!t || t.getAttribute("aria-disabled") === "true") return;
		let n = this.$body.querySelectorAll(".js-day"), r = this.$body.querySelector(`[data-day="${this.picked[0]}"]`), i = !1, a = this.picked[0], o = e;
		a > o && (i = !0, o = this.picked[0], a = e), n.forEach((e) => {
			let t = e.getAttribute("data-day");
			e.classList.remove(this.options.stateClasses.range, this.options.stateClasses.end, this.options.stateClasses.start), l(t, a, o) && e.classList.add(this.options.stateClasses.range);
		}), r?.classList.add(this.options.stateClasses.start), t.classList.add(this.options.stateClasses.end), i && (r?.classList.add(this.options.stateClasses.end), r?.classList.remove(this.options.stateClasses.start), t.classList.add(this.options.stateClasses.start), t.classList.remove(this.options.stateClasses.end));
	}
	#r = (e) => {
		let t = e.target.closest(".js-day");
		if (!t) return;
		let n = t.getAttribute("data-day");
		n && this.previewRange(n);
	};
	getMonthName(e) {
		return this.options.months?.[e] ?? m(this.options.locale, e);
	}
	getWeekdays() {
		return this.options.days ?? p(this.options.locale, "short");
	}
	renderDays() {
		let e = this.querySelector(".js-days");
		if (!e) return;
		let t = this.getWeekdays(), n = p(this.options.locale, "long");
		e.innerHTML = "";
		for (let r = 0; r < 7; r += 1) {
			let i = (this.options.firstDay + r) % 7, a = document.createElement("th");
			a.scope = "col", a.abbr = n[i], a.textContent = t[i], e.appendChild(a);
		}
	}
	renderHeader(e, t) {
		this.$title && (this.$title.textContent = new Date(t, e, 1).toLocaleDateString(this.options.locale, {
			month: "long",
			year: "numeric"
		})), this.$previous?.setAttribute("data-content", this.getMonthName(0 > e - 1 ? 11 : e - 1)), this.$next?.setAttribute("data-content", this.getMonthName(11 < e + 1 ? 0 : e + 1));
	}
	renderCalendar(e, t, { focus: n = !1 } = {}) {
		if (!this.$body) return;
		let r = this.options.buttonClass ?? "", i = 1;
		for (let n = 0; 6 >= n; n += 1) {
			let a = document.createElement("tr");
			for (let o = this.options.firstDay; o < 7 + this.options.firstDay; o += 1) {
				let c = new Date(t, e, i), f = document.createElement("td"), p = document.createElement("div");
				if (n === 0 && o < this.options.firstDay + d(e, t, this.options.firstDay)) a.appendChild(f);
				else if (i > u(t, e)) break;
				else {
					let e = s(c), t = e === this.day, n = this.options.allowPast || e >= this.day, o = this.picked.includes(e);
					p.innerHTML = y(e, i, r, {
						disabled: !n,
						selected: o,
						current: t,
						tabIndex: -1
					});
					let u = p.querySelector("button");
					o && (u.classList.add(this.options.stateClasses.active), this.options.mode === "range" && (e === this.picked[0] && u.classList.add(this.options.stateClasses.start), this.picked.length > 1 && e === this.picked[this.picked.length - 1] && u.classList.add(this.options.stateClasses.end))), this.options.mode === "range" && this.picked.length === 2 && l(e, this.picked[0], this.picked[1]) && u.classList.add(this.options.stateClasses.range), this.renderInner(p, c), f.appendChild(p), a.appendChild(f), i += 1;
				}
			}
			a.childNodes.length && this.$body.appendChild(a);
		}
		this.#e?.sync({ focus: n });
	}
	reset() {
		this.$body && (this.$body.innerHTML = "");
	}
	render({ focus: e = !1 } = {}) {
		this.reset(), this.renderDays(), this.renderHeader(this.current.month, this.current.year), this.renderCalendar(this.current.month, this.current.year, { focus: e });
	}
	renderInner(e, t) {}
	#i = () => {
		let n = {
			values: this.picked,
			name: this.options.name
		};
		t(this, e.CALENDAR_CHANGE, n, { cancelable: !1 });
	};
};
customElements.get("cinq-calendar") || customElements.define("cinq-calendar", b);
//#endregion
export { b as Calendar, c as fromDayString, f as getWeekStart, s as toDayString };
