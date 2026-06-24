import type { TodoDataset } from "@repo/demo/todo";

/** Field-level op — Actual Budget message shape. */
export type FieldMessage = {
  dataset: TodoDataset | string;
  row: string;
  column: string;
  value: unknown;
  timestamp: string;
};

export function isTombstone(message: FieldMessage): boolean {
  return message.column === "tombstone";
}
