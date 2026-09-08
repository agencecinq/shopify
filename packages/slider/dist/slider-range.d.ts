import { SliderBase } from './slider-base.js';
import { SetValuesOptions } from './types.js';
/**
 * Two-thumb range slider (WAI-ARIA multi-thumb pattern).
 *
 * Horizontal (default) or vertical via `aria-orientation` on a thumb.
 * Horizontal axis mirrors for RTL. Vertical ignores RTL on the axis.
 *
 * APG DOM order: first thumb = max handle, second = min handle.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 * @see https://github.com/19h47/19h47-slider
 */
export declare class SliderRange extends SliderBase {
    #private;
    /** First `[role="slider"]` in DOM (max handle). */
    $max: HTMLElement | null;
    /** Second `[role="slider"]` in DOM (min handle). */
    $min: HTMLElement | null;
    /** Global lower bound from `$max` `aria-valuemin`. */
    get boundsMin(): number;
    /** Global upper bound from `$max` `aria-valuemax`. */
    get boundsMax(): number;
    /** Current min thumb value (`aria-valuenow` on `$min`). */
    get min(): number;
    /** Current max thumb value (`aria-valuenow` on `$max`). */
    get max(): number;
    /** `aria-orientation` on `$max` (`null` if unset). */
    get orientation(): string | null;
    /** Bind thumbs, read bounds and options, initial sync. */
    init(): void;
    /** Unbind thumbs, disconnect observers, clear drag state. */
    destroy(): void;
    protected syncValuetext(): void;
    /** Re-read thumbs from markup, sync CSS vars and ARIA (no event). */
    protected sync(): void;
    /**
     * Clamp both endpoints to bounds and step, enforce anti-crossing for
     * `active`, sync, dispatch `slider:change` unless `emit: false`.
     */
    setValues(minimum: number, maximum: number, options?: SetValuesOptions): void;
    protected onThumbFocus(event: FocusEvent): void;
    protected valueFromPointer(event: PointerEvent, $thumb: HTMLElement): number;
    protected commitPointerValue(event: PointerEvent, $thumb: HTMLElement): void;
    protected onKeydown(event: KeyboardEvent): void;
}
//# sourceMappingURL=slider-range.d.ts.map