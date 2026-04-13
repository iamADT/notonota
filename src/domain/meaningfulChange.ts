import { type PersonEntry, trimValue } from "./person";

function canonicalize(value: string) {
  return trimValue(value)
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");
}

function editDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));

  for (let row = 0; row <= left.length; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 0; column <= right.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}

function isTypoLikeChange(previousValue: string, nextValue: string) {
  if (!previousValue || !nextValue) {
    return false;
  }

  const distance = editDistance(previousValue, nextValue);
  const threshold = Math.max(1, Math.floor(Math.max(previousValue.length, nextValue.length) * 0.18));

  return distance <= threshold && previousValue.split(" ").length === nextValue.split(" ").length;
}

function fieldChangedMeaningfully(previousValue: string, nextValue: string) {
  const previousCanonical = canonicalize(previousValue);
  const nextCanonical = canonicalize(nextValue);

  if (previousCanonical === nextCanonical) {
    return false;
  }

  if (isTypoLikeChange(previousCanonical, nextCanonical)) {
    return false;
  }

  return true;
}

export function hasMeaningfulMemoryCueChange(previous: PersonEntry, next: PersonEntry) {
  return [
    fieldChangedMeaningfully(previous.name, next.name),
    fieldChangedMeaningfully(previous.memorableThing, next.memorableThing),
    fieldChangedMeaningfully(previous.whereMet, next.whereMet),
    fieldChangedMeaningfully(previous.anotherDetail, next.anotherDetail)
  ].some(Boolean);
}

