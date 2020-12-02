export const toMapById = <T extends { id: any }>(arr: T[]): Map<T['id'], T> => new Map(arr.map(elem => [elem.id, elem]));
export const toMapBy=  <T, K extends keyof T>(arr: T[], key: K): Map<T[K], T> => new Map(arr.map(elem => [elem[key], elem]));
export const toMapArrBy = <T, K extends keyof T>(arr: T[], key: K): Map<T[K], T[]> => {
  const result: Map<T[K], T[]> = new Map();
  arr.forEach(item => {
    const match = result.get(item[key]);
    if (match) { match.push(item); }
    else { result.set(item[key], [item]); }
  });
  return result;
}