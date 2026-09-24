/** One thing the palette can do. */
export interface RlbCommand {
  /** Stable across renders: it is how «recently used» remembers this command. */
  id: string;
  label: string;
  /** A second line, for what the label could not say. */
  hint?: string;
  /** An icon class. */
  icon?: string;
  /** The heading this command is listed under. Commands with no group come first, ungrouped. */
  group?: string;
  /** Extra words the search should match — synonyms, the old name of the thing, an abbreviation. */
  keywords?: string[];
  /** A keyboard shortcut to display beside it. Shown only; the palette does not bind it. */
  shortcut?: string;
  disabled?: boolean;
  run: () => void;
}

/**
 * Matches a command against what was typed.
 *
 * Every character of the query must appear in order somewhere in the haystack — the same
 * subsequence rule every command palette uses, so `dbs` finds «Dashboard settings». Consecutive
 * matches and matches at a word boundary score higher, which is what puts the command you meant
 * above the one that merely contains the same letters.
 *
 * Returns `null` when the command does not match at all.
 */
export function scoreCommand(command: RlbCommand, query: string): number | null {
  const needle = query.trim().toLowerCase();
  if (needle === '') return 0;

  const haystacks = [command.label, ...(command.keywords ?? []), command.group ?? ''];
  let best: number | null = null;

  for (const haystack of haystacks) {
    const score = scoreOne(haystack.toLowerCase(), needle);
    if (score !== null && (best === null || score > best)) best = score;
  }
  return best;
}

function scoreOne(haystack: string, needle: string): number | null {
  let score = 0;
  let from = 0;
  let previous = -2;

  for (const character of needle) {
    const at = haystack.indexOf(character, from);
    if (at === -1) return null;

    score += 1;
    if (at === previous + 1) score += 2; // consecutive
    if (at === 0 || haystack[at - 1] === ' ') score += 3; // start of a word

    previous = at;
    from = at + 1;
  }

  // A short haystack that matched is a better answer than a long one that also did.
  return score - haystack.length * 0.01;
}
