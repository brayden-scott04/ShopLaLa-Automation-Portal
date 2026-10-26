/**
 * Feature switches for parts of the portal that are built but not ready for staff.
 * A disabled feature keeps its code but is hidden from the sidebar and 404s on direct visit.
 */

/** AI chat (`/chat`). Off while the assistant isn't working; set to `true` to bring it back. */
export const CHAT_ENABLED = false;
