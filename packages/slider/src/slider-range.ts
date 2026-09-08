import {
  EVENTS,
  dispatchEvent,
  parseNumber,
} from "@agencecinq/utils";
import {
  multiTrackLength,
  multiValueFromPointer,
  ratioFromValue,
  snapToStep,
} from "./geometry.js";
import Keyboard from "./keyboard.js";
import { SliderBase } from "./slider-base.js";
import type { ActiveThumb, SetValuesOptions } from "./types.js";

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
export class SliderRange extends SliderBase {
  /** First `[role="slider"]` in DOM (max handle). */
  $max: HTMLElement | null = null;

  /** Second `[role="slider"]` in DOM (min handle). */
  $min: HTMLElement | null = null;

  #active: ActiveThumb = "min";
  #boundsMin = 0;
  #boundsMax = 100;

  /** Global lower bound from `$max` `aria-valuemin`. */
  get boundsMin(): number {
    return this.#boundsMin;
  }

  /** Global upper bound from `$max` `aria-valuemax`. */
  get boundsMax(): number {
    return this.#boundsMax;
  }

  /** Current min thumb value (`aria-valuenow` on `$min`). */
  get min(): number {
    return parseNumber(
      this.$min?.getAttribute("aria-valuenow"),
      this.#boundsMin,
    );
  }

  /** Current max thumb value (`aria-valuenow` on `$max`). */
  get max(): number {
    return parseNumber(
      this.$max?.getAttribute("aria-valuenow"),
      this.#boundsMax,
    );
  }

  /** `aria-orientation` on `$max` (`null` if unset). */
  get orientation(): string | null {
    return this.$max?.getAttribute("aria-orientation") ?? null;
  }

  /** Bind thumbs, read bounds and options, initial sync. */
  init(): void {
    const thumbs = [...this.querySelectorAll<HTMLElement>('[role="slider"]')];

    if (thumbs.length !== 2) {
      throw new Error(
        'cinq-slider-range: exactly two [role="slider"] thumbs are required',
      );
    }

    const [$max, $min] = thumbs;

    this.$max = $max!;
    this.$min = $min!;

    this.step = parseNumber(this.getAttribute("data-step"), 1);
    this.page = parseNumber(this.getAttribute("data-page"), 10);

    this.#boundsMin = parseNumber(
      this.$max.getAttribute("aria-valuemin"),
      0,
    );
    this.#boundsMax = parseNumber(
      this.$max.getAttribute("aria-valuemax"),
      100,
    );

    this.bindThumb(this.$max);
    this.bindThumb(this.$min);
    this.observeResize();
    this.sync();
  }

  /** Unbind thumbs, disconnect observers, clear drag state. */
  destroy(): void {
    for (const $thumb of [this.$max, this.$min]) {
      if ($thumb) {
        this.unbindThumb($thumb);
      }
    }

    this.disconnectResize();
    this.clearDragState();
    this.removeAttribute("data-active");
    this.removeAttribute("data-collapsed");
    this.$max = null;
    this.$min = null;
  }

  protected syncValuetext(): void {
    if (this.$min) {
      this.setValuetext(this.$min, this.min);
    }

    if (this.$max) {
      this.setValuetext(this.$max, this.max);
    }
  }

  /** Re-read thumbs from markup, sync CSS vars and ARIA (no event). */
  protected sync(): void {
    this.#apply(this.min, this.max, this.#active, false);
  }

  /**
   * Clamp both endpoints to bounds and step, enforce anti-crossing for
   * `active`, sync, dispatch `slider:change` unless `emit: false`.
   */
  setValues(
    minimum: number,
    maximum: number,
    options: SetValuesOptions = {},
  ): void {
    const { active = this.#active, emit = true } = options;
    this.#apply(minimum, maximum, active, emit);
  }

  protected onThumbFocus(event: FocusEvent): void {
    const active = this.#activeFromTarget(event.currentTarget);

    if (active) {
      this.#active = active;
      this.setAttribute("data-active", active);
    }
  }

  protected valueFromPointer(event: PointerEvent, $thumb: HTMLElement): number {
    const { clientY, clientX } = event;
    const { offsetHeight, offsetWidth } = $thumb;
    const which = $thumb === this.$min ? "min" : "max";
    const thumbSize = this.isVertical ? offsetHeight : offsetWidth;
    const clientCoord = this.isVertical
      ? clientY + this.offset
      : clientX + this.offset;

    return multiValueFromPointer(
      clientCoord,
      this.getBoundingClientRect(),
      which,
      this.#boundsMin,
      this.#boundsMax,
      this.#trackLength(thumbSize),
      thumbSize,
      this.isRtl,
      this.isVertical,
    );
  }

  protected commitPointerValue(event: PointerEvent, $thumb: HTMLElement): void {
    const next = this.valueFromPointer(event, $thumb);
    const active = $thumb === this.$min ? "min" : "max";

    if (active === "min") {
      this.setValues(next, this.max, { active: "min" });
      return;
    }

    this.setValues(this.min, next, { active: "max" });
  }

  protected onKeydown(event: KeyboardEvent): void {
    const active = this.#activeFromTarget(event.currentTarget);

    if (!active) {
      return;
    }

    this.#active = active;

    const { key } = event;
    const current = active === "min" ? this.min : this.max;

    if (Keyboard.isHome(key)) {
      event.preventDefault();
      const next = active === "min" ? this.#boundsMin : this.min;

      if (active === "min") {
        this.setValues(next, this.max, { active: "min" });
      } else {
        this.setValues(this.min, next, { active: "max" });
      }

      return;
    }

    if (Keyboard.isEnd(key)) {
      event.preventDefault();
      const next = active === "max" ? this.#boundsMax : this.max;

      if (active === "min") {
        this.setValues(next, this.max, { active: "min" });
      } else {
        this.setValues(this.min, next, { active: "max" });
      }

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

    const { delta } = action;

    if (delta === 0) {
      return;
    }

    event.preventDefault();

    if (active === "min") {
      this.setValues(current + delta, this.max, { active: "min" });
      return;
    }

    this.setValues(this.min, current + delta, { active: "max" });
  }

  #activeFromTarget(target: EventTarget | null): ActiveThumb | null {
    if (target === this.$min) {
      return "min";
    }

    if (target === this.$max) {
      return "max";
    }

    return null;
  }

  #trackLength(thumbSize: number): number {
    const railLength = this.isVertical ? this.clientHeight : this.clientWidth;
    return multiTrackLength(railLength, thumbSize);
  }

  #apply(
    minimum: number,
    maximum: number,
    active: ActiveThumb,
    emit: boolean,
  ): void {
    if (!this.$min || !this.$max) {
      return;
    }

    const gmin = this.#boundsMin;
    const gmax = this.#boundsMax;

    let min = snapToStep(minimum, gmin, gmax, this.step);
    let max = snapToStep(maximum, gmin, gmax, this.step);

    if (active === "min") {
      min = Math.min(min, max);
    } else {
      max = Math.max(max, min);
    }

    this.#active = active;
    this.setAttribute("data-active", active);

    this.$min.setAttribute("aria-valuenow", String(min));
    this.$max.setAttribute("aria-valuenow", String(max));
    this.$min.setAttribute("aria-valuemax", String(max));
    this.$max.setAttribute("aria-valuemin", String(min));
    this.setValuetext(this.$min, min);
    this.setValuetext(this.$max, max);

    const minRatio = ratioFromValue(min, gmin, gmax);
    const maxRatio = ratioFromValue(max, gmin, gmax);

    this.style.setProperty("--min", String(min));
    this.style.setProperty("--max", String(max));
    this.style.setProperty("--min-ratio", String(minRatio));
    this.style.setProperty("--max-ratio", String(maxRatio));

    if (min === max) {
      this.setAttribute("data-collapsed", "");
    } else {
      this.removeAttribute("data-collapsed");
    }

    if (emit) {
      const $thumb = active === "min" ? this.$min : this.$max;

      dispatchEvent(
        this,
        EVENTS.SLIDER_CHANGE,
        { min, max, $thumb },
        { cancelable: false },
      );
    }
  }
}

if (!customElements.get("cinq-slider-range")) {
  customElements.define("cinq-slider-range", SliderRange);
}
