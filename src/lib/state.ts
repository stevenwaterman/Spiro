import { identity } from "svelte/internal";
import { derived, writable, type Writable } from "svelte/store";
import type { NodeConfig, Placement } from "./types";

export const nodesConfigStore: Writable<Record<string, NodeConfig>> = writable({});
let nodesConfig: Record<string, NodeConfig>;
nodesConfigStore.subscribe(s => nodesConfig = s);

export const anchorIdStore: Writable<string | undefined> = writable(undefined);
export const selectionStore: Writable<string | undefined> = writable(undefined);

export const durationStore: Writable<number> = writable(3);
export const fraction = 1;
export const showStore = derived(selectionStore, selection => selection === undefined);

let oldAnchor: string | undefined = undefined;
anchorIdStore.subscribe(anchor => {
  nodesConfigStore.update(record => {
    if (oldAnchor !== undefined) {
      removePieceInner(record, oldAnchor);
    }
  
    if (anchor !== undefined) {
      const node = nodesConfig[anchor];
      node.placement = {
        phase: 0,
        path: [],
        children: {},
        parent: undefined
      }
    }
  
    oldAnchor = anchor;
    return record;
  });
});

derived([anchorIdStore, selectionStore], identity).subscribe(([anchor, selection]) => {
  if (anchor === undefined && selection !== undefined) {
    anchorIdStore.set(selection);
    selectionStore.set(undefined);
  }
});

export function placeSelection(parentId: string, childId: string, idx: number) {
  nodesConfigStore.update(record => {
    const parent = record[parentId];
    const child = record[childId];

    const parentPlacement = parent.placement as Placement;
    const parentPath = parentPlacement.path;

    child.placement = {
      path: [...parentPath, idx],
      phase: 0,
      children: {},
      parent: parent.id
    };

    parentPlacement.children[idx] = childId;
    return record;
  });
}

export function removePiece(id: string) {
  nodesConfigStore.update(record => {
    const child = record[id];
    const placement = child.placement;
    if (placement !== undefined) {
      if (placement.parent === undefined) {
        anchorIdStore.set(undefined);
      } else {
        const { path, parent } = placement;
        const idx = path[path.length - 1];
        const parentConf = record[parent];
        delete parentConf.placement?.children?.[idx];
      }
    }
    return removePieceInner(record, id);
  });
}

function removePieceInner(record: Record<string, NodeConfig>, id: string): Record<string, NodeConfig> {
  const conf = record[id];
  const placement = conf.placement;
  if (placement !== undefined) {
    const children = Object.values(placement.children);
    children.forEach(child => removePieceInner(record, child));
  }
  delete conf.placement;
  return record;
}