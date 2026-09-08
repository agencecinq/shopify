export type KeyboardDelta = {
  delta: number;
  preventDefault: boolean;
};

/**
 * APG slider keyboard mapping for arrow and page keys.
 *
 * Horizontal: Left/Right swap in RTL (same convention as `@agencecinq/tabs`).
 * Vertical: Up increases, Down decreases. RTL has no effect on the axis.
 * Home/End are handled by the host (`Keyboard.isHome` / `Keyboard.isEnd`).
 */
export default class Keyboard {
  readonly #step: number;
  readonly #page: number;
  readonly #rtl: boolean;
  readonly #vertical: boolean;

  constructor(step: number, page: number, rtl: boolean, vertical = false) {
    this.#step = step;
    this.#page = page;
    this.#rtl = rtl;
    this.#vertical = vertical;
  }

  /** Step/page delta for `key`, or `null` if unhandled. */
  delta(key: string): KeyboardDelta | null {
    const increase = this.#step;
    const decrease = -this.#step;
    const pageUp = this.#page;
    const pageDown = -this.#page;

    if (this.#vertical) {
      const verticalKeys: Record<string, number> = {
        ArrowUp: increase,
        ArrowDown: decrease,
        ArrowRight: increase,
        ArrowLeft: decrease,
      };

      if (key in verticalKeys) {
        return { delta: verticalKeys[key]!, preventDefault: true };
      }
    } else {
      const horizontal: Record<string, number> = this.#rtl
        ? {
            ArrowLeft: increase,
            ArrowRight: decrease,
            ArrowUp: increase,
            ArrowDown: decrease,
          }
        : {
            ArrowRight: increase,
            ArrowLeft: decrease,
            ArrowUp: increase,
            ArrowDown: decrease,
          };

      if (key in horizontal) {
        return { delta: horizontal[key]!, preventDefault: true };
      }
    }

    if (key === "PageUp") {
      return { delta: pageUp, preventDefault: true };
    }

    if (key === "PageDown") {
      return { delta: pageDown, preventDefault: true };
    }

    if (key === "Home" || key === "End") {
      return { delta: 0, preventDefault: true };
    }

    return null;
  }

  static isHome(key: string): boolean {
    return key === "Home";
  }

  static isEnd(key: string): boolean {
    return key === "End";
  }
}
