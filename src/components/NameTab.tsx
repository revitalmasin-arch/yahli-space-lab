import { useState } from 'react';
import { useStore } from '../progress/store';

/** Header tab: shows the learner's name, or lets them add / change it. Stored on this device only. */
export function NameTab() {
  const { progress, update, readOnly } = useStore();
  const name = progress.settings.learnerName ?? '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  if (editing) {
    const save = () => {
      const v = draft.trim().slice(0, 30);
      update((p) => {
        if (v) p.settings.learnerName = v;
        else delete p.settings.learnerName;
      });
      setEditing(false);
    };
    return (
      <form className="name-tab row" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <label className="row">
          <span className="small-text">שֵׁם · Name</span>
          <input type="text" value={draft} maxLength={30} autoFocus onChange={(e) => setDraft(e.target.value)} data-testid="name-input" dir="auto" />
        </label>
        <button type="submit" className="small primary" data-testid="name-save">Save · שְׁמִירָה</button>
        <button type="button" className="small ghost" onClick={() => { setDraft(name); setEditing(false); }}>Cancel</button>
      </form>
    );
  }
  return (
    <button type="button" className="small name-tab" disabled={readOnly} onClick={() => { setDraft(name); setEditing(true); }} data-testid="name-tab">
      👩‍🚀 {name ? <span dir="auto">{name}</span> : 'Add your name · הוֹסֵף שֵׁם'}
    </button>
  );
}
