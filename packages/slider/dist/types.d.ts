export type FormatValue = (value: number) => string;
/** Which range thumb is active (`data-active` on the host). */
export type ActiveThumb = "min" | "max";
/** Unified `slider:change` detail for `<cinq-slider>` and `<cinq-slider-range>`. */
export interface SliderChangeDetail {
    /** Current low end of the selection (single: equals `max`). */
    min: number;
    /** Current high end of the selection (single: equals `min`). */
    max: number;
    /** Thumb that moved or has focus (always set). */
    $thumb: HTMLElement;
}
/** @deprecated Use `SliderChangeDetail`. */
export type Detail = SliderChangeDetail;
export interface SetValueOptions {
    /** Dispatch `slider:change` after sync (default `true`). */
    emit?: boolean;
}
export interface SetValuesOptions {
    /** Thumb that drives anti-crossing clamp (default: last active). */
    active?: ActiveThumb;
    /** Dispatch `slider:change` after sync (default `true`). */
    emit?: boolean;
}
//# sourceMappingURL=types.d.ts.map