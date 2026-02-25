import { useState, useEffect, useRef } from 'react';

export default function SaveCohortModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const nameRef = useRef(null);

  // Focus name input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), desc.trim());
  }

  return (
    <div
      className="cb-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="cb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-modal-title"
      >
        <h2 id="cb-modal-title" className="cb-modal-title">Save Cohort as</h2>

        <form onSubmit={handleSave}>
          <div className="cb-modal-field">
            <label className="cb-modal-label" htmlFor="cohort-name">
              COHORT NAME <span className="cb-modal-required">*</span>
            </label>
            <input
              ref={nameRef}
              id="cohort-name"
              className="cb-modal-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Premature males < 28 weeks"
              required
            />
          </div>

          <div className="cb-modal-field">
            <label className="cb-modal-label" htmlFor="cohort-desc">
              DESCRIPTION <span className="cb-modal-optional">(optional)</span>
            </label>
            <textarea
              id="cohort-desc"
              className="cb-modal-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Describe the purpose of this cohort…"
            />
          </div>

          <div className="cb-modal-actions">
            <button
              className="cb-modal-cancel-btn"
              type="button"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              className="cb-modal-save-btn"
              type="submit"
              disabled={!name.trim()}
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
