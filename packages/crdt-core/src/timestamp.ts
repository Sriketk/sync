/**
 * Actual-style hybrid logical clock — port from jlongster/crdt-example-app.
 * @see https://archive.jlongster.com/using-crdts-in-the-wild
 */

export type TimestampString = string;

export type ClockState = {
  millis: number;
  counter: number;
  node: string;
};

/** Placeholder — implement send/recv per HLC paper. */
export function createNodeId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(-16);
}

export function initClock(node: string = createNodeId()): ClockState {
  return { millis: 0, counter: 0, node };
}

export function formatTimestamp(state: ClockState): TimestampString {
  return [
    new Date(state.millis).toISOString(),
    state.counter.toString(16).padStart(4, "0").toUpperCase(),
    state.node.padStart(16, "0").slice(-16),
  ].join("-");
}
