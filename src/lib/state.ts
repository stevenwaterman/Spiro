import { get_store_value, identity } from "svelte/internal";
import { derived, writable, type Readable, type Writable } from "svelte/store";
import type { NodeConfig, Placement } from "./types";

export const nodeStores: Record<string, Writable<NodeConfig>> = {};
export const anchorIdStore: Writable<string | undefined> = writable(undefined);

export const duration = 5;
export const fraction = 1;
export const showStore: Writable<boolean> = writable(false);

const a: Writable<NodeConfig> = writable({
  id: "A",
  nodeType: "ARM",
  properties: {
    length: 5,
    rate: 1,
    color: "red"
  }
});
nodeStores["A"] = a;

const b: Writable<NodeConfig> = writable({
  id: "B",
  nodeType: "PEN",
  properties: {
    color: "teal",
  }
});
nodeStores["B"] = b;

const c: Writable<NodeConfig> = writable({
  id: "C",
  nodeType: "ARM",
  properties: {
    length: 6,
    rate: -2,
    color: "orange"
  }
});
nodeStores["C"] = c;

const d: Writable<NodeConfig> = writable({
  id: "D",
  nodeType: "ARM",
  properties: {
    length: 3,
    rate: 3,
    color: "green"
  }
});
nodeStores["D"] = d;

const e: Writable<NodeConfig> = writable({
  id: "E",
  nodeType: "PEN",
  properties: {
    color: "pink",
  }
});
nodeStores["E"] = e;

export const allNodeStores: Readable<NodeConfig[]> = derived([a,b,c,d,e], i=>i);

export const selectionStore: Writable<string | undefined> = writable(undefined);

let oldAnchor: string | undefined = undefined;
anchorIdStore.subscribe(anchor => {
  if (oldAnchor !== undefined) {
    removePieceInner(oldAnchor);
  }

  if (anchor !== undefined) {
    const nodeStore = nodeStores[anchor];
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
  const parentStore = nodeStores[parentId];
  const childStore = nodeStores[childId];

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
  const store = nodeStores[id];
  const conf = get_store_value(store);
  const placement = conf.placement;
  if (placement !== undefined) {
    if (placement.parent === undefined) {
      anchorIdStore.set(undefined);
    } else {
      const { path, parent } = placement;
      const idx = path[path.length - 1];
      const parentStore = nodeStores[parent];
      parentStore.update(parentConf => {
        delete parentConf.placement?.children?.[idx];
        return parentConf;
      })
    }
  }
  removePieceInner(id);
}

function removePieceInner(id: string) {
  nodeStores[id].update(conf => {
    const placement = conf.placement;
    if (placement !== undefined) {
      const children = Object.values(placement.children);
      children.forEach(child => removePieceInner(child));
    }
    delete conf.placement;
    return conf;
  })
}
