import { 
  EVENTS, 
  disableScroll, 
  enableScroll, 
  addTrapFocus, 
  removeTrapFocus,
  getFocusableElements,
  keycode
} from '@agencecinq/utils';

export class Drawer extends HTMLElement {
  trigger: HTMLElement | null = null;
  trap: HTMLElement | null = null;

  constructor() {
    super();
    this.trap = this;
  }

  get cid(): string | null {
    return this.getAttribute('cid') || this.id;
  }

  static get observedAttributes() {
    return ['open'];
  }

  connectedCallback(): void {
    const $overlay = this.querySelector('[data-dom="overlay"]') || this.querySelector('[overlay]');
    if ($overlay) {
      $overlay.addEventListener('click', this.handleClick);
    }

    document.documentElement.addEventListener('keyup', this.handleKeyUp);
    document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, this.handleDrawerOpen as EventListener);
    document.documentElement.addEventListener(EVENTS.DRAWER_TOGGLE, this.handleDrawerToggle as EventListener);
  }

  /**
   * Handles the click event by toggling the drawer.
   */
  handleClick = (): boolean => {
    return this.toggle({ trigger: null, trap: null });
  };

  /**
   * Handles the key up event for the drawer component.
   */
  handleKeyUp = (event: KeyboardEvent): void => {
    const key = event.which || event.keyCode;

    if (key === keycode.ESCAPE && this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
  };

  /**
   * Handles the opening of the drawer when a custom event is triggered.
   */
  handleDrawerOpen = (event: CustomEvent): void => {
    
    if (event.detail.drawer !== this.cid && this.hasAttribute('open')) {
      this.trigger = event.detail.trigger;
      this.removeAttribute('open');
    }

    if (event.detail.drawer === this.cid && !this.hasAttribute('open')) {
      this.trigger = event.detail.trigger;
      this.setAttribute('open', '');
    }
  };


  handleDrawerToggle = (event: CustomEvent): void => {
    const { trigger, trap, drawer } = event.detail
    
    if (drawer !== this.cid) {
      return;
    }

    this.toggle({ trigger, trap });
  };

/**
   * Toggles the state of the drawer between open and closed.
   *
   * @param trigger - The HTML element that triggered the toggle action, or null.
   * @param trap - The HTML element that will be used as a focus trap when the drawer is open, or null. Will default to the drawer itself.
   *
   * @returns boolean - The new state of the drawer (open or closed).
   */
  toggle({ trigger, trap }: { trigger: HTMLElement | null; trap: HTMLElement | null }): boolean {
    if (trigger) {
      this.trigger = trigger;
    }

    this.trap = trap || this;

    return this.toggleAttribute('open');
  }

  /**
   * Opens the drawer component.
   */
  open(): void {
    this.style.setProperty('opacity', '1');
    this.style.setProperty('visibility', 'visible');

    // Équivalent de this.emit
    document.documentElement.dispatchEvent(new CustomEvent(EVENTS.DRAWER_OPEN, {
      detail: { drawer: this.cid }
    }));

    this.addEventListener(
      'transitionend',
      () => {
        const focusElement = getFocusableElements(this.trap as HTMLElement);
        if (focusElement.length > 0) {
          addTrapFocus(this.trap as HTMLElement, focusElement[0] as HTMLElement);
        }

        disableScroll();
      },
      { once: true },
    );
  }

  /**
   * Closes the drawer component.
   */
  close(): void {
    removeTrapFocus(this.trigger);

    this.addEventListener(
      'transitionend',
      () => {
        if (!this.hasAttribute('open')) {
          this.style.setProperty('opacity', '0');
          this.style.setProperty('visibility', 'hidden');
          
          document.documentElement.dispatchEvent(new CustomEvent(EVENTS.DRAWER_CLOSE, {
            detail: { drawer: this.cid }
          }));
          
          enableScroll(false);
        }
      },
      { once: true },
    );
  }

  disconnectedCallback(): void {
    const $overlay = this.querySelector('[data-dom="overlay"]') || this.querySelector('[overlay]');
    
    if ($overlay) {
      $overlay.removeEventListener('click', this.handleClick);
    }

    document.documentElement.removeEventListener('keyup', this.handleKeyUp);
    document.documentElement.removeEventListener(EVENTS.DRAWER_OPEN, this.handleDrawerOpen as EventListener);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'open') {
      if (newValue !== null) {
        this.open();
      } else {
        this.close();
      }
    }
  }
}

if (!customElements.get('cinq-drawer')) {
  customElements.define('cinq-drawer', Drawer);
}