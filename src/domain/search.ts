import { type PersonEntry, trimValue } from "./person";

function normalize(value: string) {
  return trimValue(value).toLocaleLowerCase();
}

export function matchesSearch(entry: PersonEntry, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystacks = [entry.name, entry.memorableThing, entry.whereMet, entry.anotherDetail].map(normalize);

  return haystacks.some((value) => value.includes(normalizedQuery));
}

export function searchEntries(entries: PersonEntry[], query: string) {
  return entries.filter((entry) => matchesSearch(entry, query));
}

