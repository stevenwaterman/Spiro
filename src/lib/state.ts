import { derived, writable, type Readable, type Writable } from "svelte/store";
import type { NodeConfig } from "./types";

export const nodeStores: Record<string, Writable<NodeConfig>> = {};
export const anchorIdStore: Writable<string | undefined> = writable(undefined);
export const selectionStore: Writable<string | undefined> = writable(undefined);

export const duration = 5;
export const fraction = 1;
export const showStore: Writable<boolean> = writable(false);

const a: Writable<NodeConfig> = writable({
  id: "A",
  nodeType: "ARM",
  properties: {
    length: 5,
    rate: 1,
    color: "lightcoral"
  }
});
nodeStores["A"] = a;

const b: Writable<NodeConfig> = writable({
  id: "B",
  nodeType: "PEN",
  properties: {
    color: "black",
  }
});
nodeStores["B"] = b;

const c: Writable<NodeConfig> = writable({
  id: "C",
  nodeType: "ARM",
  properties: {
    length: 6,
    rate: -2,
    color: "yellow"
  }
});
nodeStores["C"] = c;

export const allNodeStores: Readable<NodeConfig[]> = derived([a,b,c], i=>i);

// TODO handle adding / removing nodes and propagating through them to set placement properties on children too / set that up to be derived functionally