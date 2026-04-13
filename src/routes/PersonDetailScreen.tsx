import { useLiveQuery } from "dexie-react-hooks";
import { Link, useParams } from "react-router-dom";
import { getPerson } from "../db/people";
import { formatDateTime, reviewStatusLabel } from "../lib/format";

export function PersonDetailScreen() {
  const { id } = useParams();
  const person = useLiveQuery(async () => (id ? (await getPerson(id)) ?? null : null), [id]);

  if (person === undefined) {
    return (
      <section className="screen-stack">
        <article className="detail-card">
          <p className="section-kicker">Saved person</p>
          <h2>Loading...</h2>
        </article>
      </section>
    );
  }

  if (!person) {
    return (
      <section className="screen-stack">
        <article className="detail-card">
          <p className="section-kicker">Saved person</p>
          <h2>Entry not found</h2>
          <p>This person was deleted or does not exist in local storage.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-stack">
      <article className="detail-card">
        <div className="detail-card__header">
          <div>
            <p className="section-kicker">Saved person</p>
            <h2>{person.name}</h2>
          </div>
          <Link className="secondary-button secondary-button--inline" to={`/person/${person.id}/edit`}>
            Edit
          </Link>
        </div>

        <dl className="detail-list">
          <div>
            <dt>Add memorable thing</dt>
            <dd>{person.memorableThing || "Not added yet"}</dd>
          </div>
          <div>
            <dt>Add where you met</dt>
            <dd>{person.whereMet || "Not added yet"}</dd>
          </div>
          <div>
            <dt>Add another detail</dt>
            <dd>{person.anotherDetail || "Not added yet"}</dd>
          </div>
          <div>
            <dt>Review status</dt>
            <dd>{reviewStatusLabel(person)}</dd>
          </div>
          <div>
            <dt>Saved at</dt>
            <dd>{formatDateTime(person.createdAt)}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
