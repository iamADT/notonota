import Dexie, { type Table } from "dexie";
import { hasMeaningfulMemoryCueChange } from "../domain/meaningfulChange";
import {
  applyInputToEntry,
  createPersonEntry,
  normalizeName,
  type PersonEntry,
  type PersonInput
} from "../domain/person";
import { applyReviewResult, beginOrResetReview, type ReviewResult } from "../domain/review";

class NotonotaDB extends Dexie {
  people!: Table<PersonEntry, string>;

  constructor() {
    super("notonota");
    this.version(1).stores({
      people: "id, name, createdAt, updatedAt, dueAt, learnedAt"
    });
  }
}

export const db = new NotonotaDB();

export async function listPeople() {
  return db.people.orderBy("createdAt").reverse().toArray();
}

export async function getPerson(id: string) {
  return db.people.get(id);
}

export async function createPerson(input: PersonInput, createdAt = new Date()) {
  const entry = createPersonEntry(input, createdAt);
  await db.people.add(entry);
  return entry;
}

export async function updatePerson(id: string, input: PersonInput, updatedAt = new Date()) {
  const existing = await db.people.get(id);

  if (!existing) {
    throw new Error(`Person ${id} not found`);
  }

  const updatedEntry = applyInputToEntry(existing, input, updatedAt);
  const nextEntry = hasMeaningfulMemoryCueChange(existing, updatedEntry)
    ? beginOrResetReview(updatedEntry, updatedAt)
    : updatedEntry;

  await db.people.put(nextEntry);
  return nextEntry;
}

export async function deletePerson(id: string) {
  await db.people.delete(id);
}

export async function recordReview(id: string, result: ReviewResult, reviewedAt = new Date()) {
  const existing = await db.people.get(id);

  if (!existing) {
    throw new Error(`Person ${id} not found`);
  }

  const updatedEntry = applyReviewResult(existing, result, reviewedAt);
  await db.people.put(updatedEntry);
  return updatedEntry;
}

export async function findDuplicateByName(name: string) {
  const normalized = normalizeName(name);
  const people = await db.people.toArray();

  return people.find((entry) => normalizeName(entry.name) === normalized) ?? null;
}

