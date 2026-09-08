import {
  EVENTS,
  dispatchEvent,
  parseNumber,
} from "@agencecinq/utils";
import {
  ratioFromPointer,
  ratioFromValue,
  snapToStep,
  valueFromRatio,
} from "./geometry.js";
import Keyboard from "./keyboard.js";
import { SliderBase } from "./slider-base.js";
import type { SetValueOptions } from "./types.js";

/**
 * Single-thumb slider (WAI-ARIA slider pattern).
 *
 * Horizontal (default) or vertical via `aria-orientation` on the thumb.
 * Horizontal axis mirrors for RTL (`dir="rtl"` on host or ancestor).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export class Slider extends SliderBase {
  /** Cached `[role="slider"]` thumb. */
  $thumb: HTMLElement | null = null;

  /** `aria-orientation` on `$thumb` (`null` if unset). */
  get orientation(): string | null {
    return this.$thumb?.getAttribute("aria-orientation") ?? null;
  }

  /** Lower bound from `$thumb` `aria-valuemin`. */
  get min(): number {
    return parseNumber(this.$thumb?.getAttribute("aria-valuemin"), 0);
  }

  /** Upper bound from `$thumb` `aria-valuemax`. */
  get max(): number {
    return parseNumber(this.$thumb?.getAttribute("aria-valuemax"), 100);
  }

  /** Current value from `$thumb` `aria-valuenow`. */
  get value(): number {
    return parseNumber(this.$thumb?.getAttribute("aria-valuenow"), this.min);
  }

  /** Semantic position in `[0, 1]` within `min`..`max`. */
  get ratio(): number {
    return ratioFromValue(this.value, this.min, this.max);
  }

  /** Bind thumb, read options, initial sync. */
  init(): void {
    const thumbs = this.querySelectorAll<HTMLElement>('[role="slider"]');

    if (thumbs.length !== 1) {
      throw new Error(
        'cinq-slider: exactly one [role="slider"] thumb is required',
      );
    }

    this.$thumb = thumbs[0]!;
    this.step = parseNumber(this.getAttribute("data-step"), 1);
    this.page = parseNumber(this.getAttribute("data-page"), 10);
    this.bindThumb(this.$thumb);
    this.observeResize();
    this.sync();
  }

  /** Unbind thumb, disconnect observers, clear drag state. */
  destroy(): void {
    if (this.$thumb) {
      this.unbindThumb(this.$thumb);
    }

    this.disconnectResize();
    this.clearDragState();
    this.$thumb = null;
  }

  protected syncValuetext(): void {
    if (this.$thumb) {
      this.setValuetext(this.$thumb, this.value);
    }
  }

  /** Re-read thumb from markup, sync CSS vars and ARIA (no event). */
  protected sync(): void {
    this.#apply(this.value, false);
  }

  /** Clamp to bounds and step, sync, dispatch `slider:change` unless `emit: false`. */
  setValue(value: number, options: SetValueOptions = {}): void {
    const { emit = true } = options;
    const next = snapToStep(value, this.min, this.max, this.step);
    this.#apply(next, emit);
  }

  protected valueFromPointer(event: PointerEvent, $thumb: HTMLElement): number {
    const { clientY, clientX } = event;
    const rect = this.getBoundingClientRect();
    const { min, max } = this;
    const { offsetHeight, offsetWidth } = $thumb;
    const vertical = this.isVertical;
    const clientCoord = (vertical ? clientY : clientX) + this.offset;
    const thumbSize = vertical ? offsetHeight : offsetWidth;
    const ratio = ratioFromPointer(
      clientCoord,
      rect,
      thumbSize,
      this.isRtl,
      vertical,
    );

    return Math.round(valueFromRatio(ratio, min, max));
  }

  protected commitPointerValue(event: PointerEvent, $thumb: HTMLElement): void {
    this.setValue(this.valueFromPointer(event, $thumb));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.$thumb) {
      return;
    }

    const { key } = event;

    if (Keyboard.isHome(key)) {
      event.preventDefault();
      this.setValue(this.min);
      return;
    }

    if (Keyboard.isEnd(key)) {
      event.preventDefault();
      this.setValue(this.max);
      return;
    }

    const action = new Keyboard(
      this.step,
      this.page,
      this.isRtl,
      this.isVertical,
    ).delta(key);

    if (!action) {
      return;
    }

    const { preventDefault, delta } = action;

    if (preventDefault) {
      event.preventDefault();
    }

    if (delta !== 0) {
      this.setValue(this.value + delta);
    }
  }

  #apply(value: number, emit: boolean): void {
    if (!this.$thumb) {
      return;
    }

    const { min, max } = this;
    const ratio = ratioFromValue(value, min, max);

    this.$thumb.setAttribute("aria-valuenow", String(value));
    this.setValuetext(this.$thumb, value);

    this.style.setProperty("--value", String(value));
    this.style.setProperty("--ratio", String(ratio));

    if (emit) {
      dispatchEvent(
        this,
        EVENTS.SLIDER_CHANGE,
        { min: value, max: value, $thumb: this.$thumb },
        { cancelable: false },
      );
    }
  }
}

if (!customElements.get("cinq-slider")) {
  customElements.define("cinq-slider", Slider);
}
