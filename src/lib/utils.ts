import { writable, type Writable, type Readable, type Unsubscriber, derived } from "svelte/store";
import type { NodeConfig } from "./types";

// export function unwrapStore<T, INNER extends Readable<T | null>>(store_2: Readable<INNER | null>, equality: (a: T, b: T) => boolean = (a, b) => a === b): Readable<T | null> {
//   let value: T | null = null;
//   const output: Writable<T | null> = writable(null);
//   let unsubscribe: () => void = () => { };
//   store_2.subscribe((store: INNER | null) => {
//     unsubscribe();
//     if (store !== null) {
//       unsubscribe = store.subscribe((state: T | null) => {
//         if (
//           (value === null && state !== null) ||
//           (value !== null && state === null) ||
//           (value !== null && state !== null && !equality(value, state))
//         ) {
//           value = state;
//           output.set(state);
//         }
//       })
//     } else {
//       unsubscribe = () => { };
//       value = null;
//       output.set(null);
//     }
//   });
//   return output;
// }

export function deriveUnwrapRecord<K extends string | number | symbol, V, INNER extends Readable<V | undefined>>(
  store_2: Readable<Record<K, INNER>>, 
): Readable<Partial<Record<K, V>>> {
  const unsubscribers: Partial<Record<K, Unsubscriber>> = {};
  const record: Partial<Record<K, V>> = {};
  return derived(store_2, (values: Record<K, INNER>, set: (val: Partial<Record<K, V>>) => void) => {
    const newKeys = Object.keys(values) as K[];
    const oldKeys = Object.keys(record) as K[];

    const keysToSubscribe: K[] = newKeys.filter(newKey => record[newKey] === undefined);
    const keysToUnsubscribe: K[] = oldKeys.filter(oldKey => values[oldKey] === undefined);

    keysToSubscribe.forEach(key => {
      const innerStore: INNER = values[key];
      let firstRun = true;
      const unsubscribe = innerStore.subscribe(innerValue => {
        record[key] = innerValue;
        if (firstRun) {
          firstRun = false;
        } else {
          set(record)
        }
      });
      unsubscribers[key] = unsubscribe;
    });

    keysToUnsubscribe.forEach(key => {
      const unsubscriber = unsubscribers[key];
      if (unsubscriber !== undefined) unsubscriber();
      delete unsubscribers[key];
      delete record[key];
    });
    set(record);
  }, {});
}
