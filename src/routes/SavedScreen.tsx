import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { PersonRow } from "../components/PersonRow";
import { SearchBar } from "../components/SearchBar";
import { listPeople } from "../db/people";
import { needsMoreDetails } from "../domain/person";
import { getDueEntries } from "../domain/review";
import { searchEntries } from "../domain/search";

export function SavedScreen() {
  const [query, setQuery] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;
  });
  const people = useLiveQuery(() => listPeople(), [], []);

  const filteredPeople = useMemo(() => searchEntries(people, query), [people, query]);
  const dueEntries = useMemo(() => getDueEntries(people, new Date(), 3), [people]);
  const incompleteEntries = useMemo(() => people.filter((entry) => needsMoreDetails(entry)), [people]);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }

  return (
    <section className="screen-stack">
      <SearchBar value={query} onChange={setQuery} />

      <section className="summary-grid" aria-label="Review summary">
        <article className="summary-card summary-card--accent">
          <p className="summary-card__count">{dueEntries.length}</p>
          <p className="summary-card__label">
            {dueEntries.length === 1 ? "Review 1 name" : `Review ${dueEntries.length} names`}
          </p>
          <Link className="summary-card__link" to="/review">
            Open review
          </Link>
        </article>
        <article className="summary-card">
          <p className="summary-card__count">{incompleteEntries.length}</p>
          <p className="summary-card__label">
            {incompleteEntries.length === 1
              ? "1 name needs more details"
              : `${incompleteEntries.length} names need more details`}
          </p>
        </article>
      </section>

      {notificationPermission !== "granted" && notificationPermission !== "unsupported" ? (
        <section className="support-card">
          <p className="support-card__title">Enable reminders</p>
          <p>Allow notifications to get one reminder exactly when a review becomes due.</p>
          <button
            className="secondary-button secondary-button--inline"
            type="button"
            onClick={() => void enableNotifications()}
          >
            Turn on reminders
          </button>
        </section>
      ) : null}

      <section className="list-card">
        <div className="list-card__header">
          <p className="section-kicker">Saved people</p>
          <h2>Recent entries</h2>
        </div>
        <div className="person-list">
          {filteredPeople.length ? (
            filteredPeople.map((person) => <PersonRow key={person.id} person={person} />)
          ) : (
            <p className="empty-state">No saved people match that search yet.</p>
          )}
        </div>
      </section>
    </section>
  );
}
