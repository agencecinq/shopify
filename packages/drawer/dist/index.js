const r = {
  DRAWER_CLOSE: "drawer-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_TOGGLE: "drawer-toggle"
}, E = (t, e) => {
  let n = null, i = null;
  const l = () => {
    i && t(...i), n = null;
  };
  return (...d) => {
    i = d, n || (n = setTimeout(l, e));
  };
}, s = document.documentElement, { body: c } = document;
s.hasAttribute("data-debug");
const o = {
  y: 0,
  x: 0
};
window.addEventListener(
  "pointermove",
  E(({ x: t, y: e }) => {
  }, 100),
  { passive: !0 }
);
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
const u = (t, e) => {
  typeof t < "u" && (o.x = t), typeof e < "u" && (o.y = e), window.scrollTo(o.x, o.y);
};
function p() {
  const t = s.scrollLeft, e = s.scrollTop, n = c.scrollLeft, i = c.scrollTop;
  o.x = window.scrollX || t || n, o.y = window.scrollY || e || i || 0, s.style.setProperty("overflow", "hidden"), s.style.setProperty("height", "100%"), s.style.setProperty("scroll-padding-top", "0px"), u(o.x, o.y);
}
function y(t = 0) {
  let e = !0, n = o.y;
  typeof t == "number" ? n = t : typeof t == "boolean" && t === !1 && (e = !1), s.style.removeProperty("overflow"), s.style.removeProperty("height"), s.style.removeProperty("scroll-padding-top"), e && u(o.x, n);
}
const a = {};
function b(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function h(t) {
  if (!t) return [];
  const e = [
    "summary",
    "a[href]",
    "button:enabled",
    '[tabindex]:not([tabindex^="-"])',
    "input:not([type=hidden]):enabled",
    "select:enabled",
    "textarea:enabled",
    "object",
    "iframe",
    "[contenteditable]"
  ].join(",");
  return Array.from(t.querySelectorAll(e)).filter((n) => b(n) && n.getAttribute("tabindex") !== "-1");
}
function w(t, e = t) {
  const n = h(t);
  if (n.length === 0) return;
  const i = n[0], l = n[n.length - 1];
  m(), a.keydown = (d) => {
    d.key === "Tab" && (d.shiftKey ? (document.activeElement === i || document.activeElement === t) && (d.preventDefault(), l.focus()) : document.activeElement === l && (d.preventDefault(), i.focus()));
  }, document.addEventListener("keydown", a.keydown), e.focus(), e instanceof HTMLInputElement && ["search", "text", "email", "url"].includes(e.type) && e.value && e.setSelectionRange(0, e.value.length);
}
function m(t = null) {
  a.keydown && document.removeEventListener("keydown", a.keydown), t && t.focus();
}
const f = 27, g = {
  ESCAPE: f
};
class v extends HTMLElement {
  trigger = null;
  trap = null;
  constructor() {
    super(), this.trap = this;
  }
  get cid() {
    return this.getAttribute("cid") || this.id;
  }
  static get observedAttributes() {
    return ["open"];
  }
  connectedCallback() {
    const e = this.querySelector('[data-dom="overlay"]') || this.querySelector("[overlay]");
    e && e.addEventListener("click", this.handleClick), document.documentElement.addEventListener("keyup", this.handleKeyUp), document.documentElement.addEventListener(r.DRAWER_OPEN, this.handleDrawerOpen), document.documentElement.addEventListener(r.DRAWER_TOGGLE, this.handleDrawerToggle);
  }
  /**
   * Handles the click event by toggling the drawer.
   */
  handleClick = () => this.toggle({ trigger: null, trap: null });
  /**
   * Handles the key up event for the drawer component.
   */
  handleKeyUp = (e) => {
    (e.which || e.keyCode) === g.ESCAPE && this.hasAttribute("open") && this.removeAttribute("open");
  };
  /**
   * Handles the opening of the drawer when a custom event is triggered.
   */
  handleDrawerOpen = (e) => {
    e.detail.drawer !== this.cid && this.hasAttribute("open") && (this.trigger = e.detail.trigger, this.removeAttribute("open")), e.detail.drawer === this.cid && !this.hasAttribute("open") && (this.trigger = e.detail.trigger, this.setAttribute("open", ""));
  };
  handleDrawerToggle = (e) => {
    const { trigger: n, trap: i, drawer: l } = e.detail;
    l === this.cid && this.toggle({ trigger: n, trap: i });
  };
  /**
     * Toggles the state of the drawer between open and closed.
     *
     * @param trigger - The HTML element that triggered the toggle action, or null.
     * @param trap - The HTML element that will be used as a focus trap when the drawer is open, or null. Will default to the drawer itself.
     *
     * @returns boolean - The new state of the drawer (open or closed).
     */
  toggle({ trigger: e, trap: n }) {
    return e && (this.trigger = e), this.trap = n || this, this.toggleAttribute("open");
  }
  /**
   * Opens the drawer component.
   */
  open() {
    this.style.setProperty("opacity", "1"), this.style.setProperty("visibility", "visible"), document.documentElement.dispatchEvent(new CustomEvent(r.DRAWER_OPEN, {
      detail: { drawer: this.cid }
    })), this.addEventListener(
      "transitionend",
      () => {
        const e = h(this.trap);
        e.length > 0 && w(this.trap, e[0]), p();
      },
      { once: !0 }
    );
  }
  /**
   * Closes the drawer component.
   */
  close() {
    m(this.trigger), this.addEventListener(
      "transitionend",
      () => {
        this.hasAttribute("open") || (this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden"), document.documentElement.dispatchEvent(new CustomEvent(r.DRAWER_CLOSE, {
          detail: { drawer: this.cid }
        })), y(!1));
      },
      { once: !0 }
    );
  }
  disconnectedCallback() {
    const e = this.querySelector('[data-dom="overlay"]') || this.querySelector("[overlay]");
    e && e.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener("keyup", this.handleKeyUp), document.documentElement.removeEventListener(r.DRAWER_OPEN, this.handleDrawerOpen);
  }
  attributeChangedCallback(e, n, i) {
    e === "open" && (i !== null ? this.open() : this.close());
  }
}
customElements.get("cinq-drawer") || customElements.define("cinq-drawer", v);
class A extends HTMLElement {
  controls = [];
  $button = null;
  handleDrawerClose = (e) => {
    this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "false");
  };
  handleDrawerOpen = (e) => {
    this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "true");
  };
  connectedCallback() {
    if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button)
      throw new Error("DrawerButton: button element not found");
    this.controls = this.$button.getAttribute("aria-controls")?.trim().split(" ") || [], this.$button.addEventListener("click", this.handleClick), document.documentElement.addEventListener(r.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.addEventListener(r.DRAWER_OPEN, this.handleDrawerOpen);
  }
  handleClick = () => {
    this.$button.setAttribute(
      "aria-expanded",
      this.$button.getAttribute("aria-expanded") === "true" ? "false" : "true"
    ), this.controls.forEach((e) => {
      const n = {
        trigger: this.$button,
        trap: document.getElementById(`${this.$button?.getAttribute("data-trap")}`),
        drawer: e
      };
      document.documentElement.dispatchEvent(new CustomEvent(r.DRAWER_TOGGLE, { detail: n }));
    });
  };
  disconnectedCallback() {
    this.$button.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener(r.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.removeEventListener(r.DRAWER_OPEN, this.handleDrawerOpen);
  }
}
customElements.get("cinq-drawer-button") || customElements.define("cinq-drawer-button", A);
export {
  v as Drawer,
  A as DrawerButton
};
