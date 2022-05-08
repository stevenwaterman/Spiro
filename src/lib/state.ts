import { get_store_value, identity } from "svelte/internal";
import { derived, writable, type Writable } from "svelte/store";
import type { NodeConfig, Placement } from "./types";

export const nodeStoresWrapped: Writable<Record<string, Writable<NodeConfig>>> = writable({});
let nodeStores: Record<string, Writable<NodeConfig>> = {};
nodeStoresWrapped.subscribe(s => nodeStores = s);


export function getNodeStore(id: string): Writable<NodeConfig> {
  return nodeStores[id];
}

export const anchorIdStore: Writable<string | undefined> = writable(undefined);
export const selectionStore: Writable<string | undefined> = writable(undefined);

export const duration = 5;
export const fraction = 1;
export const showStore = derived(selectionStore, selection => selection === undefined);


let oldAnchor: string | undefined = undefined;
anchorIdStore.subscribe(anchor => {
  if (oldAnchor !== undefined) {
    removePieceInner(oldAnchor);
  }

  if (anchor !== undefined) {
    const nodeStore = getNodeStore(anchor);
    nodeStore.update(config => ({
      ...config,
      placement: {
        phase: 0,
        path: [],
        children: {},
        parent: undefined
      }
    }));
  }

  oldAnchor = anchor;
})

derived([anchorIdStore, selectionStore], identity).subscribe(([anchor, selection]) => {
  if (anchor === undefined && selection !== undefined) {
    anchorIdStore.set(selection);
    selectionStore.set(undefined);
  }
});

export function placeSelection(parentId: string, childId: string, idx: number) {
  const parentStore = getNodeStore(parentId);
  const childStore = getNodeStore(childId);

  parentStore.update(parentConf => {
    const parentPlacement = parentConf.placement as Placement;
    const parentPath = parentPlacement.path;

    childStore.update(childConf => ({
      ...childConf,
      placement: {
        path: [...parentPath, idx],
        phase: 0,
        children: {},
        parent: parentConf.id
      }
    }));

    parentPlacement.children[idx] = childId;
    return parentConf;
  });
}

export function removePiece(id: string) {
  const store = getNodeStore(id);
  const conf = get_store_value(store);
  const placement = conf.placement;
  if (placement !== undefined) {
    if (placement.parent === undefined) {
      anchorIdStore.set(undefined);
    } else {
      const { path, parent } = placement;
      const idx = path[path.length - 1];
      const parentStore = getNodeStore(parent);
      parentStore.update(parentConf => {
        delete parentConf.placement?.children?.[idx];
        return parentConf;
      })
    }
  }
  removePieceInner(id);
}

function removePieceInner(id: string) {
  getNodeStore(id).update(conf => {
    const placement = conf.placement;
    if (placement !== undefined) {
      const children = Object.values(placement.children);
      children.forEach(child => removePieceInner(child));
    }
    delete conf.placement;
    return conf;
  })
}