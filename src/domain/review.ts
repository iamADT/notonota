import {
  REVIEW_INTERVALS_DAYS,
  sameClockNextDate,
  type PersonEntry,
  isEligibleForReview
} from "./person";

export type ReviewResult = "got-it" | "missed-it";

export function isLearned(entry: PersonEntry) {
  return Boolean(entry.learnedAt);
}

export function isDue(entry: PersonEntry, now = new Date()) {
  if (!entry.dueAt || isLearned(entry)) {
    return false;
  }

  return new Date(entry.dueAt).getTime() <= now.getTime();
}

export function getNextDueAt(reviewedAt: Date | string, stage: number) {
  return sameClockNextDate(reviewedAt, REVIEW_INTERVALS_DAYS[stage]).toISOString();
}

export function beginOrResetReview(entry: PersonEntry, startedAt = new Date()) {
  if (!isEligibleForReview(entry)) {
    return {
      ...entry,
      reviewStage: 0,
      dueAt: null,
      learnedAt: null,
      lastReviewedAt: null
    };
  }

  return {
    ...entry,
    reviewStage: 0,
    dueAt: getNextDueAt(startedAt, 0),
    learnedAt: null,
    lastReviewedAt: null
  };
}

export function applyReviewResult(
  entry: PersonEntry,
  result: ReviewResult,
  reviewedAt = new Date()
): PersonEntry {
  const reviewedAtIso = reviewedAt.toISOString();

  if (result === "missed-it") {
    return {
      ...entry,
      reviewStage: 0,
      dueAt: getNextDueAt(reviewedAt, 0),
      lastReviewedAt: reviewedAtIso,
      learnedAt: null
    };
  }

  const nextStage = entry.reviewStage + 1;

  if (nextStage >= REVIEW_INTERVALS_DAYS.length) {
    return {
      ...entry,
      reviewStage: nextStage,
      dueAt: null,
      lastReviewedAt: reviewedAtIso,
      learnedAt: reviewedAtIso
    };
  }

  return {
    ...entry,
    reviewStage: nextStage,
    dueAt: getNextDueAt(reviewedAt, nextStage),
    lastReviewedAt: reviewedAtIso,
    learnedAt: null
  };
}

export function getDueEntries(entries: PersonEntry[], now = new Date(), cap = 3) {
  return entries
    .filter((entry) => isEligibleForReview(entry) && isDue(entry, now))
    .sort((left, right) => {
      const dueDifference = new Date(right.dueAt ?? 0).getTime() - new Date(left.dueAt ?? 0).getTime();

      if (dueDifference !== 0) {
        return dueDifference;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .slice(0, cap);
}

