import { type PersonEntry } from "../domain/person";

type ReviewCardProps = {
  person: PersonEntry;
  position: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  onGotIt: () => void;
  onMissedIt: () => void;
};

function maskName(name: string) {
  return name
    .split("")
    .map((character, index) => {
      if (character === " ") {
        return " ";
      }

      if (index === 0 || index === name.length - 1) {
        return character;
      }

      return "_";
    })
    .join(" ");
}

function supportDetail(person: PersonEntry) {
  return person.memorableThing || person.whereMet || person.anotherDetail || "";
}

export function ReviewCard({
  person,
  position,
  total,
  revealed,
  onReveal,
  onGotIt,
  onMissedIt
}: ReviewCardProps) {
  const detail = supportDetail(person);

  return (
    <article className="review-card">
      <p className="section-kicker">
        Card {position} of {total}
      </p>
      <h2>{revealed ? person.name : maskName(person.name)}</h2>
      <p>{detail || "No support detail saved."}</p>
      <div className="review-card__actions">
        <button className="secondary-button" type="button" onClick={onReveal}>
          {revealed ? "Answer shown" : "Reveal answer"}
        </button>
        <button className="primary-button" type="button" onClick={onGotIt}>
          Got it
        </button>
      </div>
      <button className="text-button" type="button" onClick={onMissedIt}>
        Missed it
      </button>
    </article>
  );
}

