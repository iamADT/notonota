import { describe, expect, it } from "vitest";
import { createPersonEntry } from "./person";
import { hasMeaningfulMemoryCueChange } from "./meaningfulChange";

describe("meaningfulChange domain", () => {
  it("ignores casing, whitespace, and punctuation changes", () => {
    const previous = createPersonEntry({
      name: "Maya",
      memorableThing: "Round glasses",
      whereMet: "Design meetup"
    });
    const next = {
      ...previous,
      name: "  maya ",
      memorableThing: "Round glasses!",
      whereMet: "Design   meetup"
    };

    expect(hasMeaningfulMemoryCueChange(previous, next)).toBe(false);
  });

  it("ignores small typo-like changes", () => {
    const previous = createPersonEntry({
      name: "Maya",
      memorableThing: "Round glases"
    });
    const next = {
      ...previous,
      memorableThing: "Round glasses"
    };

    expect(hasMeaningfulMemoryCueChange(previous, next)).toBe(false);
  });

  it("detects meaningfully different memory cues", () => {
    const previous = createPersonEntry({
      name: "Maya",
      memorableThing: "Round glasses"
    });
    const next = {
      ...previous,
      memorableThing: "Works in fintech"
    };

    expect(hasMeaningfulMemoryCueChange(previous, next)).toBe(true);
  });
});
