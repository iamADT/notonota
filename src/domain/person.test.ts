import { describe, expect, it } from "vitest";
import { isEligibleForReview, needsMoreDetails } from "./person";

describe("person domain", () => {
  it("treats entries with a name and one detail as reviewable", () => {
    expect(
      isEligibleForReview({
        name: "Maya",
        memorableThing: "Round glasses",
        whereMet: "",
        anotherDetail: ""
      })
    ).toBe(true);
  });

  it("treats name-only entries as needing more details", () => {
    expect(
      needsMoreDetails({
        name: "Maya",
        memorableThing: "",
        whereMet: "",
        anotherDetail: ""
      })
    ).toBe(true);
  });
});
