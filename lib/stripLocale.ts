export function stripLocale(path: string) {
  return path.replace(/^\/[a-z]{2}(?=\/|$)/, '');
}