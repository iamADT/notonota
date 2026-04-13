export function EditPersonScreen() {
  return (
    <section className="screen-stack">
      <form className="detail-card">
        <div className="list-card__header">
          <p className="section-kicker">Edit entry</p>
          <h2>Update details</h2>
        </div>
        <label className="field-label" htmlFor="edit-name">
          Name
        </label>
        <input id="edit-name" className="text-input" defaultValue="Maya" />
        <label className="field-label" htmlFor="edit-memorable-thing">
          Add memorable thing
        </label>
        <input id="edit-memorable-thing" className="text-input" defaultValue="Round glasses" />
        <label className="field-label" htmlFor="edit-where-met">
          Add where you met
        </label>
        <input id="edit-where-met" className="text-input" defaultValue="Design meetup" />
        <label className="field-label" htmlFor="edit-another-detail">
          Add another detail
        </label>
        <input
          id="edit-another-detail"
          className="text-input"
          defaultValue="Talked about fintech APIs"
        />
        <div className="edit-actions">
          <button className="primary-button" type="button">
            Save changes
          </button>
          <button className="text-button text-button--danger" type="button">
            Delete entry
          </button>
        </div>
      </form>
    </section>
  );
}

