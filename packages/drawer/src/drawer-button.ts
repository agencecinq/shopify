import { EVENTS } from '@agencecinq/utils';

export class DrawerButton extends HTMLElement {
  controls: string[] = [];
  $button: HTMLButtonElement | null = null;

  private handleDrawerClose = (event: CustomEvent<{ drawer: string }>) => {
    // console.log(event.detail.drawer, this.controls);
    if (this.$button && this.controls.includes(event.detail.drawer)) {
      this.$button.setAttribute('aria-expanded', 'false');
    }
  }

  private handleDrawerOpen = (event: CustomEvent<{ drawer: string }>) => {
    if (this.$button && this.controls.includes(event.detail.drawer)) {
      this.$button.setAttribute('aria-expanded', 'true');
    }
  }

  connectedCallback() {
    this.$button = this.querySelector('[data-button]') || this.querySelector('button');

    if (!this.$button) {
      throw new Error('DrawerButton: button element not found');
    }

    // Aria-controls can be a space-separated list of element IDs that the
    // button controls, See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-controls
    this.controls = this.$button.getAttribute('aria-controls')?.trim().split(' ') || [];

    this.$button.addEventListener('click', this.handleClick);
    document.documentElement.addEventListener(EVENTS.DRAWER_CLOSE, this.handleDrawerClose as EventListener);
    document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, this.handleDrawerOpen as EventListener);
  }


  handleClick = () => {
    this.$button!.setAttribute(
      'aria-expanded',
      this.$button!.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
    );

    this.controls.forEach((control) => {
      const detail = {
        trigger: this.$button,
        trap: document.getElementById(`${this.$button?.getAttribute('data-trap')}`),
        drawer: control
      };

      document.documentElement.dispatchEvent(new CustomEvent(EVENTS.DRAWER_TOGGLE, { detail }));
    });
  }

  disconnectedCallback() {
    this.$button!.removeEventListener('click', this.handleClick);
    document.documentElement.removeEventListener(EVENTS.DRAWER_CLOSE, this.handleDrawerClose as EventListener);
    document.documentElement.removeEventListener(EVENTS.DRAWER_OPEN, this.handleDrawerOpen as EventListener);
  }
}

if (!customElements.get('cinq-drawer-button')) {
  customElements.define('cinq-drawer-button', DrawerButton);
}
