import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { deletePerson, getPerson, updatePerson } from "../db/people";

const initialForm = {
  name: "",
  memorableThing: "",
  whereMet: "",
  anotherDetail: ""
};

export function EditPersonScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const person = useLiveQuery(async () => (id ? (await getPerson(id)) ?? null : null), [id]);
  const [form, setForm] = useState(initialForm);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (!person) {
      return;
    }

    setForm({
      name: person.name,
      memorableThing: person.memorableThing,
      whereMet: person.whereMet,
      anotherDetail: person.anotherDetail
    });
  }, [person]);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSave() {
    if (!id || !form.name.trim()) {
      return;
    }

    await updatePerson(id, form);
    navigate(`/person/${id}`);
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    await deletePerson(id);
    navigate("/saved");
  }

  if (person === undefined) {
    return (
      <section className="screen-stack">
        <article className="detail-card">
          <p className="section-kicker">Edit entry</p>
          <h2>Loading...</h2>
        </article>
      </section>
    );
  }

  if (!person) {
    return (
      <section className="screen-stack">
        <article className="detail-card">
          <p className="section-kicker">Edit entry</p>
          <h2>Entry not found</h2>
          <p>This person was deleted or does not exist in local storage.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="screen-stack">
      <form className="detail-card">
        <div className="list-card__header">
          <p className="section-kicker">Edit entry</p>
          <h2>Update details</h2>
        </div>
        <div className="form-grid">
          <div className="field-stack">
            <label className="field-label" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              className="text-input"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="edit-memorable-thing">
              Add memorable thing
            </label>
            <input
              id="edit-memorable-thing"
              className="text-input"
              value={form.memorableThing}
              onChange={(event) => updateField("memorableThing", event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="edit-where-met">
              Add where you met
            </label>
            <input
              id="edit-where-met"
              className="text-input"
              value={form.whereMet}
              onChange={(event) => updateField("whereMet", event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="edit-another-detail">
              Add another detail
            </label>
            <input
              id="edit-another-detail"
              className="text-input"
              value={form.anotherDetail}
              onChange={(event) => updateField("anotherDetail", event.target.value)}
            />
          </div>
        </div>
        <div className="edit-actions">
          <button className="primary-button" type="button" disabled={!form.name.trim()} onClick={() => void handleSave()}>
            Save changes
          </button>
          <button className="text-button text-button--danger" type="button" onClick={() => setShowConfirmDelete(true)}>
            Delete entry
          </button>
        </div>
      </form>
      {showConfirmDelete ? (
        <ConfirmDialog
          title="Delete this entry?"
          body="This deletion cannot be undone. The saved person and review history will be removed from this device."
          confirmLabel="Delete forever"
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
    </section>
  );
}
