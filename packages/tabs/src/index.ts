import getHash from "./utils/getHash";
import { hash, delay as defaultDelay } from "./config";
import TabPanel from "./TabPanel";
import Tab from "./Tab";
import { EVENTS } from "./utils/events";

export class Tabs extends HTMLElement {
  $tabList: HTMLElement | null;
  current = 0;
  tabPanels: TabPanel[] = [];
  tabs: Tab[] = [];
  href = "";
  hash = hash;
  delay = defaultDelay;

  constructor() {
    super();
    this.$tabList = null;
  }

  connectedCallback() {
    this.$tabList = this.querySelector(
      '[role="tablist"]',
    ) as HTMLElement | null;

    const hash = this.getAttribute("data-tabs-hash");
    const delayAttr = this.getAttribute("data-tabs-delay");

    this.hash = hash === null ? this.hash : hash !== "false" && hash !== "0";

    if (delayAttr !== null) {
      const parsed = parseInt(delayAttr, 10);
      this.delay = Number.isNaN(parsed) ? 0 : parsed;
    }

    this.href = (this.hash && getHash(window.location.hash)) || "";

    this.init();
  }

  disconnectedCallback() {
    this.destroy();
  }

  init() {
    if (!this.$tabList) {
      return;
    }

    this.tabs = [...this.$tabList.querySelectorAll('[role="tab"]')].map(
      ($element, index) => new Tab($element as HTMLElement, index),
    );

    this.tabs.forEach((tab, index) => {
      this.tabPanels.push(
        new TabPanel(
          this.querySelector(
            `#${tab.controls}[role="tabpanel"]`,
          ) as HTMLElement,
        ),
      );

      tab.init();

      tab.el.addEventListener(EVENTS.ACTIVATE, () => {
        this.current = index;

        this.deactivateTabs();
        this.deactivateTabPanels();

        tab.activate(false);
        this.tabPanels
          .find(tabPanel => tabPanel.id === tab.controls)
          ?.activate();

        if (this.hash) {
          this.href = tab.id;
          window.location.hash = tab.id;
        }
      });
    });

    if (this.href) {
      const hashIndex = this.tabs.findIndex(tab => tab.id === this.href);
      if (hashIndex >= 0) {
        this.current = hashIndex;
      }
    }

    if (!this.href || this.current === 0) {
      const activeIndex = this.tabs.findIndex(tab => tab.active);
      if (activeIndex >= 0) {
        this.current = activeIndex;
      }
    }

    const tab = this.tabs[this.current];

    if (tab) {
      this.deactivateTabs();
      this.deactivateTabPanels();

      tab.activate(false);
      this.tabPanels.find(tabPanel => tabPanel.id === tab.controls)?.activate();
    }

    this.initEvents();
  }

  initEvents() {
    this.$tabList?.addEventListener("keydown", this.handleKeydown);
  }

  private get isRtl(): boolean {
    const el = this.$tabList ?? this;
    return el ? getComputedStyle(el).direction === "rtl" : false;
  }

  handleKeydown = (event: KeyboardEvent) => {
    const { key, code, target } = event;

    const selected = JSON.parse(
      (target as HTMLElement).getAttribute("aria-selected") as string,
    );

    const previous = () => {
      this.current =
        0 > this.current - 1 ? this.tabs.length - 1 : this.current - 1;
      this.tabs[this.current].focus();

      if (this.delay) {
        setTimeout(() => {
          this.tabs[this.current].toggle(false);
        }, this.delay);
      }
    };

    const next = () => {
      this.current =
        this.current + 1 > this.tabs.length - 1 ? 0 : this.current + 1;
      this.tabs[this.current].focus();

      if (this.delay) {
        setTimeout(() => {
          this.tabs[this.current].toggle(false);
        }, this.delay);
      }
    };

    const first = () => {
      event.preventDefault();
      this.current = 0;
      this.tabs[this.current].toggle();
    };

    const last = () => {
      event.preventDefault();
      this.current = this.tabs.length - 1;
      this.tabs[this.current].toggle();
    };

    const rtl = this.isRtl;

    const codes: Record<string, () => void | boolean> = {
      ArrowUp: previous,
      ArrowDown: next,
      ArrowLeft: rtl ? next : previous,
      ArrowRight: rtl ? previous : next,
      End: last,
      Home: first,
      PageUp: first,
      PageDown: last,
      Delete: () => selected && this.delete(event),
      Backspace: () => selected && this.delete(event),
      default: () => false,
    };

    return (codes[key || code] || codes.default)();
  };

  deactivateTabs = () => this.tabs.forEach(tab => tab.deactivate());

  deactivateTabPanels = () =>
    this.tabPanels.forEach(tabPanel => tabPanel.deactivate());

  delete({ target }: KeyboardEvent): boolean {
    if ((target as HTMLElement).getAttribute("data-deletable") === null) {
      return false;
    }

    this.tabs[this.current].delete();
    this.tabPanels[this.current].delete();

    this.tabs.splice(this.current, 1);
    this.tabPanels.splice(this.current, 1);

    this.current = 0 > this.current - 1 ? 0 : this.current - 1;
    this.tabs[this.current].toggle();

    return true;
  }

  destroy(): void {
    this.$tabList?.removeEventListener("keydown", this.handleKeydown);
    this.tabs.forEach(tab => tab.destroy());
    this.tabPanels.forEach(tabPanel => tabPanel.destroy());
    this.tabs = [];
    this.tabPanels = [];
  }
}

if (!customElements.get("cinq-tabs")) {
  customElements.define("cinq-tabs", Tabs);
}
