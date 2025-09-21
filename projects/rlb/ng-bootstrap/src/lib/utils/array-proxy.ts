export function createArrayProxy<T>(backingArray: T[], values: T[]): T[] {
  return new Proxy(backingArray, {
    get(target: T[], prop: string | number | symbol, receiver) {
      return target.includes(values[Number(prop)]);
    },
    set(target: T[], prop: string | number | symbol, value: T, receiver) {
      if (value) {
        if (!target.includes(values[Number(prop)])) {
          target.push(values[Number(prop)]);
        }
      } else {
        target.splice(target.indexOf(values[Number(prop)]), 1);
      }
      return true;
    },
  });
}