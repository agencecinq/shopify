import { EVENTS } from '@agencecinq/utils';

export class ModalButton extends HTMLElement {
    private $button: HTMLButtonElement | null = null;
    controls: string[] = [];
    private handleModalClose = () => this.$button?.setAttribute('aria-pressed', 'false');
    private handleModalOpen = (event: CustomEvent) => {
        const { modal } = event.detail;

        if (this.$button && this.controls.includes(modal)) {
            this.$button.setAttribute('aria-pressed', 'true');
        }
    };

    connectedCallback() {
        this.$button = this.querySelector('[data-button]') || this.querySelector('button');

        if (!this.$button) {
            throw new Error('ModalButton: No button found');
        }

        this.controls = this.$button.getAttribute('aria-controls')?.trim().split(' ') || [];

        this.$button.addEventListener('click', this.show);
        document.documentElement.addEventListener(EVENTS.MODAL_CLOSE, this.handleModalClose as EventListener);
        document.documentElement.addEventListener(EVENTS.MODAL_OPEN, this.handleModalOpen as EventListener);
    }

    disconnectedCallback() {
        if (this.$button) {
            this.$button.removeEventListener('click', this.show);
        }
        document.documentElement.removeEventListener(EVENTS.MODAL_CLOSE, this.handleModalClose as EventListener);
        document.documentElement.removeEventListener(EVENTS.MODAL_OPEN, this.handleModalOpen as EventListener);
        this.$button = null;
        this.controls = [];
    }

    show = () => {
        if (!this.$button) return;

        this.$button.setAttribute('aria-pressed', 'true');

        this.controls.forEach((control) => {
            const detail = {
                trigger: this.$button,
                trap: document.getElementById(`${this.$button?.getAttribute('data-trap')}`),
                modal: control
            };

            document.documentElement.dispatchEvent(new CustomEvent(EVENTS.MODAL_TOGGLE, { detail }));
        });
    };
}

if (!customElements.get('cinq-modal-button')) {
    customElements.define('cinq-modal-button', ModalButton);
}