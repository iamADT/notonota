import { describe, expect, it } from "vitest";
import { createPersonEntry, REVIEW_INTERVALS_DAYS } from "./person";
import { applyReviewResult, beginOrResetReview, getDueEntries, getNextDueAt } from "./review";

describe("review domain", () => {
  it("creates a due date one day after save at the same clock time", () => {
    const createdAt = new Date("2026-04-13T12:15:00.000Z");
    const entry = createPersonEntry(
      {
        name: "Maya",
        memorableThing: "Round glasses"
      },
      createdAt
    );

    expect(entry.dueAt).toBe("2026-04-14T12:15:00.000Z");
  });

  it("does not create a due date for name-only entries", () => {
    const entry = createPersonEntry({
      name: "Maya"
    });

    expect(entry.dueAt).toBeNull();
  });

  it("advances to the next review interval on got it", () => {
    const reviewedAt = new Date("2026-04-14T12:15:00.000Z");
    const entry = createPersonEntry({
      name: "Maya",
      memorableThing: "Round glasses"
    });
    const updatedEntry = applyReviewResult(entry, "got-it", reviewedAt);

    expect(updatedEntry.reviewStage).toBe(1);
    expect(updatedEntry.dueAt).toBe(getNextDueAt(reviewedAt, 1));
  });

  it("resets to stage zero on missed it", () => {
    const entry = {
      ...createPersonEntry({
        name: "Maya",
        memorableThing: "Round glasses"
      }),
      reviewStage: 3
    };
    const reviewedAt = new Date("2026-04-20T12:15:00.000Z");
    const updatedEntry = applyReviewResult(entry, "missed-it", reviewedAt);

    expect(updatedEntry.reviewStage).toBe(0);
    expect(updatedEntry.dueAt).toBe("2026-04-21T12:15:00.000Z");
  });

  it("marks the entry as learned after the final success", () => {
    const entry = {
      ...createPersonEntry({
        name: "Maya",
        memorableThing: "Round glasses"
      }),
      reviewStage: REVIEW_INTERVALS_DAYS.length - 1
    };
    const reviewedAt = new Date("2026-05-01T12:15:00.000Z");
    const updatedEntry = applyReviewResult(entry, "got-it", reviewedAt);

    expect(updatedEntry.learnedAt).toBe("2026-05-01T12:15:00.000Z");
    expect(updatedEntry.dueAt).toBeNull();
  });

  it("returns the newest due entries first and caps the queue", () => {
    const now = new Date("2026-04-15T12:16:00.000Z");
    const entries = [
      createPersonEntry({ name: "Ayo", memorableThing: "Fintech" }, new Date("2026-04-10T12:10:00.000Z")),
      createPersonEntry({ name: "Maya", memorableThing: "Round glasses" }, new Date("2026-04-10T12:15:00.000Z")),
      createPersonEntry({ name: "Lina", memorableThing: "Green coat" }, new Date("2026-04-10T12:30:00.000Z")),
      createPersonEntry({ name: "Chris", memorableThing: "Travel stories" }, new Date("2026-04-10T12:45:00.000Z"))
    ];

    const dueEntries = getDueEntries(entries, now, 3);

    expect(dueEntries).toHaveLength(3);
    expect(dueEntries.map((entry) => entry.name)).toEqual(["Chris", "Lina", "Maya"]);
  });

  it("restarts review when a previously incomplete entry becomes eligible", () => {
    const entry = createPersonEntry({ name: "Maya" }, new Date("2026-04-13T12:15:00.000Z"));
    const restarted = beginOrResetReview(
      {
        ...entry,
        memorableThing: "Round glasses"
      },
      new Date("2026-04-14T12:15:00.000Z")
    );

    expect(restarted.dueAt).toBe("2026-04-15T12:15:00.000Z");
  });
});

