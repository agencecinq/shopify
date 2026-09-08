import { SliderBase } from './slider-base.js';
import { SetValueOptions } from './types.js';
/**
 * Single-thumb slider (WAI-ARIA slider pattern).
 *
 * Horizontal (default) or vertical via `aria-orientation` on the thumb.
 * Horizontal axis mirrors for RTL (`dir="rtl"` on host or ancestor).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export declare class Slider extends SliderBase {
    #private;
    /** Cached `[role="slider"]` thumb. */
    $thumb: HTMLElement | null;
    /** `aria-orientation` on `$thumb` (`null` if unset). */
    get orientation(): string | null;
    /** Lower bound from `$thumb` `aria-valuemin`. */
    get min(): number;
    /** Upper bound from `$thumb` `aria-valuemax`. */
    get max(): number;
    /** Current value from `$thumb` `aria-valuenow`. */
    get value(): number;
    /** Semantic position in `[0, 1]` within `min`..`max`. */
    get ratio(): number;
    /** Bind thumb, read options, initial sync. */
    init(): void;
    /** Unbind thumb, disconnect observers, clear drag state. */
    destroy(): void;
    protected syncValuetext(): void;
    /** Re-read thumb from markup, sync CSS vars and ARIA (no event). */
    protected sync(): void;
    /** Clamp to bounds and step, sync, dispatch `slider:change` unless `emit: false`. */
    setValue(value: number, options?: SetValueOptions): void;
    protected valueFromPointer(event: PointerEvent, $thumb: HTMLElement): number;
    protected commitPointerValue(event: PointerEvent, $thumb: HTMLElement): void;
    protected onKeydown(event: KeyboardEvent): void;
}
//# sourceMappingURL=slider.d.ts.map