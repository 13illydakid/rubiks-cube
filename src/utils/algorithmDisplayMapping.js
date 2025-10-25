// Build a mapping from engine step index -> display token index for an algorithm string.
// This mirrors the logic used in OLL/PLL panels so highlighting lines up with actual turns.
// - Keeps display tokens exactly as written (excluding parentheses)
// - Accounts for whole-cube rotations x/y/z, slices M/E/S, faces (including wide moves)
// - Double turns (2) consume two engine steps; prime (') consumes one

/**
 * Parse a human-readable algorithm string into display tokens and a mapping
 * from engine-step index to display-token index.
 * Parentheses are ignored as tokens. Tokens are split by whitespace.
 * @param {string} displayStr The human-readable algorithm (may include (), x/y/z, M/E/S)
 * @returns {{ displayTokens: string[], engineIdxToDisplayIdx: number[] }}
 */
export function buildEngineToDisplayIndex(displayStr) {
  const raw = String(displayStr || '')
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .trim();
  const tokens = raw.length ? raw.split(/\s+/) : [];

  const displayTokens = [];
  const engineIdxToDisplayIdx = [];

  const isParen = (t) => t === '(' || t === ')';
  const rotMatch = (t) => t.match(/^([xyz])((2')|2|'|)?$/i);
  const sliceMatch = (t) => t.match(/^([MES])((2')|2|'|)?$/i);
  const moveMatch = (t) => t.match(/^([RULDBFruldbf])((2')|2|'|)?$/);

  // Push mapping entries for the most recently added display token
  const pushMap = (count) => {
    const idx = Math.max(0, displayTokens.length - 1);
    for (let i = 0; i < count; i++) engineIdxToDisplayIdx.push(idx);
  };

  tokens.forEach((t) => {
    if (!t) return;
    if (isParen(t)) return; // skip parentheses themselves

    const rot = rotMatch(t);
    const sl = sliceMatch(t);
    const mv = moveMatch(t);

    // Always add the visible token first
    displayTokens.push(t);

    if (rot) {
      const rawSuf = rot[2] || '';
      const suf = rawSuf && rawSuf.startsWith('2') ? '2' : rawSuf === "'" ? "'" : '';
      if (suf === '2') pushMap(2); else pushMap(1);
    } else if (sl) {
      const rawSuf = sl[2] || '';
      const suf = rawSuf && rawSuf.startsWith('2') ? '2' : rawSuf === "'" ? "'" : '';
      if (suf === '2') pushMap(2); else pushMap(1);
    } else if (mv) {
      const rawSuf = mv[2] || '';
      const suf = rawSuf && rawSuf.startsWith('2') ? '2' : rawSuf === "'" ? "'" : '';
      if (suf === '2') pushMap(2); else pushMap(1);
    }
  });

  return { displayTokens, engineIdxToDisplayIdx };
}

export default buildEngineToDisplayIndex;
