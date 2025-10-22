const sizeLimit = 30;

const OLL = {
  1: `(R U2 R') (R' F R F') U2 (R' F R F')`,
  3: `f (R U R' U') f' U' F (R U R' U') F'`,
  4: `f (R U R' U') f' U F (R U R' U') F'`,
  5: `r' U2 (R U R' U) r`,
  6: `r U2 R' U' R U' r'`,
  7: `(r U R' U) R U2 r'`,
  8: `r' U' R U' R' U2 r`,
  9: `(R U R' U') R' F R2 U R' U' F'`,
  10: `(R U R' U) (R' F R F') R U2 R'`,
  11: `F' (L' U' L U) F y F (R U R' U') F'`,
  12: `F (R U R' U') F' U F (R U R' U') F'`,
  13: `F (U R U' R2) F' (R U R U' R')`,
  15: `l' U' l (L' U' L U) l' U l`,
  16: `r U r' (R U R' U') r U' r'`,
  17: `(R U R' U) (R' F R F') U2 (R' F R F')`,
  34: `(R U R' U') x D' R' U R U' D x'`,
  35: `(R U2 R') (R' F R F') (R U2 R')`,
  36: `(L' U' L U') (L' U L U) (L F' L' F)`,
  37: `F R' F' R U R U' R'`,
  38: `(R U R' U) (R U' R' U') (R' F R F')`,
  39: `L F' (L' U' L U) F U' L'`,
  40: `R' F (R U R' U') F' U R`,
  41: `(R U R' U) R U2 R' F (R U R' U') F'`,
  42: `(R' F R F') (R' F R F') (R U R' U') (R U R')`,
  43: `f' (L' U' L U) f`,
  44: `f (R U R' U') f'`,
  45: `F (R U R' U') F'`,
  46: `R' U' (R' F R F') U R`,
  47: `F' (L' U' L U) (L' U' L U) F`,
  48: `F (R U R' U') (R U R' U') F'`,
  49: `(R' F R' F') R2 U2 y (R' F R F')`,
  50: `R' F R2 B' R2' F' R2 B R'`,
  51: `f (R U R' U') (R U R' U') f'`,
  52: `(R U R' U) R d' R U' R' F'`,
  53: `(l' U' L U') (L' U L U') L' U2 l`,
  54: `(r U R' U) (R U' R' U) R U2' r'`,
  55: `R U2 R2 (U' R U' R') U2 (F R F')`,
  56: `F (R U R' U') R F' (r U R' U') r'`,
  57: `(R U R' U') M' (U R U' r')`,
}

export const OLLSetUP = {
  1: `F R' F' R U2 F R' F' R R U2 R'`,
  2: `f U R U' R' f' F U R U' R' F'`,
  3: `F U R U' R' F' U f U R U' R' f'`,
  4: `F U R U' R' F' U' f U R U' R' f'`,
  5: `r' U' R U' R' U2 r`,
  6: `r U R' U R U2 r'`,
  7: `r U2 R' U' R U' r'`,
  8: `r' U2 R U R' U r`,
  9: `F U R U' R2 F' R U R U' R'`,
  10: `R U2 R' F R' F' R U' R U' R'`,
  11: `F U R U' R' F' y' F' U' L' U L F`,
  12: `F U R U' R' F' U' F U R U' R' F'`,
  13: `R U R' U' R' F R2 U R' U' F'`,
  14: `R U R' y R' F R U' R' F' R`,
  15: `l' U' l U' L' U L l' U l`,
  16: `r U r' U R U' R' r U' r'`,
  17: `F R' F' R U2 F R' F' R U' R U' R'`,
  18: `F R' F' R U2 R y U' R U' R' F'`,
  19: `F R' F' R M U R U' R' U' M'`,
  20: `r U R' U' M2 U R U' R' U' M'`,
  21: `R U2 R' U' R U R' U' R U' R'`,
  22: `R' U2 R2' U R2 U R2' U2 R'`,
  23: `R U2 R D R' U2 R D' R2`,
  24: `F R' F' r U R U' r'`,
  25: `R' F' r U R U' r' F`,
  26: `R U R' U R U2 R'`,
  27: `R' U' R U' R' U2 R`,
  28: `M' U M U2' M' U M`,
  29: `R U' R' F' U F R U R' U R U' R'`,
  30: `R U' R' d' L' U2 L F' L F L'`,
  31: `R' F R U R' U' F' U R`,
  32: `r U R U' r' F U R' U' F'`,
  33: `F R' F' R U R U' R'`,
  34: `x D' U R' U' R D x' U R U' R'`,
  35: `R U2 R' F R' F' R R U2 R'`,
  36: `F' L F L' U' L' U' L U L' U L`,
  37: `R U R' U' R' F R F'`,
  38: `F R' F' R U R U R' U' R U' R'`,
  39: `L U F' U' L' U L F L'`,
  40: `R' U' F U R U' R' F' R`,
  41: `F U R U' R' F' R U2 R' U' R U' R'`,
  42: `R U' R' U R U' R' F R' F' R F R' F' R`,
  43: `f' U' L' U L f`,
  44: `f U R U' R' f'`,
  45: `F U R U' R' F'`,
  46: `R' U' F R' F' R U R`,
  47: `F' U' L' U L U' L' U L F`,
  48: `F U R U' R' U R U' R' F'`,
  49: `F R' F' R y' U2 R2 F R F' R`,
  50: `R B' R2 F R2' B R2 F' R`,
  51: `f U R U' R' U R U' R' f'`,
  52: `F R U R' d R' U' R U' R'`,
  53: `l' U2 L U L' U' L U L' U l`,
  54: `r U2' R' U' R U R' U' R U' r'`,
  55: `F R' F' U2 R U R' U R2 U2 R'`,
  56: `r U R U' r' F R' U R U' R' F'`,
  57: `r U R' U' M U R U' R'`
}

// Fallback helper: return display string for a given OLL id ("1".."57").
// Prefer OLL[id]; if missing, derive by inverting the setup algorithm.
function getOLLDisplayString(id) {
  const key = String(id);
  const disp = OLL[key];
  if (disp && typeof disp === 'string') return disp;
  const setup = OLLSetUP[key];
  if (setup && typeof setup === 'string') return reverseAlgo(setup);
  return '';
}

function reverseAlgo(string) {
  let array = string.split(" ").reverse();
  for (let i = 0; i < array.length; i++) {
    let tempStr = array[i];
    let copyStr = tempStr;
    if (!tempStr) { array[i] = copyStr; continue; }
    // Normalize any accidental 2' to just 2
    if (/2'$/.test(tempStr)) {
      copyStr = tempStr.replace(/2'$/, '2');
    } else if (tempStr.endsWith("'")) {
      // Remove prime if present
      copyStr = tempStr.slice(0, -1);
    } else if (tempStr.endsWith('2')) {
      // Half turns are self-inverse: leave as-is
      copyStr = tempStr;
    } else {
      // Add prime for quarter turns without prime
      copyStr = tempStr + "'";
    }
    array[i] = copyStr;
  }
  return array.join(" ");
}

function convertRuwixAlgo(algoStr) {
  if (!algoStr || typeof algoStr !== 'string') return '';
  const out = [];
  for (let i = 0; i < algoStr.length; i++) {
    const ch = algoStr[i];
    // Only process letters; skip anything else (quotes handled as suffix below)
    if (/[A-Za-z]/.test(ch)) {
      // Determine depth by case: lowercase => wide => depth 02 on 3x3
      const depth = ch === ch.toLowerCase() ? '02' : '01';
      // Peek for optional suffix: 2 or '
      let suf = '';
      if (i + 1 < algoStr.length && (algoStr[i + 1] === "'" || algoStr[i + 1] === '2')) {
        suf = algoStr[i + 1];
        i += 1;
      }

      if (suf === '2') {
        // Two quarter-turns
        out.push(`${depth}${ch}`);
        out.push(`${depth}${ch}`);
      } else {
        // Prime or normal
        out.push(`${depth}${ch}${suf === "'" ? "'" : ''}`);
      }
    }
  }
  return out.join(' ').trim();
}

// Sanitize OLL display string for the engine: remove parentheses and cube rotations (x, y, z variants)
function sanitizeOLLDisplay(str) {
  if (!str) return '';
  // Tokenize by spaces, drop parentheses characters
  const raw = str.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);

  // Accumulate whole-cube rotations as an ordered sequence (non-commutative)
  const rotSeq = [];
  const pushRot = (axis, count) => { for (let i = 0; i < ((count % 4) + 4) % 4; i++) rotSeq.push(axis); };

  const applySingle = (ch, axis) => {
    const isLower = ch === ch.toLowerCase();
    let u = ch.toUpperCase();
    const mapX = { F: 'U', U: 'B', B: 'D', D: 'F', R: 'R', L: 'L' };
    const mapY = { F: 'R', R: 'B', B: 'L', L: 'F', U: 'U', D: 'D' };
    const mapZ = { U: 'R', R: 'D', D: 'L', L: 'U', F: 'F', B: 'B' };
    if (axis === 'x') u = mapX[u] || u;
    else if (axis === 'y') u = mapY[u] || u;
    else if (axis === 'z') u = mapZ[u] || u;
    return isLower ? u.toLowerCase() : u;
  };

  const applyRotations = (letter) => rotSeq.reduce((acc, ax) => applySingle(acc, ax), letter);

  // Expand a token to 1+ tokens with rotations applied
  const expandToken = (tok) => {
    // Normalize any 2' suffix to just 2
    if (/2'$/.test(tok)) tok = tok.replace(/2'$/, '2');
    // Cube rotations x/y/z with optional suffix
    const rot = tok.match(/^[xyz]((2')|2|'|)?$/i);
    if (rot) {
      const axis = rot[0][0].toLowerCase();
      const raw = rot[1] || '';
      const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
      if (suf === "'") pushRot(axis, 3);
      else if (suf === '2') pushRot(axis, 2);
      else pushRot(axis, 1);
      return [];
    }

    // Slice moves M/E/S
    const m = tok.match(/^(M|E|S)((2')|2|'|)?$/i);
    if (m) {
      const kind = m[1].toUpperCase();
      const raw = m[2] || '';
      const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
      let exp = [];
      if (kind === 'M') {
        exp = (suf === "'") ? ["r'", "R"] : (suf === '2') ? ["r2", "R2"] : ["r", "R'"];
      } else if (kind === 'E') {
        exp = (suf === "'") ? ["u'", "U"] : (suf === '2') ? ["u2", "U2"] : ["u", "U'"];
      } else if (kind === 'S') {
        exp = (suf === "'") ? ["f'", "F"] : (suf === '2') ? ["f2", "F2"] : ["f", "F'"];
      }
      // Apply rotations to each sub-token
      return exp.map((e) => {
        const face = e[0];
        const suf2 = e.slice(1); // '', "'", or '2'
        const mapped = applyRotations(face);
        return mapped + suf2;
      });
    }

    // Regular face move (with optional suffix), apply rotations
    const mv = tok.match(/^([RULDBF](2'?|')|[rudlbf](2'?|'))$/);
    if (mv) {
      const face = tok[0];
      const suf = tok.slice(1);
      const mapped = applyRotations(face);
      return [mapped + suf];
    }

    // Unknown token; keep as-is
    return [tok];
  };

  const expanded = [];
  for (const t of raw) {
    const parts = expandToken(t);
    if (parts && parts.length) expanded.push(...parts);
  }
  // Join without spaces for convertRuwixAlgo, which scans char-by-char with suffixes
  return expanded.join('');
}

// Build size-aware engine tokens for OLL (handles x/y/z as whole-cube turns, and M/E/S on 3x3)
function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

function convertOLLForSize(str, size) {
  if (!str) return '';
  const out = [];
  const toks = String(str).replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);

  const emitFace = (face, suf, depth) => {
    const d = twoDigit(depth);
    if (suf === "2") { out.push(`${d}${face}`); out.push(`${d}${face}`); }
    else if (suf === "'") out.push(`${d}${face}'`);
    else out.push(`${d}${face}`);
  };

  const axisToWide = (axis) => axis === 'x' ? 'r' : axis === 'y' ? 'u' : 'f';

  for (const t of toks) {
    // Whole-cube rotations
    const rot = t.match(/^([xyz])((2')|2|'|)?$/i);
    if (rot) {
      const axis = rot[1].toLowerCase();
      const raw = rot[2] || '';
      const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
      const letter = axisToWide(axis); // r/u/f
      emitFace(letter, suf, size);
      continue;
    }

    // Slice moves (3x3 only semantics): single slice token like keybinds
    const sm = t.match(/^([MES])((2')|2|'|)?$/i);
    if (sm) {
      const kind = sm[1].toUpperCase();
      const raw = sm[2] || '';
      const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
      const face = (kind === 'M') ? 'R' : (kind === 'E') ? 'U' : 'F';
      if (suf === '2') {
        // 180 is the same either way
        emitFace(face, '', 2);
        emitFace(face, '', 2);
      } else if (kind === 'M') {
        // Invert M/M' to match cube notation (App keybind semantics are UI-only):
        // M  => 02R'
        // M' => 02R
        if (suf === "'") emitFace(face, '', 2);
        else emitFace(face, "'", 2);
      } else {
        // E and S keep normal suffix behavior
        if (suf === "'") emitFace(face, "'", 2);
        else emitFace(face, '', 2);
      }
      continue;
    }

    // Regular face (upper/lower) with optional suffix
    const mv = t.match(/^([RULDBFruldbf])((2')|2|'|)?$/);
    if (mv) {
      const face = mv[1];
      const raw = mv[2] || '';
      const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
      const depth = face === face.toLowerCase() ? 2 : 1;
      emitFace(face, suf, depth);
      continue;
    }

    // Unknown token: skip
  }

  return out.join(' ');
}

// Removed unused bundle() helper

let blankBundle = (name) => {
  let cubeSizes = [];
  for (let i = 2; i <= sizeLimit; i++) cubeSizes.push(i);
  return { name: name, worksFor: cubeSizes }
}

// let generalizedBundle = (name, moveSet, moveSet2, tempObj) => {
let generalizedBundle = (name, moveSet, moveSet2) => {
  let sets = [];
  for (let i = 3; i <= sizeLimit; i++) {
    let algoName = name;
    if (name === "Cube x3") {
      algoName = algoName.split('');
      algoName.pop();
      algoName.push(i);
      algoName = algoName.join('');
    }
    // For 3x3 OLL, create a size-aware sequence that includes whole-cube turns and slice moves as single moves.
    const id = name.split('-')[1];
    const displayStr3 = getOLLDisplayString(id);
    const movesForSize = (i === 3) ? convertOLLForSize(displayStr3, 3) : generalizerLower(i, moveSet, moveSet2);
    sets.push({ name: algoName, moves: movesForSize, worksFor: [i] });
    if (i < -1) {
      sets.push({
        name: algoName + " (Inverse)",
        moves: generalizerUpper(i, moveSet),
        worksFor: [i]
      });
    }
  }
  return sets;
}

let generalizerLower = (size, moveSet, moveSet2) => {
  const moveParts = [];
  for (let i = 1; i <= Math.floor(size / 2); i++) {
    if (moveSet2 && i % 2) moveParts.push(baseLower(i, moveSet2));
    else moveParts.push(baseLower(i, moveSet));
  }
  return moveParts.join(" ");
}

let baseLower = (depth, moveSet) => {
  const moves = [];
  if (depth > 1) {
    moveSet.split(" ").forEach(e => moves.push(move(depth, e.substring(2).toLowerCase())));
  } else {
    moveSet.split(" ").forEach(e => moves.push(move(depth, e.substring(2).toUpperCase())))
  };
  return moves.join(" ");
}

let generalizerUpper = (size, moveSet) => {
  const moveParts = [];
  for (let i = 1; i <= Math.floor(size / 2); i++) {
    moveParts.push(baseUpper(i, moveSet));
  }
  return moveParts.join(" ");
}

let baseUpper = (depth, moveSet) => {
  const moves = [];
  moveSet.split(" ").forEach(e => moves.push(move(depth, e.substring(2).toUpperCase())));
  return moves.join(" ");
}

function move(depth, side) {
  return ((depth < 10 ? "0" : "") + depth + side);
}

// Build algorithms by iterating the OLL object (1..57), sanitizing and converting for engine use
let algorithms = [blankBundle("None Selected")];

for (let n = 1; n <= 57; n++) {
  const key = String(n);
  const value = getOLLDisplayString(key);
  if (!value) continue;
  // Pass the sanitized (non-size-aware) string for generalized sizes, but 3x3 will be rebuilt by convertOLLForSize
  const newAlgorithm = convertRuwixAlgo(sanitizeOLLDisplay(value));
  algorithms.push(...generalizedBundle(`OLL-${key}`, newAlgorithm));
}
// const displayStr = OLL[num];
// const engineStr = convertRuwixAlgo(sanitizeOLLDisplay(displayStr));
// algorithms.push(...generalizedBundle(`OLL-${num}`, engineStr));

// console.log(algorithms[1]);
// console.log("algorithms");
export default algorithms;

// Named export: human-readable OLL display list (3x3) using the OLL object above
// This is used by the UI to show the exact notation strings without numeric prefixes.
export const ollDisplay = Array.from({ length: 57 }, (_, i) => {
  const num = String(i + 1);
  const str = getOLLDisplayString(num);
  return {
    name: `OLL-${num}`,
    display: String(str || '').trim(),
    worksFor: [3],
  };
}).filter(item => item.display)
