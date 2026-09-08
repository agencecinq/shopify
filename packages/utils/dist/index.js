//#region src/events.ts
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
}, n = (e) => e ? e.trim().split(/\s+/).filter(Boolean) : [], r = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, i = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", a = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, o = document.documentElement, { body: s } = document, c = o.hasAttribute("data-debug"), l = {
	y: 0,
	x: 0
}, u = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", a(({ x: e, y: t }) => {
	u.x = e, u.y = t;
}, 100), { passive: !0 });
var d = {
	lg: window.matchMedia("(width >= 64rem)"),
	xl: window.matchMedia("(min-width: 1280px)"),
	"2xl": window.matchMedia("(min-width: 1440px)"),
	"3xl": window.matchMedia("(min-width: 1920px)")
}, f = !0, p = (e, t) => {
	e !== void 0 && (l.x = e), t !== void 0 && (l.y = t), window.scrollTo(l.x, l.y);
};
function m() {
	let e = o.scrollLeft, t = o.scrollTop, n = s.scrollLeft, r = s.scrollTop;
	l.x = window.scrollX || e || n, l.y = window.scrollY || t || r || 0, o.style.setProperty("overflow", "hidden"), o.style.setProperty("height", "100%"), o.style.setProperty("scroll-padding-top", "0px"), p(l.x, l.y);
}
function h(e = 0) {
	let t = !0, n = l.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1), o.style.removeProperty("overflow"), o.style.removeProperty("height"), o.style.removeProperty("scroll-padding-top"), t && p(l.x, n);
}
//#endregion
//#region src/focus.ts
var g = {}, _ = null;
function v(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function y(e) {
	if (!e) return [];
	let t = [
		"summary",
		"a[href]",
		"button:enabled",
		"[tabindex]:not([tabindex^=\"-\"])",
		"input:not([type=hidden]):enabled",
		"select:enabled",
		"textarea:enabled",
		"object",
		"iframe",
		"[contenteditable]"
	].join(",");
	return Array.from(e.querySelectorAll(t)).filter((e) => v(e) && e.getAttribute("tabindex") !== "-1");
}
function b(e) {
	if (_) return;
	let t = e ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
	!t || t === document.body || !t.isConnected || (_ = t);
}
function x() {
	_?.focus(), _ = null;
}
function S(e) {
	queueMicrotask(() => {
		let t = document.activeElement;
		t instanceof HTMLElement && t !== document.body && !e?.contains(t) || x();
	});
}
function C(e, t = e) {
	let n = y(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	b(), w(), g.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", g.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function w(e = null) {
	g.keydown && document.removeEventListener("keydown", g.keydown), e && e.focus();
}
//#endregion
//#region src/clamp.ts
var T = (e, t, n) => Math.min(Math.max(e, t), n);
//#endregion
export { e as EVENTS, C as addTrapFocus, s as body, d as breakpoints, T as clamp, m as disableScroll, t as dispatchEvent, h as enableScroll, y as getFocusableElements, o as html, c as isDebug, u as mouse, i as parseBoolean, n as parseList, r as parseNumber, f as production, b as rememberReturnFocus, w as removeTrapFocus, x as restoreReturnFocus, S as scheduleRestoreReturnFocus, l as scroll, a as throttle };
