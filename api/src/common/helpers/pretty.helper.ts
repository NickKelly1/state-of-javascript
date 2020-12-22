/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { $TS_FIX_ME } from "../types/$ts-fix-me.type";
import { Printable } from "../types/printable.type";

export function pretty(json: Printable | $TS_FIX_ME<any>): string {
  return JSON.stringify(json, null, 2);
}

function renderError(error: Error): string {
  const plainError: Record<any, any> = {};
  Object
    .getOwnPropertyNames(error)
    .forEach(p => { plainError[p] = (error as any)[p]; });
  Object
    .getOwnPropertySymbols(error)
    .forEach(s => { plainError[s as any] = (error as any)[s]; });
  if (typeof plainError.stack === 'string') plainError.stack = plainError.stack.split('\n');
  return prettyQ(plainError);
}


/**
 * Pretty query
 * 
 * Query requires prettyfying symbols, which JSON.stringify ignores...
 * 
 * @param obj
 *
 * https://codereview.stackexchange.com/questions/214947/pretty-print-an-object-javascript
 */
export function prettyQ(obj: Printable | $TS_FIX_ME<any>): string {
  const printed: Set<any> = new Set();

  // if object has already been printed, show [Circular...] instead
  // stops circular references from destroying everything
  const singular = <A extends object>(fn: (value: A) => string) => (value: A): string => {
    if (printed.has(value)) {
      try {
        let print: string | null | undefined = (value as any)?.name;
        if (print == null) { print = Object.getPrototypeOf(value)?.contructor?.name; }
        // can throw errors on null-prototype objects
        if (print == null) { print = value?.toString?.(); }
        if (print == null) { print = '_unprintable_'; }
        return `[Circular... ${print}]`;
      } catch (error) {
        return `[Circular... _unprintable_]`;
      }
    }
    printed.add(value);
    return fn(value);
  }

  const stringify = {
    undefined: (x: undefined) => "undefined",
    boolean:   (x: boolean) => x.toString(),
    number:    (x: number) => x,
    bigint:    (x: number) => `__bigint__${x.toString()}__`,
    string:    (x: string) => enquote(x),
    object:    (x: object | null) => x === null ? 'null'
      : x instanceof Error ? singular(renderError)(x)
      : singular(traverse)(x),
    function:  (x: Function) => x.toString(),
    symbol:    (x: symbol) => x.toString()
  };
  const indent = (s: string): string => s.replace(/^/mg, "  ");
  const keywords = `do if in for let new try var case else enum eval null this true 
    void with await break catch class const false super throw while 
    yield delete export import public return static switch typeof 
    default extends finally package private continue debugger 
    function arguments interface protected implements instanceof`
      .split(/\s+/)
      .reduce((all, kw) => (all[kw]=true) && all, {} as Record<string, boolean>);
  
  const ignoreSymbolsFrom: Function[] = [Error];
  const symbols = (obj: object): symbol[] => ignoreSymbolsFrom.some(ignore => obj instanceof ignore) ? [] : Object.getOwnPropertySymbols(obj);
  const keyify = (s: string) => (!(s in keywords) && /^[$A-Z_a-z][$\w]*$/.test(s) ? s : enquote(s) ) + ": ";
  const enquote = (s: string) => s.replace(/([\\"])/g, '\\$1').replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/^|$/g,'"');
  const traverse = (obj: object): string => [
    Array.isArray(obj) ? '[' : '{',
    indent(
      Array.isArray(obj)
      ? obj
        .map((val, index) => indent(stringify[typeof val](val as $TS_FIX_ME<never>).toString()))
        .join(",\n")
      : (Object
          .keys(obj) as (string | symbol)[])
          .concat(symbols(obj))
          .map(k => indent(keyify(k.toString()) + stringify[typeof obj[k as keyof typeof obj]](obj[k as keyof typeof obj])))
          .join(",\n")
    ),
    Array.isArray(obj) ? ']' : '}'
  ]
    .filter( s => /\S/.test(s) )
    .join("\n")
    .replace(/^{\s*\}$/,"{}");

  return stringify[typeof obj](obj as $TS_FIX_ME<never>).toString();
}