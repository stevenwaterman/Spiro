import { derived, writable, type Readable, type Writable } from "svelte/store";
import type { NodeConfig } from "./types";

export const nodeLookupStore: Writable<Record<string, NodeConfig>> = writable({
  "A": {
    id: "A",
    type: "ARM",
    parent: undefined,

    length: 1,
    rate: 0,
    color: "red",
    phase: 0,
  }
});

// let nodeLookup: Record<string, NodeConfig>;
// nodeLookupStore.subscribe(map => nodeLookup = map);

export const selectionStore: Writable<string | undefined> = writable(undefined);
export const selectedAnchorStore: Readable<string | undefined> = derived(
  [nodeLookupStore, selectionStore],
  ([nodeLookup, selection]) => {
    if (selection === undefined) return undefined;
    let node = nodeLookup[selection];
    while (node.parent !== undefined) {
      node = nodeLookup[node.parent.id];
    }
    return node.id;
  }
);

export const fraction = 1;

export const showStore = derived(selectionStore, selection => selection === undefined);

// let oldAnchor: string | undefined = undefined;
// anchorIdStore.subscribe(anchor => {
//   nodesConfigStore.update(record => {
//     if (oldAnchor !== undefined) {
//       removePieceInner(record, oldAnchor);
//     }
  
//     if (anchor !== undefined) {
//       const node = nodesConfig[anchor];
//       node.placement = {
//         phase: 0,
//         path: [],
//         children: {},
//         parent: undefined
//       }
//     }
  
//     oldAnchor = anchor;
//     return record;
//   });
// });

// derived([anchorIdStore, selectionStore], identity).subscribe(([anchor, selection]) => {
//   if (anchor === undefined && selection !== undefined) {
//     anchorIdStore.set(selection);
//     selectionStore.set(undefined);
//   }
// });

export function placeSelection(parentId: string, childId: string, idx: number) {
  nodeLookupStore.update(record => {
    const child = record[childId];
    child.parent = { id: parentId, idx };
    return record;
  });
}

export function removePiece(id: string) {
  nodeLookupStore.update(record => {
    record[id].parent = undefined;
    return record;
    // Object.values(record).forEach(conf => {
    //   if (conf.nodeType === "ARM") {
    //     for (let i = 0; i < conf.length; i++) {
    //       if (conf.children[i] === id) {
    //         delete conf.children[i];
    //       }
    //     }
    //   }
    // });
    // return record;
  });
}

// function removePieceInner(record: Record<string, NodeConfig>, id: string): Record<string, NodeConfig> {
//   const conf = record[id];
//   const placement = conf.placement;
//   if (placement !== undefined) {
//     const children = Object.values(placement.children);
//     children.forEach(child => removePieceInner(record, child));
//   }
//   delete conf.placement;
//   return record;
// }
