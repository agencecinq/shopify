const n = {
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle"
}, s = (o, t) => {
  let e = null, l = null;
  const i = () => {
    l && o(...l), e = null;
  };
  return (...d) => {
    l = d, e || (e = setTimeout(i, t));
  };
}, a = document.documentElement;
a.hasAttribute("data-debug");
window.addEventListener(
  "pointermove",
  s(({ x: o, y: t }) => {
  }, 100),
  { passive: !0 }
);
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
class c extends HTMLElement {
  $modal = null;
  handleClick = (t) => {
    t.target === t.currentTarget && this.close();
  };
  handleModalToggle = (t) => {
    const { modal: e } = t.detail;
    e === this.id && (this.$modal?.open ? this.close() : this.show());
  };
  constructor() {
    super();
  }
  connectedCallback() {
    if (this.$modal = this.querySelector("[data-dialog]") || this.querySelector("dialog"), !this.$modal)
      throw new Error("Modal: No dialog found");
    this.$modal.addEventListener("click", this.handleClick), document.documentElement.addEventListener(n.MODAL_TOGGLE, this.handleModalToggle);
  }
  disconnectedCallback() {
    this.$modal && this.$modal.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener(n.MODAL_TOGGLE, this.handleModalToggle), this.$modal = null;
  }
  close = () => {
    this.$modal && (this.$modal.close(), document.documentElement.dispatchEvent(new CustomEvent(n.MODAL_CLOSE)));
  };
  show = () => {
    this.$modal && (this.$modal.showModal(), document.documentElement.dispatchEvent(
      new CustomEvent(n.MODAL_OPEN, {
        detail: { modal: this.id }
      })
    ));
  };
}
customElements.get("cinq-modal") || customElements.define("cinq-modal", c);
class m extends HTMLElement {
  $button = null;
  controls = [];
  handleModalClose = () => this.$button?.setAttribute("aria-pressed", "false");
  handleModalOpen = (t) => {
    const { modal: e } = t.detail;
    this.$button && this.controls.includes(e) && this.$button.setAttribute("aria-pressed", "true");
  };
  connectedCallback() {
    if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button)
      throw new Error("ModalButton: No button found");
    this.controls = this.$button.getAttribute("aria-controls")?.trim().split(" ") || [], this.$button.addEventListener("click", this.show), document.documentElement.addEventListener(n.MODAL_CLOSE, this.handleModalClose), document.documentElement.addEventListener(n.MODAL_OPEN, this.handleModalOpen);
  }
  disconnectedCallback() {
    this.$button && this.$button.removeEventListener("click", this.show), document.documentElement.removeEventListener(n.MODAL_CLOSE, this.handleModalClose), document.documentElement.removeEventListener(n.MODAL_OPEN, this.handleModalOpen), this.$button = null, this.controls = [];
  }
  show = () => {
    this.$button && (this.$button.setAttribute("aria-pressed", "true"), this.controls.forEach((t) => {
      const e = {
        trigger: this.$button,
        trap: document.getElementById(`${this.$button?.getAttribute("data-trap")}`),
        modal: t
      };
      document.documentElement.dispatchEvent(new CustomEvent(n.MODAL_TOGGLE, { detail: e }));
    }));
  };
}
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", m);
export {
  c as Modal,
  m as ModalButton
};
