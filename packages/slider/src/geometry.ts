import { clamp } from "@agencecinq/utils";
import type { ActiveThumb } from "./types.js";

/** Semantic ratio in `[0, 1]` from value and bounds. */
export const ratioFromValue = (
  value: number,
  min: number,
  max: number,
): number => {
  const span = max - min;
  return span > 0 ? (value - min) / span : 0;
};

/** Value from semantic ratio. */
export const valueFromRatio = (
  ratio: number,
  min: number,
  max: number,
): number => min + ratio * (max - min);

/** Snap a value to the nearest step within `[min, max]`. */
export const snapToStep = (
  value: number,
  min: number,
  max: number,
  step: number,
): number => {
  if (step <= 0) {
    return clamp(value, min, max);
  }

  const snapped = min + Math.round((value - min) / step) * step;
  return clamp(snapped, min, max);
};

/** Single-thumb track length. */
export const singleTrackLength = (
  railLength: number,
  thumbSize: number,
): number => Math.max(0, railLength - thumbSize);

/** Multi-thumb track length (two thumbs). */
export const multiTrackLength = (
  railLength: number,
  thumbSize: number,
): number => Math.max(0, railLength - 2 * thumbSize);

/** Always-visible lead offset for pointer mapping (19h47). */
const multiLeadOffset = (
  which: ActiveThumb,
  thumbSize: number,
  rtl: boolean,
  vertical: boolean,
): number => {
  if (vertical) {
    return which === "min" ? thumbSize : 0;
  }

  if (rtl) {
    return which === "min" ? thumbSize : 0;
  }

  return which === "max" ? thumbSize : 0;
};

/** Map pointer position to semantic ratio (single thumb). */
export const ratioFromPointer = (
  clientCoord: number,
  rect: DOMRect,
  thumbSize: number,
  rtl: boolean,
  vertical: boolean,
): number => {
  const railLength = vertical ? rect.height : rect.width;
  const start = vertical ? rect.top : rect.left;
  const track = singleTrackLength(railLength, thumbSize);

  if (track <= 0) {
    return 0;
  }

  const position = clientCoord - start - thumbSize / 2;
  const physical = clamp(position / track, 0, 1);

  return vertical || rtl ? 1 - physical : physical;
};

/**
 * Map pointer position to value (multi-thumb, horizontal or vertical).
 * `clientCoord` is `clientX` or `clientY`. RTL mirrors the horizontal axis.
 */
export const multiValueFromPointer = (
  clientCoord: number,
  rect: DOMRect,
  which: ActiveThumb,
  gmin: number,
  gmax: number,
  track: number,
  thumbSize: number,
  rtl: boolean,
  vertical: boolean,
): number => {
  const lead = multiLeadOffset(which, thumbSize, rtl, vertical);
  const start = vertical ? rect.top : rect.left;
  const difference = clientCoord - start - lead;
  const position = clamp(difference, 0, track);
  const ratio = track > 0 ? position / track : 0;
  const span = gmax - gmin;

  if (vertical || rtl) {
    return Math.round(gmax - span * ratio);
  }

  return Math.round(gmin + span * ratio);
};
