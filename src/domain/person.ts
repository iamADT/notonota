export const REVIEW_INTERVALS_DAYS = [1, 1, 3, 7, 10, 14] as const;

export type PersonInput = {
  name: string;
  memorableThing?: string;
  whereMet?: string;
  anotherDetail?: string;
};

export type PersonEntry = {
  id: string;
  name: string;
  memorableThing: string;
  whereMet: string;
  anotherDetail: string;
  createdAt: string;
  updatedAt: string;
  reviewStage: number;
  dueAt: string | null;
  lastReviewedAt: string | null;
  learnedAt: string | null;
};

export function trimValue(value: string | undefined) {
  return value?.trim() ?? "";
}

export function normalizeName(value: string) {
  return trimValue(value).replace(/\s+/g, " ").toLocaleLowerCase();
}

export function detailValues(entry: Pick<PersonEntry, "memorableThing" | "whereMet" | "anotherDetail">) {
  return [entry.memorableThing, entry.whereMet, entry.anotherDetail].map(trimValue);
}

export function hasAtLeastOneDetail(
  entry: Pick<PersonEntry, "memorableThing" | "whereMet" | "anotherDetail">
) {
  return detailValues(entry).some(Boolean);
}

export function isEligibleForReview(
  entry: Pick<PersonEntry, "name" | "memorableThing" | "whereMet" | "anotherDetail">
) {
  return Boolean(trimValue(entry.name)) && hasAtLeastOneDetail(entry);
}

export function needsMoreDetails(
  entry: Pick<PersonEntry, "name" | "memorableThing" | "whereMet" | "anotherDetail">
) {
  return Boolean(trimValue(entry.name)) && !hasAtLeastOneDetail(entry);
}

export function sameClockNextDate(baseTime: Date | string, days: number) {
  const result = new Date(baseTime);
  result.setDate(result.getDate() + days);
  return result;
}

export function createPersonEntry(input: PersonInput, createdAt = new Date()): PersonEntry {
  const timestamp = createdAt.toISOString();
  const entry: PersonEntry = {
    id: crypto.randomUUID(),
    name: trimValue(input.name),
    memorableThing: trimValue(input.memorableThing),
    whereMet: trimValue(input.whereMet),
    anotherDetail: trimValue(input.anotherDetail),
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStage: 0,
    dueAt: null,
    lastReviewedAt: null,
    learnedAt: null
  };

  if (isEligibleForReview(entry)) {
    entry.dueAt = sameClockNextDate(createdAt, REVIEW_INTERVALS_DAYS[0]).toISOString();
  }

  return entry;
}

export function applyInputToEntry(
  entry: PersonEntry,
  input: PersonInput,
  updatedAt = new Date()
): PersonEntry {
  return {
    ...entry,
    name: trimValue(input.name),
    memorableThing: trimValue(input.memorableThing),
    whereMet: trimValue(input.whereMet),
    anotherDetail: trimValue(input.anotherDetail),
    updatedAt: updatedAt.toISOString()
  };
}

