import httpErrors from 'http-errors';
import { EnvServiceSingleton } from '../environment/env';

const ignoreAlways = new Set([ 'name', 'message', 'statusCode', ]);
const ignoreProduction = new Set([ 'stack', 'trace', ]);

/**
 * Transform an exception to a plain json object
 */
export function exceptionToJson(exception: httpErrors.HttpError, touched?: Set<any>): Record<string, any> {
  const _touched = touched ?? new Set();
  const names = Object.getOwnPropertyNames(exception);
  const json: Record<string, any> = {};
  json.name = exception.name;
  json.message = exception.message;
  json.code = exception.statusCode;
  names.forEach(name => {
    if (ignoreAlways.has(name)) return;
    if (EnvServiceSingleton.is_prod() && ignoreProduction.has(name)) return;
    const property = exception[name];
    const next = $mapProperty(_touched)(property);
    if (next !== undefined) json[name] = next;
  });
  delete json.statusCode;
  return json;
}


function $mapProperty(touched: Set<any>) {
  return function doMap(property: unknown): unknown {
    if (typeof property === 'object' && property !== null) {
      // circular
      if (touched.has(property)) { return undefined; }
      // add
      else { touched.add(property); }
    }
    if (property instanceof httpErrors.HttpError) { return exceptionToJson(property, touched); }
    else if (typeof property === 'bigint') return property;
    else if (typeof property === 'boolean') return property;
    else if (typeof property === 'number') return property;
    else if (Array.isArray(property)) return property.map($mapProperty(touched));
    else if (typeof property === 'object') {
      if (property === null) return property;
      return Object
        .fromEntries(Object
          .entries(property)
          .map(([k, v]) => [k, $mapProperty(touched)(v)])
        );
    }
    else if (typeof property === 'string') return property;
    else if (typeof property === 'symbol') return undefined;
    else if (typeof property === 'undefined') return undefined;
    return undefined;
  }
}
