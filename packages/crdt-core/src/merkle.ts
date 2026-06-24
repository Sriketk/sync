/**
 * Merkle radix trie for sync divergence — port from Actual / crdt-example-app.
 */

export type TrieNode = {
  "0"?: TrieNode;
  "1"?: TrieNode;
  "2"?: TrieNode;
  hash?: number;
};

export function emptyTrie(): TrieNode {
  return { hash: 0 };
}

/** Placeholder — insert timestamp hash into trie. */
export function insertTimestamp(_trie: TrieNode, _timestamp: string): TrieNode {
  return _trie;
}

/** Placeholder — return millis since divergence, or null if in sync. */
export function diff(_local: TrieNode, _remote: TrieNode): number | null {
  return null;
}
