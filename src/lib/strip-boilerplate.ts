const BOILERPLATE_PATTERNS = [/\s*[-|·]\s*Engros\s*-\s*EngrossOnline\s*/gi, /\s*Engros\s*-\s*EngrossOnline\s*/gi];

export function stripBoilerplate(text: string): string {
  let result = text;
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.replace(pattern, " ");
  }
  return result.replace(/\s{2,}/g, " ").trim();
}
