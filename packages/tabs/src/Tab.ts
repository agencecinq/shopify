import dispatchEvent from './utils/dispatchEvent';
import { EVENTS } from './utils/events';

export default class Tab {
	el: HTMLElement;
	active: boolean = false;
	id: string = '';
	index: number;
	controls: string;

	constructor(el: HTMLElement, index: number) {
		this.el = el;
		this.index = index;
		this.id = el.id;

		this.controls = el.getAttribute('aria-controls')?.trim().split(' ')[0] || '';

		const selected = el.getAttribute('aria-selected');
		this.active = selected === 'true';
	}

	init = () => this.initEvents();

	initEvents = () => this.el.addEventListener('click', this.handleClick);

	/**
	 * Handle click
	 */
	handleClick = () => this.toggle();

	/**
	 * Toggle
	 *
	 * @param {boolean} focus
	 */
	toggle(focus: boolean = true): void {
		if (this.active) {
			return;
		}

		const beforeActivate = new CustomEvent(EVENTS.BEFORE_ACTIVATE, {
			bubbles: true,
			cancelable: true,
			detail: { index: this.index, controls: this.controls, element: this.el },
		});
		this.el.dispatchEvent(beforeActivate);
		if (beforeActivate.defaultPrevented) return;

		dispatchEvent(this.el, { controls: this.controls, element: this.el }, EVENTS.ACTIVATE);
		this.activate(focus);
	}

	/**
	 * Activate tab
	 *
	 * @param {boolean} focus
	 * @return void
	 */
	activate(focus: boolean = true): void {
		// console.info('Tab.activate');

		this.active = true;
		this.el.setAttribute('tabindex', '0');
		this.el.setAttribute('aria-selected', 'true');

		this.el.classList.add('is-active');

		if (focus) {
			this.focus();
		}
	}

	/**
	 * Deactivate tab
	 *
	 * @return void
	 */
	deactivate(): void {
		// console.info('Tab.deactivate');

		this.active = false;
		this.el.setAttribute('tabindex', '-1');
		this.el.setAttribute('aria-selected', 'false');

		this.el.classList.remove('is-active');
	}

	/**
	 * Focus tab
	 *
	 * @return void
	 */
	focus = () => this.el.focus();

	/**
	 * Delete tab
	 *
	 * @return void
	 */
	delete = () => {
		dispatchEvent(this.el, { controls: this.controls, element: this.el }, EVENTS.DELETE);
		this.el.parentElement?.removeChild(this.el);
	}

	destroy(): void {
		this.el.removeAttribute('tabindex');
		this.el.removeAttribute('aria-selected');
		this.el.classList.remove('is-active');

		this.el.removeEventListener('click', this.handleClick);
	}
}
