const FILLER = /^(a|an|the|my|our|create|build|make|generate|develop|write|design|implement)\b/i;

/**
 * Extract a clean, short project name from a user prompt.
 * Priority:
 *  1. Explicit patterns: "called X", "named X", "app name is X", "for X"
 *  2. First meaningful noun phrase (2-4 words)
 *  3. Fallback: "Untitled Project"
 */
export function extractProjectName(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Untitled Project";

  // 1. Try explicit naming patterns
  const explicitPatterns = [
    /(?:app|project|site|website|application)\s+(?:name\s+is|called|named|titled)\s+["']?([^"'\n,]+)/i,
    /(?:called|named|titled)\s+["']?([^"'\n,]+)/i,
    /(?:for|about)\s+["']?([A-Z][a-zA-Z0-9\s&-]{1,30})/,
  ];

  for (const pattern of explicitPatterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return cleanName(match[1]);
    }
  }

  // 2. Build from keywords – take first 2-4 meaningful words
  const words = trimmed
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Strip leading filler words
  while (words.length > 0 && FILLER.test(words[0])) {
    words.shift();
  }

  if (words.length === 0) return "Untitled Project";

  const nameWords = words.slice(0, 4);
  return cleanName(nameWords.join(" "));
}

function cleanName(raw: string): string {
  let name = raw
    .replace(/['"]/g, "")
    .replace(/[.,!?;:]+$/, "")
    .trim();

  // Capitalize first letter
  if (name.length > 0) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  return name.slice(0, 40) || "Untitled Project";
}
