import { describe, expect, it } from "vitest";
import { createPersonEntry } from "./person";
import { matchesSearch, searchEntries } from "./search";

describe("search domain", () => {
  const entries = [
    createPersonEntry({
      name: "Maya",
      memorableThing: "Round glasses",
      whereMet: "Design meetup"
    }),
    createPersonEntry({
      name: "Ayo",
      memorableThing: "Fintech founder",
      whereMet: "Coffee queue"
    })
  ];

  it("matches against any searchable field", () => {
    expect(matchesSearch(entries[0], "round")).toBe(true);
    expect(matchesSearch(entries[0], "design meetup")).toBe(true);
    expect(matchesSearch(entries[1], "ayo")).toBe(true);
  });

  it("uses case-insensitive substring matching", () => {
    expect(matchesSearch(entries[1], "FINTECH")).toBe(true);
    expect(matchesSearch(entries[1], "queue")).toBe(true);
  });

  it("filters the list using the same matcher", () => {
    expect(searchEntries(entries, "glasses").map((entry) => entry.name)).toEqual(["Maya"]);
    expect(searchEntries(entries, "founder").map((entry) => entry.name)).toEqual(["Ayo"]);
  });
});

