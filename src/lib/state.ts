import { derived, writable, type Readable, type Writable } from "svelte/store";
import { isSecondaryPos, type NodeConfig } from "./types";

export const nodeLookupStore: Writable<Record<string, NodeConfig>> = writable({
  "A": {
    id: "A",
    type: "ARM",
    parent: {type: "PRIMARY"},

    length: 1,
    rate: 0,
    color: "red",
    phase: 0,
  }
});

export const selectionStore: Writable<string | undefined> = writable(undefined);
export const selectedAnchorStore: Readable<string | undefined> = derived(
  [nodeLookupStore, selectionStore],
  ([nodeLookup, selection]) => {
    if (selection === undefined) return undefined;

    let node: NodeConfig = nodeLookup[selection];
    while (node.parent.type === "PARENT") {
      node = nodeLookup[node.parent.id];
    }
    return node.id;
  }
);

export const fraction = 1;

export const showStore: Writable<boolean> = writable(false);
selectionStore.subscribe(selection => {
  if (selection !== undefined) showStore.set(false);
});

export function placeSelection(parentId: string, childId: string, idx: number) {
  nodeLookupStore.update(record => {
    const child = record[childId];
    child.parent = { type: "PARENT", id: parentId, idx };
    return record;
  });
}

export function removePiece(id: string) {
  nodeLookupStore.update(record => {
    record[id].parent = {type: "SECONDARY", left: 0, top: 0};
    return record;
  });
}

export function updateSecondaryLocation(id: string | undefined, event: MouseEvent) {
  if (id === undefined) return;

  const left = 100 * event.clientX / window.innerWidth;
  const top = 100 * event.clientY / window.innerHeight;

  nodeLookupStore.update(nodes => {
    const node = nodes[id];
    if (!isSecondaryPos(node)) return nodes;
    
    node.parent.left = left;
    node.parent.top = top;
    
    return nodes;
  })
}
