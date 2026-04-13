import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { listPeople } from "../db/people";
import { type PersonEntry } from "../domain/person";
import { isLearned } from "../domain/review";

const STORAGE_KEY = "notonota.sentDueNotifications";

function loadSentKeys() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function rememberNotification(key: string) {
  const sentKeys = new Set(loadSentKeys());
  sentKeys.add(key);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...sentKeys]));
}

async function showReviewNotification(entry: PersonEntry, notificationKey: string) {
  const title = `Review ${entry.name}`;
  const body = entry.memorableThing || entry.whereMet || entry.anotherDetail || "Open Notonota to review.";

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready.catch(() => null);

    if (registration) {
      await registration.showNotification(title, {
        body,
        tag: notificationKey
      });
      return;
    }
  }

  new Notification(title, {
    body,
    tag: notificationKey
  });
}

export function ReviewNotificationManager() {
  const people = useLiveQuery(() => listPeople(), [], []);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    const activeEntries = people.filter((entry) => entry.dueAt && !isLearned(entry));
    const timers: number[] = [];
    const sentKeys = new Set(loadSentKeys());

    for (const entry of activeEntries) {
      const notificationKey = `${entry.id}:${entry.dueAt}`;

      if (!entry.dueAt || sentKeys.has(notificationKey)) {
        continue;
      }

      const dueTime = new Date(entry.dueAt).getTime();
      const delay = dueTime - Date.now();

      if (delay <= 0) {
        if (Notification.permission === "granted") {
          void showReviewNotification(entry, notificationKey);
        }
        rememberNotification(notificationKey);
        continue;
      }

      timers.push(
        window.setTimeout(() => {
          if (Notification.permission === "granted") {
            void showReviewNotification(entry, notificationKey);
          }
          rememberNotification(notificationKey);
        }, delay)
      );
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [people]);

  return null;
}
