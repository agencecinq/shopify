import { FormatValue } from './types.js';
/**
 * Shared slider host: lifecycle, `data-step` / `data-page`, pointer capture,
 * resize sync, and thumb event wiring.
 *
 * Subclasses implement value mapping (`valueFromPointer`, `commitPointerValue`)
 * and keyboard handling. Orientation comes from thumb `aria-orientation`.
 */
export declare abstract class SliderBase extends HTMLElement {
    #private;
    static observedAttributes: string[];
    step: number;
    page: number;
    protected abstract syncValuetext(): void;
    /** Sync CSS custom properties from current ARIA values (no event). */
    protected abstract sync(): void;
    /** Raw value from pointer position before step snapping. */
    protected abstract valueFromPointer(event: PointerEvent, $thumb: HTMLElement): number;
    /** Apply pointer-derived value (called on pointerdown and pointermove). */
    protected abstract commitPointerValue(event: PointerEvent, $thumb: HTMLElement): void;
    protected abstract onKeydown(event: KeyboardEvent): void;
    protected onThumbFocus(_event: FocusEvent): void;
    /** Optional formatter for thumb `aria-valuetext`. */
    get formatValue(): FormatValue | undefined;
    set formatValue(fn: FormatValue | undefined);
    protected get isRtl(): boolean;
    /** `aria-orientation` on the thumb markup (`null` if unset). */
    protected abstract get orientation(): string | null;
    /** `true` when `orientation === "vertical"`. */
    protected get isVertical(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    abstract init(): void;
    abstract destroy(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    /** Host rail bounding rect (same as `getBoundingClientRect()`). */
    rect(): DOMRect;
    protected observeResize(): void;
    protected disconnectResize(): void;
    protected setValuetext($el: HTMLElement, value: number): void;
    protected bindThumb($thumb: HTMLElement): void;
    protected unbindThumb($thumb: HTMLElement): void;
    protected clearDragState(): void;
    /** Pointer-to-thumb-center offset while dragging (`0` when idle). */
    protected get offset(): number;
}
//# sourceMappingURL=slider-base.d.ts.map