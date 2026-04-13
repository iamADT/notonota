import { Link } from "react-router-dom";
import { needsMoreDetails, type PersonEntry } from "../domain/person";

type PersonRowProps = {
  person: PersonEntry;
};

export function PersonRow({ person }: PersonRowProps) {
  const detail = person.memorableThing || person.anotherDetail || "No memorable detail yet";

  return (
    <Link className="person-row person-row--link" to={`/person/${person.id}`}>
      <div>
        <div className="person-row__title">
          <h3>{person.name}</h3>
          {needsMoreDetails(person) ? <span className="pill-badge">Needs detail</span> : null}
        </div>
        <p>{person.whereMet || "Where you met not added yet"}</p>
      </div>
      <p className="person-row__detail">{detail}</p>
    </Link>
  );
}

