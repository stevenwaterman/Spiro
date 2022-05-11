import { type Readable, type Unsubscriber, derived } from "svelte/store";

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

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}