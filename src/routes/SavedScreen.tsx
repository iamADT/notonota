const mockPeople = [
  {
    id: "1",
    name: "Maya",
    whereMet: "Design meetup",
    detail: "Round glasses"
  },
  {
    id: "2",
    name: "Ayo",
    whereMet: "Cafe queue",
    detail: "Building a fintech startup"
  }
];

export function SavedScreen() {
  return (
    <section className="screen-stack">
      <label className="search-shell">
        <span className="field-label">Search names or details</span>
        <input className="text-input" placeholder="Search names or details" />
      </label>

      <section className="summary-grid" aria-label="Review summary">
        <article className="summary-card summary-card--accent">
          <p className="summary-card__count">3</p>
          <p className="summary-card__label">Review today</p>
        </article>
        <article className="summary-card">
          <p className="summary-card__count">2</p>
          <p className="summary-card__label">Need more details</p>
        </article>
      </section>

      <section className="list-card">
        <div className="list-card__header">
          <p className="section-kicker">Saved people</p>
          <h2>Recent entries</h2>
        </div>
        <div className="person-list">
          {mockPeople.map((person) => (
            <article className="person-row" key={person.id}>
              <div>
                <h3>{person.name}</h3>
                <p>{person.whereMet}</p>
              </div>
              <p className="person-row__detail">{person.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

