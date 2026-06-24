import type { Doc } from "./types";

/** Shared seed doc for Yjs / Automerge demos. */
export const seedDoc: Doc = {
  id: "doc-1",
  title: "Collaborative note",
  content:
    "Edit this paragraph from two tabs to see how each engine merges concurrent text.",
};
