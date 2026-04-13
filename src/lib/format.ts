import { needsMoreDetails, type PersonEntry } from "../domain/person";
import { isDue, isLearned } from "../domain/review";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function reviewStatusLabel(entry: PersonEntry, now = new Date()) {
  if (needsMoreDetails(entry)) {
    return "Needs one detail before review";
  }

  if (isLearned(entry)) {
    return "Learned";
  }

  if (entry.dueAt && isDue(entry, now)) {
    return `Due since ${formatDateTime(entry.dueAt)}`;
  }

  if (entry.dueAt) {
    return `Next review ${formatDateTime(entry.dueAt)}`;
  }

  return "Saved";
}

