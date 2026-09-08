import { describe, expect, it } from "vitest";
import Keyboard from "./keyboard.js";

describe("Keyboard.delta (horizontal LTR)", () => {
  const kb = new Keyboard(5, 25, false, false);

  it("increases on ArrowRight and ArrowUp", () => {
    expect(kb.delta("ArrowRight")).toEqual({ delta: 5, preventDefault: true });
    expect(kb.delta("ArrowUp")).toEqual({ delta: 5, preventDefault: true });
  });

  it("decreases on ArrowLeft and ArrowDown", () => {
    expect(kb.delta("ArrowLeft")).toEqual({ delta: -5, preventDefault: true });
    expect(kb.delta("ArrowDown")).toEqual({ delta: -5, preventDefault: true });
  });
});

describe("Keyboard.delta (horizontal RTL)", () => {
  const kb = new Keyboard(5, 25, true, false);

  it("swaps horizontal arrows", () => {
    expect(kb.delta("ArrowLeft")).toEqual({ delta: 5, preventDefault: true });
    expect(kb.delta("ArrowRight")).toEqual({ delta: -5, preventDefault: true });
  });
});

describe("Keyboard.delta (vertical)", () => {
  const kb = new Keyboard(5, 25, true, true);

  it("increases on Up/Right regardless of RTL", () => {
    expect(kb.delta("ArrowUp")).toEqual({ delta: 5, preventDefault: true });
    expect(kb.delta("ArrowRight")).toEqual({ delta: 5, preventDefault: true });
  });

  it("decreases on Down/Left", () => {
    expect(kb.delta("ArrowDown")).toEqual({ delta: -5, preventDefault: true });
    expect(kb.delta("ArrowLeft")).toEqual({ delta: -5, preventDefault: true });
  });
});

describe("Keyboard.delta (page keys)", () => {
  const kb = new Keyboard(1, 10, false, false);

  it("maps PageUp and PageDown to page increment", () => {
    expect(kb.delta("PageUp")).toEqual({ delta: 10, preventDefault: true });
    expect(kb.delta("PageDown")).toEqual({ delta: -10, preventDefault: true });
  });
});

describe("Keyboard.delta (Home / End)", () => {
  const kb = new Keyboard(1, 10, false, false);

  it("returns zero delta with preventDefault for host handling", () => {
    expect(kb.delta("Home")).toEqual({ delta: 0, preventDefault: true });
    expect(kb.delta("End")).toEqual({ delta: 0, preventDefault: true });
  });
});

describe("Keyboard static helpers", () => {
  it("detects Home and End", () => {
    expect(Keyboard.isHome("Home")).toBe(true);
    expect(Keyboard.isHome("End")).toBe(false);
    expect(Keyboard.isEnd("End")).toBe(true);
    expect(Keyboard.isEnd("Home")).toBe(false);
  });
});

describe("Keyboard.delta (unhandled keys)", () => {
  const kb = new Keyboard(1, 10, false, false);

  it("returns null for unknown keys", () => {
    expect(kb.delta("Enter")).toBeNull();
    expect(kb.delta("a")).toBeNull();
  });
});
