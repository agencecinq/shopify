import { describe, expect, it } from "vitest";
import {
  multiTrackLength,
  multiValueFromPointer,
  ratioFromPointer,
  ratioFromValue,
  singleTrackLength,
  snapToStep,
  valueFromRatio,
} from "./geometry.js";

/** Minimal `DOMRect` for pointer math tests. */
const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
  }) as DOMRect;

describe("ratioFromValue / valueFromRatio", () => {
  it("maps value to semantic ratio", () => {
    expect(ratioFromValue(0, 0, 100)).toBe(0);
    expect(ratioFromValue(50, 0, 100)).toBe(0.5);
    expect(ratioFromValue(100, 0, 100)).toBe(1);
  });

  it("returns 0 when bounds collapse", () => {
    expect(ratioFromValue(42, 10, 10)).toBe(0);
  });

  it("maps ratio back to value", () => {
    expect(valueFromRatio(0, 0, 100)).toBe(0);
    expect(valueFromRatio(0.5, 0, 100)).toBe(50);
    expect(valueFromRatio(1, 20, 120)).toBe(120);
  });
});

describe("snapToStep", () => {
  it("snaps to the nearest step", () => {
    expect(snapToStep(47, 0, 100, 5)).toBe(45);
    expect(snapToStep(48, 0, 100, 5)).toBe(50);
  });

  it("clamps to bounds after snap", () => {
    expect(snapToStep(102, 0, 100, 5)).toBe(100);
    expect(snapToStep(-3, 0, 100, 5)).toBe(0);
  });

  it("supports fractional steps", () => {
    expect(snapToStep(47.56, 0, 100, 0.1)).toBeCloseTo(47.6);
    expect(snapToStep(47.44, 0, 100, 0.1)).toBeCloseTo(47.4);
  });

  it("clamps only when step is non-positive", () => {
    expect(snapToStep(150, 0, 100, 0)).toBe(100);
    expect(snapToStep(150, 0, 100, -1)).toBe(100);
  });
});

describe("track length", () => {
  it("subtracts thumb size(s) from the rail", () => {
    expect(singleTrackLength(200, 20)).toBe(180);
    expect(multiTrackLength(200, 20)).toBe(160);
  });

  it("never returns negative length", () => {
    expect(singleTrackLength(10, 20)).toBe(0);
    expect(multiTrackLength(30, 20)).toBe(0);
  });
});

describe("ratioFromPointer", () => {
  const thumb = 20;
  const track = 180;

  it("maps LTR pointer to semantic ratio", () => {
    const rail = rect(0, 0, 200, 40);
    const minCenter = thumb / 2;
    const maxCenter = thumb / 2 + track;

    expect(ratioFromPointer(minCenter, rail, thumb, false, false)).toBe(0);
    expect(ratioFromPointer(maxCenter, rail, thumb, false, false)).toBe(1);
    expect(
      ratioFromPointer(minCenter + track / 2, rail, thumb, false, false),
    ).toBeCloseTo(0.5);
  });

  it("mirrors ratio in RTL", () => {
    const rail = rect(0, 0, 200, 40);
    const minCenter = thumb / 2;
    const maxCenter = thumb / 2 + track;

    expect(ratioFromPointer(minCenter, rail, thumb, true, false)).toBe(1);
    expect(ratioFromPointer(maxCenter, rail, thumb, true, false)).toBe(0);
  });

  it("returns 0 when track length is zero", () => {
    expect(ratioFromPointer(50, rect(0, 0, 10, 40), 20, false, false)).toBe(0);
  });

  it("maps vertical pointer with max at the top", () => {
    const rail = rect(0, 0, 40, 200);
    const topCenter = thumb / 2;
    const bottomCenter = thumb / 2 + track;

    expect(ratioFromPointer(topCenter, rail, thumb, false, true)).toBe(1);
    expect(ratioFromPointer(bottomCenter, rail, thumb, false, true)).toBe(0);
  });
});

describe("multiValueFromPointer", () => {
  const rail = rect(0, 0, 200, 200);
  const thumb = 20;
  const track = multiTrackLength(200, thumb);
  const gmin = 0;
  const gmax = 100;

  it("maps min thumb at the LTR start", () => {
    expect(
      multiValueFromPointer(
        rail.left,
        rail,
        "min",
        gmin,
        gmax,
        track,
        thumb,
        false,
        false,
      ),
    ).toBe(0);
  });

  it("maps max thumb at the LTR end", () => {
    expect(
      multiValueFromPointer(
        rail.left + thumb + track,
        rail,
        "max",
        gmin,
        gmax,
        track,
        thumb,
        false,
        false,
      ),
    ).toBe(100);
  });

  it("mirrors horizontal values in RTL", () => {
    expect(
      multiValueFromPointer(
        rail.left + thumb,
        rail,
        "min",
        gmin,
        gmax,
        track,
        thumb,
        true,
        false,
      ),
    ).toBe(100);
  });

  it("maps vertical min at the bottom", () => {
    expect(
      multiValueFromPointer(
        rail.top + thumb + track,
        rail,
        "min",
        gmin,
        gmax,
        track,
        thumb,
        false,
        true,
      ),
    ).toBe(0);
  });

  it("maps vertical max at the top", () => {
    expect(
      multiValueFromPointer(
        rail.top,
        rail,
        "max",
        gmin,
        gmax,
        track,
        thumb,
        false,
        true,
      ),
    ).toBe(100);
  });
});
