import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ReviewCard } from "../components/ReviewCard";
import { listPeople, recordReview } from "../db/people";
import { getDueEntries } from "../domain/review";

export function ReviewScreen() {
  const [revealed, setRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const people = useLiveQuery(() => listPeople(), [], []);
  const dueEntries = useMemo(() => getDueEntries(people, new Date(), 3), [people]);
  const currentEntry = dueEntries[0] ?? null;

  useEffect(() => {
    setRevealed(false);
  }, [currentEntry?.id]);

  async function handleReview(result: "got-it" | "missed-it") {
    if (!currentEntry || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (result === "missed-it") {
      setRevealed(true);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }

    await recordReview(currentEntry.id, result);
    setIsSubmitting(false);
  }

  if (!currentEntry) {
    return (
      <section className="screen-stack">
        <article className="review-card">
          <p className="section-kicker">Review</p>
          <h2>Nothing due right now</h2>
          <p>Come back when a saved name reaches its due time.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-stack">
      <ReviewCard
        person={currentEntry}
        position={1}
        total={dueEntries.length}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        onGotIt={() => void handleReview("got-it")}
        onMissedIt={() => void handleReview("missed-it")}
      />
    </section>
  );
}
