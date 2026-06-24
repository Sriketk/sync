import type { FieldMessage } from "./message";

export type CellKey = `${string}:${string}:${string}`;

export type FieldStore = {
  cells: Map<CellKey, FieldMessage>;
  apply(message: FieldMessage): void;
  get(dataset: string, row: string, column: string): unknown | undefined;
};

function cellKey(dataset: string, row: string, column: string): CellKey {
  return `${dataset}:${row}:${column}`;
}

/** LWW per (dataset, row, column) — conflict rule from Actual. */
export function createFieldStore(): FieldStore {
  const cells = new Map<CellKey, FieldMessage>();

  return {
    cells,
    apply(message) {
      const key = cellKey(message.dataset, message.row, message.column);
      const existing = cells.get(key);
      if (!existing || message.timestamp > existing.timestamp) {
        cells.set(key, message);
      }
    },
    get(dataset, row, column) {
      return cells.get(cellKey(dataset, row, column))?.value;
    },
  };
}
