export default class Tab {
    el: HTMLElement;
    active: boolean;
    id: string;
    index: number;
    controls: string;
    constructor(el: HTMLElement, index: number);
    init: () => void;
    initEvents: () => void;
    /**
     * Handle click
     */
    handleClick: () => void;
    /**
     * Toggle
     *
     * @param {boolean} focus
     */
    toggle(focus?: boolean): void;
    /**
     * Activate tab
     *
     * @param {boolean} focus
     * @return void
     */
    activate(focus?: boolean): void;
    /**
     * Deactivate tab
     *
     * @return void
     */
    deactivate(): void;
    /**
     * Focus tab
     *
     * @return void
     */
    focus: () => void;
    /**
     * Delete tab
     *
     * @return void
     */
    delete: () => void;
    destroy(): void;
}
//# sourceMappingURL=Tab.d.ts.map