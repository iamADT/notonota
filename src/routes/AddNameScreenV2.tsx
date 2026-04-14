import { useMemo, useState } from "react";
import { SuccessToast } from "../components/SuccessToast";
import { createPerson, findDuplicateByName } from "../db/people";
import { formatDateTime } from "../lib/format";

const initialForm = {
  name: "",
  memorableThing: "",
  whereMet: "",
  anotherDetail: ""
};

const detailPrompts = [
  {
    key: "memorableThing",
    optionLabel: "Add memorable thing",
    promptLabel: "What stands out about them?",
    inputLabel: "Memorable thing",
    placeholder: "Round glasses"
  },
  {
    key: "whereMet",
    optionLabel: "Add where you met",
    promptLabel: "Where did you meet?",
    inputLabel: "Where you met",
    placeholder: "Design meetup"
  },
  {
    key: "anotherDetail",
    optionLabel: "Add another detail",
    promptLabel: "What else do you want to remember?",
    inputLabel: "Another detail",
    placeholder: "Talked about fintech"
  }
] as const;

type DetailField = (typeof detailPrompts)[number]["key"];

export function AddNameScreenV2() {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [warning, setWarning] = useState<{ name: string; createdAt: string } | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [activeDetail, setActiveDetail] = useState<DetailField | null>(null);
  const [isNameCommitted, setIsNameCommitted] = useState(false);

  const trimmedName = form.name.trim();
  const availablePrompts = useMemo(
    () => detailPrompts.filter((prompt) => !form[prompt.key].trim()),
    [form]
  );

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setWarning(null);
  }

  function resetDraft() {
    setForm(initialForm);
    setActiveDetail(null);
    setIsNameCommitted(false);
    setWarning(null);
  }

  function commitName() {
    if (!trimmedName) {
      return;
    }

    setIsNameCommitted(true);
    setActiveDetail(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function reopenNameEditor() {
    setIsNameCommitted(false);
    setActiveDetail(null);
  }

  function commitDetail() {
    if (!activeDetail || !form[activeDetail].trim()) {
      return;
    }

    setActiveDetail(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleNext() {
    if (!isNameCommitted) {
      if (trimmedName) {
        commitName();
      }
      return;
    }

    if (activeDetail) {
      if (form[activeDetail].trim()) {
        commitDetail();
      }
      return;
    }

    const nextPrompt = availablePrompts[0];

    if (nextPrompt) {
      setActiveDetail(nextPrompt.key);
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
      resetDraft();
      setToastMessage(`Saved ${savedEntry.name}`);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="screen-stack add-name-v2">
      {toastMessage ? <SuccessToast message={toastMessage} onDismiss={() => setToastMessage("")} /> : null}

      <div className="hero-card add-name-v2__shell">
        <div className="add-name-v2__story">
          <section className="add-name-v2__bubble">
            <p className="section-kicker">Step 1</p>
            <p className="add-name-v2__prompt">Who did you meet?</p>
            {isNameCommitted ? (
              <button className="add-name-v2__response" type="button" onClick={reopenNameEditor}>
                <span className="section-kicker">Name</span>
                <strong>{trimmedName}</strong>
              </button>
            ) : (
              <form
                className="field-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  commitName();
                }}
              >
                <label className="field-label" htmlFor="add-name-v2-input">
                  Name
                </label>
                <div className="add-name-v2__input-row">
                  <input
                    id="add-name-v2-input"
                    className="name-input add-name-v2__text-entry"
                    name="name"
                    placeholder="Type a name"
                    autoFocus
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  <button
                    className="add-name-v2__submit"
                    type="submit"
                    aria-label="Confirm name"
                    disabled={!trimmedName}
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}
          </section>

          {isNameCommitted ? (
            <>
              {detailPrompts
                .filter((prompt) => form[prompt.key].trim())
                .map((prompt) => (
                  <button
                    key={prompt.key}
                    className="add-name-v2__response"
                    type="button"
                    onClick={() => setActiveDetail(prompt.key)}
                  >
                    <span className="section-kicker">{prompt.optionLabel}</span>
                    <strong>{form[prompt.key].trim()}</strong>
                  </button>
                ))}

              {availablePrompts.length ? (
                <section className="add-name-v2__bubble">
                  <p className="section-kicker">Step 2</p>
                  <p className="add-name-v2__prompt">What do you want to remember about {trimmedName}?</p>
                  <div className="add-name-v2__choices" role="list" aria-label="Detail prompts">
                    {availablePrompts.map((prompt) => (
                      <button
                        key={prompt.key}
                        className={
                          activeDetail === prompt.key
                            ? "secondary-button add-name-v2__choice add-name-v2__choice--active"
                            : "secondary-button add-name-v2__choice"
                        }
                        type="button"
                        onClick={() => setActiveDetail(prompt.key)}
                      >
                        {prompt.optionLabel}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>

        {activeDetail || isNameCommitted ? (
          <div className="add-name-v2__composer">
            {activeDetail ? (
              <form
                className="field-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  commitDetail();
                }}
              >
                <label className="field-label" htmlFor={`detail-input-${activeDetail}`}>
                  {detailPrompts.find((prompt) => prompt.key === activeDetail)?.inputLabel}
                </label>
                <div className="add-name-v2__input-row">
                  <input
                    id={`detail-input-${activeDetail}`}
                    className="text-input add-name-v2__text-entry"
                    placeholder={detailPrompts.find((prompt) => prompt.key === activeDetail)?.placeholder}
                    value={form[activeDetail]}
                    onChange={(event) => updateField(activeDetail, event.target.value)}
                  />
                  <button
                    className="add-name-v2__submit"
                    type="submit"
                    aria-label={`Confirm ${detailPrompts.find((prompt) => prompt.key === activeDetail)?.inputLabel}`}
                    disabled={!form[activeDetail].trim()}
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            ) : (
              <p className="empty-state">Choose a prompt to add a detail for {trimmedName}.</p>
            )}
          </div>
        ) : null}

        <div className="add-name-v2__actions">
          <div className="add-name-v2__actions-row">
            <button
              className="primary-button"
              type="button"
              disabled={!trimmedName || isSaving}
              onClick={() => void persistEntry()}
            >
              Save
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={
                !trimmedName ||
                (isNameCommitted && (activeDetail ? !form[activeDetail].trim() : availablePrompts.length === 0))
              }
              onClick={handleNext}
            >
              Next
            </button>
          </div>
          <button className="text-button add-name-v2__delete" type="button" onClick={resetDraft}>
            Delete
          </button>
        </div>
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
    </section>
  );
}
