type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div aria-modal="true" className="dialog-card" role="dialog" aria-labelledby="dialog-title">
        <p className="section-kicker">Confirm action</p>
        <h2 id="dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="primary-button primary-button--danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

