import { useRef, useState } from "react";
import { SuccessToast } from "../components/SuccessToast";
import { createPerson, findDuplicateByName } from "../db/people";
import { formatDateTime } from "../lib/format";

const initialForm = {
  name: "",
  memorableThing: "",
  whereMet: "",
  anotherDetail: ""
};

export function CaptureScreen() {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [warning, setWarning] = useState<{ name: string; createdAt: string } | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const trimmedName = form.name.trim();

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setWarning(null);
  }

  function resetCaptureForm() {
    setForm(initialForm);
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  async function persistEntry(forceDuplicateSave = false) {
    if (!trimmedName || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      if (!forceDuplicateSave) {
        const duplicate = await findDuplicateByName(trimmedName);

        if (duplicate) {
          setWarning({
            name: duplicate.name,
            createdAt: duplicate.createdAt
          });
          return;
        }
      }

      const savedEntry = await createPerson(form);
      resetCaptureForm();
      setToastMessage(`Saved ${savedEntry.name}`);
      setWarning(null);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="screen-stack">
      {toastMessage ? <SuccessToast message={toastMessage} onDismiss={() => setToastMessage("")} /> : null}

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
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <details className="details-card" ref={detailsRef}>
          <summary>Add more details</summary>
          <div className="details-card__body">
            <label className="field-label" htmlFor="memorable-thing">
              Add memorable thing
            </label>
            <input
              id="memorable-thing"
              className="text-input"
              placeholder="Round glasses"
              value={form.memorableThing}
              onChange={(event) => updateField("memorableThing", event.target.value)}
            />
            <label className="field-label" htmlFor="where-met">
              Add where you met
            </label>
            <input
              id="where-met"
              className="text-input"
              placeholder="Design meetup"
              value={form.whereMet}
              onChange={(event) => updateField("whereMet", event.target.value)}
            />
            <label className="field-label" htmlFor="another-detail">
              Add another detail
            </label>
            <input
              id="another-detail"
              className="text-input"
              placeholder="Talked about fintech"
              value={form.anotherDetail}
              onChange={(event) => updateField("anotherDetail", event.target.value)}
            />
          </div>
        </details>
      </div>

      {warning ? (
        <section className="warning-card">
          <p className="support-card__title">Possible duplicate</p>
          <p>
            {warning.name} was already saved on {formatDateTime(warning.createdAt)}.
          </p>
          <button className="secondary-button" type="button" onClick={() => void persistEntry(true)}>
            Save anyway
          </button>
        </section>
      ) : null}

      <button
        className="primary-button"
        type="button"
        disabled={!trimmedName || isSaving}
        onClick={() => void persistEntry()}
      >
        Save
      </button>
    </section>
  );
}
