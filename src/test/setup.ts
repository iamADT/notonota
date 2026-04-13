import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { db } from "../db/people";

class MockHeaders {
  private readonly values = new Map<string, string>();

  constructor(init?: Record<string, string>) {
    Object.entries(init ?? {}).forEach(([key, value]) => {
      this.values.set(key.toLowerCase(), value);
    });
  }

  append(key: string, value: string) {
    this.values.set(key.toLowerCase(), value);
  }

  get(key: string) {
    return this.values.get(key.toLowerCase()) ?? null;
  }

  has(key: string) {
    return this.values.has(key.toLowerCase());
  }

  set(key: string, value: string) {
    this.values.set(key.toLowerCase(), value);
  }

  toObject() {
    return Object.fromEntries(this.values.entries());
  }
}

class MockRequest {
  url: string;
  method: string;
  headers: MockHeaders;
  signal: AbortSignal;
  body: BodyInit | null;

  constructor(input: string | { url: string }, init?: RequestInit) {
    this.url = typeof input === "string" ? input : input.url;
    this.method = init?.method ?? "GET";
    this.headers = new MockHeaders((init?.headers as Record<string, string>) ?? {});
    this.signal = init?.signal ?? new AbortController().signal;
    this.body = init?.body ?? null;
  }

  clone() {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers.toObject(),
      body: this.body,
      signal: this.signal
    });
  }
}

if (!("Request" in globalThis)) {
  Object.assign(globalThis, {
    Headers: MockHeaders,
    Request: MockRequest
  });
}

beforeEach(async () => {
  await db.delete();
  await db.open();
  window.localStorage.clear();
});

afterEach(async () => {
  cleanup();
  await db.delete();
  window.localStorage.clear();
});
