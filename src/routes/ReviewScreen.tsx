export function ReviewScreen() {
  return (
    <section className="screen-stack">
      <article className="review-card">
        <p className="section-kicker">Prompt</p>
        <h2>M _ y a</h2>
        <p>Met at a design meetup. Wears round glasses.</p>
        <div className="review-card__actions">
          <button className="secondary-button" type="button">
            Reveal answer
          </button>
          <button className="primary-button" type="button">
            Got it
          </button>
        </div>
        <button className="text-button" type="button">
          Missed it
        </button>
      </article>
    </section>
  );
}

