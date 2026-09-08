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
    #private;
    constructor(step: number, page: number, rtl: boolean, vertical?: boolean);
    /** Step/page delta for `key`, or `null` if unhandled. */
    delta(key: string): KeyboardDelta | null;
    static isHome(key: string): boolean;
    static isEnd(key: string): boolean;
}
//# sourceMappingURL=keyboard.d.ts.map