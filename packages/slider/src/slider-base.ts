import { parseNumber } from "@agencecinq/utils";
import type { FormatValue } from "./types.js";

/**
 * Shared slider host: lifecycle, `data-step` / `data-page`, pointer capture,
 * resize sync, and thumb event wiring.
 *
 * Subclasses implement value mapping (`valueFromPointer`, `commitPointerValue`)
 * and keyboard handling. Orientation comes from thumb `aria-orientation`.
 */
export abstract class SliderBase extends HTMLElement {
  static observedAttributes = ["data-step", "data-page"];

  step = 1;
  page = 10;

  #formatValue?: FormatValue;
  #resizeObserver: ResizeObserver | null = null;
  #drag: { id: number; offset: number; $thumb: HTMLElement } | null = null;

  protected abstract syncValuetext(): void;

  /** Sync CSS custom properties from current ARIA values (no event). */
  protected abstract sync(): void;

  /** Raw value from pointer position before step snapping. */
  protected abstract valueFromPointer(
    event: PointerEvent,
    $thumb: HTMLElement,
  ): number;

  /** Apply pointer-derived value (called on pointerdown and pointermove). */
  protected abstract commitPointerValue(
    event: PointerEvent,
    $thumb: HTMLElement,
  ): void;

  protected abstract onKeydown(event: KeyboardEvent): void;

  protected onThumbFocus(_event: FocusEvent): void {
    // Range slider overrides to track the active thumb.
  }

  /** Optional formatter for thumb `aria-valuetext`. */
  get formatValue(): FormatValue | undefined {
    return this.#formatValue;
  }

  set formatValue(fn: FormatValue | undefined) {
    this.#formatValue = fn;
    this.syncValuetext();
  }

  protected get isRtl(): boolean {
    return getComputedStyle(this).direction === "rtl";
  }

  /** `aria-orientation` on the thumb markup (`null` if unset). */
  protected abstract get orientation(): string | null;

  /** `true` when `orientation === "vertical"`. */
  protected get isVertical(): boolean {
    return this.orientation === "vertical";
  }

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  abstract init(): void;

  abstract destroy(): void;

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "data-step") {
      this.step = parseNumber(newValue, 1);
      return;
    }

    if (name === "data-page") {
      this.page = parseNumber(newValue, 10);
    }
  }

  /** Host rail bounding rect (same as `getBoundingClientRect()`). */
  rect(): DOMRect {
    return this.getBoundingClientRect();
  }

  protected observeResize(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = new ResizeObserver(() => {
      this.sync();
    });
    this.#resizeObserver.observe(this);
  }

  protected disconnectResize(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  protected setValuetext($el: HTMLElement, value: number): void {
    const text = this.formatValue
      ? this.formatValue(value)
      : String(value);

    $el.setAttribute("aria-valuetext", text);
  }

  protected bindThumb($thumb: HTMLElement): void {
    if ($thumb.tabIndex < 0 && !$thumb.hasAttribute("tabindex")) {
      $thumb.tabIndex = 0;
    }

    $thumb.style.touchAction = "none";
    $thumb.addEventListener("keydown", this.#handleKeydown);
    $thumb.addEventListener("pointerdown", this.#handlePointerdown);
    $thumb.addEventListener("pointermove", this.#handlePointermove);
    $thumb.addEventListener("pointerup", this.#handlePointerup);
    $thumb.addEventListener("pointercancel", this.#handlePointerup);
    $thumb.addEventListener("lostpointercapture", this.#handlePointerup);

    $thumb.addEventListener("focus", this.#handleThumbFocus);
  }

  protected unbindThumb($thumb: HTMLElement): void {
    $thumb.removeEventListener("keydown", this.#handleKeydown);
    $thumb.removeEventListener("pointerdown", this.#handlePointerdown);
    $thumb.removeEventListener("pointermove", this.#handlePointermove);
    $thumb.removeEventListener("pointerup", this.#handlePointerup);
    $thumb.removeEventListener("pointercancel", this.#handlePointerup);
    $thumb.removeEventListener("lostpointercapture", this.#handlePointerup);
    $thumb.removeEventListener("focus", this.#handleThumbFocus);
    $thumb.style.removeProperty("touch-action");
  }

  protected clearDragState(): void {
    this.#drag = null;
    this.removeAttribute("dragging");
  }

  #handleKeydown = (event: KeyboardEvent): void => {
    this.onKeydown(event);
  };

  #handleThumbFocus = (event: FocusEvent): void => {
    this.onThumbFocus(event);
  };

  #handlePointerdown = (event: PointerEvent): void => {
    const $thumb = event.currentTarget as HTMLElement;
    const { button, clientY, clientX, pointerId } = event;

    if (button !== 0) {
      return;
    }

    $thumb.focus({ preventScroll: true });
    event.preventDefault();

    const { top, left, width, height } = $thumb.getBoundingClientRect();

    let offset = left + width / 2 - clientX;

    if (this.isVertical) {
      offset = top + height / 2 - clientY;
    }

    this.#drag = {
      id: pointerId,
      offset,
      $thumb,
    };

    this.setAttribute("dragging", "");
    $thumb.setPointerCapture(pointerId);
    this.commitPointerValue(event, $thumb);
  };

  #handlePointermove = (event: PointerEvent): void => {
    if (!this.#drag) {
      return;
    }

    const { id, $thumb } = this.#drag;
    const { pointerId } = event;

    if (pointerId !== id) {
      return;
    }

    this.commitPointerValue(event, $thumb);
    event.preventDefault();
  };

  #handlePointerup = (event: PointerEvent): void => {
    if (!this.#drag) {
      return;
    }

    const { id, $thumb } = this.#drag;
    const { pointerId } = event;

    if (pointerId !== id) {
      return;
    }

    this.#drag = null;
    this.removeAttribute("dragging");

    if ($thumb.hasPointerCapture?.(id)) {
      $thumb.releasePointerCapture(id);
    }
  };

  /** Pointer-to-thumb-center offset while dragging (`0` when idle). */
  protected get offset(): number {
    return this.#drag?.offset ?? 0;
  }
}
