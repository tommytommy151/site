const BOILERPLATE_PATTERNS = [
  /\s*[-|·]\s*Engross?\s*-\s*Engross?Online\s*/gi,
  /\s*Engross?\s*-\s*Engross?Online\s*/gi,
  /\bEngross?(Online)?\b/gi,
];

export function stripBoilerplate(text: string): string {
  let result = text;
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.replace(pattern, " ");
  }
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/\s*[-|·]\s*[-|·]\s*/g, " - ");
  result = result.replace(/^[\s\-|·]+|[\s\-|·]+$/g, "");
  return result.trim();
}
