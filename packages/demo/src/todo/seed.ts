import type { Todo } from "./types";

/** Shared seed data — same IDs across row-sync engine demos. */
export const seedTodos: Todo[] = [
  {
    id: "todo-1",
    title: "Compare sync engines",
    done: false,
    category: "learning",
  },
  {
    id: "todo-2",
    title: "Implement Actual-style field CRDT",
    done: false,
    category: "diy",
  },
  {
    id: "todo-3",
    title: "Wire Yjs doc demo",
    done: true,
    category: "document",
  },
];
