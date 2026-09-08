import { ActiveThumb } from './types.js';
/** Semantic ratio in `[0, 1]` from value and bounds. */
export declare const ratioFromValue: (value: number, min: number, max: number) => number;
/** Value from semantic ratio. */
export declare const valueFromRatio: (ratio: number, min: number, max: number) => number;
/** Snap a value to the nearest step within `[min, max]`. */
export declare const snapToStep: (value: number, min: number, max: number, step: number) => number;
/** Single-thumb track length. */
export declare const singleTrackLength: (railLength: number, thumbSize: number) => number;
/** Multi-thumb track length (two thumbs). */
export declare const multiTrackLength: (railLength: number, thumbSize: number) => number;
/** Map pointer position to semantic ratio (single thumb). */
export declare const ratioFromPointer: (clientCoord: number, rect: DOMRect, thumbSize: number, rtl: boolean, vertical: boolean) => number;
/**
 * Map pointer position to value (multi-thumb, horizontal or vertical).
 * `clientCoord` is `clientX` or `clientY`. RTL mirrors the horizontal axis.
 */
export declare const multiValueFromPointer: (clientCoord: number, rect: DOMRect, which: ActiveThumb, gmin: number, gmax: number, track: number, thumbSize: number, rtl: boolean, vertical: boolean) => number;
//# sourceMappingURL=geometry.d.ts.map