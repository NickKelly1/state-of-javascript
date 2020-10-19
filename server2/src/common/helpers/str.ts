export const str = {
  endWith: (arg: { haystack: string, needle: string, caseSensitive?: boolean }): string => {
    const { haystack, needle, caseSensitive } = arg;
    if (caseSensitive) {
      if (haystack.endsWith(needle)) return haystack;
      return `${haystack}${needle}`
    }
    if (haystack.toLowerCase().endsWith(needle.toLowerCase())) return haystack;
    return `${haystack}${needle}`
  }
}