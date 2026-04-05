import type { RefObject } from "react";

export type ScrollSyncRefs = {
  writeRef: RefObject<HTMLElement>;
  previewRef: RefObject<HTMLElement>;
};

/**
 * Creates bidirectional scroll sync handlers with a rAF mutex to prevent
 * the ping-pong effect where each scroll event triggers the other listener.
 *
 * The mutex resets via requestAnimationFrame (NOT setTimeout) — this lets
 * the next genuine user scroll be processed while still blocking the
 * programmatic scroll that just fired.
 */
export function createScrollSyncHandlers(refs: ScrollSyncRefs) {
  let isSyncing = false;

  function syncFromWrite() {
    if (isSyncing) return;
    const write = refs.writeRef.current;
    const preview = refs.previewRef.current;
    if (!write || !preview) return;

    isSyncing = true;
    const ratio = write.scrollTop / (write.scrollHeight - write.clientHeight);
    preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    requestAnimationFrame(() => { isSyncing = false; });
  }

  function syncFromPreview() {
    if (isSyncing) return;
    const write = refs.writeRef.current;
    const preview = refs.previewRef.current;
    if (!write || !preview) return;

    isSyncing = true;
    const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    write.scrollTop = ratio * (write.scrollHeight - write.clientHeight);
    requestAnimationFrame(() => { isSyncing = false; });
  }

  return { syncFromWrite, syncFromPreview };
}
