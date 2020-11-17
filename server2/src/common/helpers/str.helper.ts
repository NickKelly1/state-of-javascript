export const Str = {
  dontStartWith: (arg: { haystack: string, needle: string, caseSensitive?: boolean }): string => {
    const { haystack, needle, caseSensitive } = arg;
    if (caseSensitive) {
      if (haystack.startsWith(needle)) return haystack.substr(needle.length);
      return haystack;
    }
    if (haystack.toLowerCase().startsWith(needle.toLowerCase())) return haystack.substr(needle.length);
    return haystack;
  },
  startWith: (arg: { haystack: string, needle: string, caseSensitive?: boolean }): string => {
    const { haystack, needle, caseSensitive } = arg;
    if (caseSensitive) {
      if (haystack.startsWith(needle)) return haystack;
      return `${needle}${haystack}`;
    }
    if (haystack.toLowerCase().endsWith(needle.toLowerCase())) return haystack;
    return `${needle}${haystack}`;
  },
  beforeLastDot(str: string): string {
    // remove everything after the dot
    return str.replace(/\.[^/.]+$/, '');
  },
  endWith: (arg: { haystack: string, needle: string, caseSensitive?: boolean }): string => {
    const { haystack, needle, caseSensitive } = arg;
    if (caseSensitive) {
      if (haystack.endsWith(needle)) return haystack;
      return `${haystack}${needle}`;
    }
    if (haystack.toLowerCase().endsWith(needle.toLowerCase())) return haystack;
    return `${haystack}${needle}`;
  },
  dontEndWith: (arg: { haystack: string, needle: string, caseSensitive?: boolean }): string => {
    const { haystack, needle, caseSensitive } = arg;
    if (caseSensitive) {
      if (haystack.endsWith(needle)) return haystack.substr(0, haystack.length - needle.length);
      return haystack;
    }
    if (haystack.toLowerCase().startsWith(needle.toLowerCase())) return haystack.substr(0, haystack.length - needle.length);
    return haystack;
  },
}
