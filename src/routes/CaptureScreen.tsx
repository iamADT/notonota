export function CaptureScreen() {
  return (
    <section className="screen-stack">
      <div className="hero-card">
        <label className="field-label" htmlFor="capture-name">
          Name
        </label>
        <input
          id="capture-name"
          className="name-input"
          name="name"
          placeholder="Type a name"
          autoFocus
        />
        <details className="details-card">
          <summary>Add more details</summary>
          <div className="details-card__body">
            <label className="field-label" htmlFor="memorable-thing">
              Add memorable thing
            </label>
            <input id="memorable-thing" className="text-input" placeholder="Round glasses" />
            <label className="field-label" htmlFor="where-met">
              Add where you met
            </label>
            <input id="where-met" className="text-input" placeholder="Design meetup" />
            <label className="field-label" htmlFor="another-detail">
              Add another detail
            </label>
            <input id="another-detail" className="text-input" placeholder="Talked about fintech" />
          </div>
        </details>
      </div>
      <button className="primary-button" type="button" disabled>
        Save
      </button>
      <section className="support-card">
        <p className="support-card__title">Fast capture, light review</p>
        <p>
          The MVP starts on Capture so saving a name feels like the default action, not a side
          task.
        </p>
      </section>
    </section>
  );
}

