import { useStore } from '../progress/store';

// Shown to the adult only when something about stored progress needs attention.
export function StorageNotice() {
  const { status, readOnly, storedSchema } = useStore();
  if (status === 'newer-schema') {
    return (
      <div className="notice warn" role="status" data-testid="notice-readonly">
        <strong>Progress is protected (read-only).</strong> It was saved by a newer version of the app (data version {storedSchema}).
        This version will not change it. Ask the parent to switch back to the newer release, or export a backup from the parent area.
      </div>
    );
  }
  if (status === 'storage-unavailable') {
    return (
      <div className="notice warn" role="status" data-testid="notice-nostorage">
        This browser is not allowing the app to save progress (private window or blocked site data). Learning works, but progress will not be kept.
      </div>
    );
  }
  if (status === 'quarantined' || status === 'repaired') {
    return (
      <div className="notice" role="status" data-testid="notice-quarantine">
        Some saved progress could not be read. A copy was kept safely (nothing was deleted) and can be downloaded from the parent area.
      </div>
    );
  }
  if (readOnly) {
    return (
      <div className="notice warn" role="status" data-testid="notice-readonly">
        Another window is running a newer version of the app. This window has stopped saving so it cannot overwrite anything.
      </div>
    );
  }
  return null;
}
