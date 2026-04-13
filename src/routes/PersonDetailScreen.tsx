import { Link } from "react-router-dom";

export function PersonDetailScreen() {
  return (
    <section className="screen-stack">
      <article className="detail-card">
        <div className="detail-card__header">
          <div>
            <p className="section-kicker">Saved person</p>
            <h2>Maya</h2>
          </div>
          <Link className="secondary-button secondary-button--inline" to="/person/1/edit">
            Edit
          </Link>
        </div>

        <dl className="detail-list">
          <div>
            <dt>Add memorable thing</dt>
            <dd>Round glasses</dd>
          </div>
          <div>
            <dt>Add where you met</dt>
            <dd>Design meetup</dd>
          </div>
          <div>
            <dt>Add another detail</dt>
            <dd>Talked about fintech APIs</dd>
          </div>
          <div>
            <dt>Review status</dt>
            <dd>Next review tomorrow at 12:15</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

