const sizeLimit = 30;

const OLL = {
  1: `(R U2 R') (R' F R F') U2 (R' F R F')`,
  2: `F (R U R' U') F' f (R U R' U') f'`,
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
  14: `(R' F R) U (R' F' R) y' (R U' R')`,
  15: `l' U' l (L' U' L U) l' U l`,
  16: `r U r' (R U R' U') r U' r'`,
  17: `(R U R' U) (R' F R F') U2 (R' F R F')`,
  18: `F (R U R' U) y' R' U2 (R' F R F')`,
  19: `M U (R U R' U') M' (R' F R F')`,
  20: `M U (R U R' U') M2 (U R U' r')`,
  21: `(R U R') U (R U' R') U (R U2 R')`,
  22: `R U2 (R2' U' R2 U') (R2' U2 R)`,
  23: `R2 D (R' U2 R) D' (R' U2 R')`,
  24: `(r U R' U') (r' F R F')`,
  25: `F' (r U R' U') (r' F R)`,
  26: `(R U2 R') U' (R U' R')`,
  27: `(R' U2 R) U (R' U R)`,
  28: `M' U' M U2' M' U' M`,
  29: `(R U R' U') R U' R' F' U' (F R U R')`,
  30: `(L F' L' F) L' U2 L d (R U R')`,
  31: `R' U' F U R U' R' F' R`,
  32: `F U R U' F' r U R' U' r'`,
  33: `(R U R' U') (R' F R F')`,
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

function reverseAlgo(string) {
  let array = string.split(" ").reverse();
  for (let i = 0; i < array.length; i++) {
    let tempStr = array[i];
    let lastChar = tempStr[tempStr.length - 1];
    let copyStr;
    if (lastChar === "'") {
      copyStr = tempStr.slice(0, tempStr.length - 1);
    } else {
      copyStr = tempStr.slice() + "'";
    }
    array[i] = copyStr;
  }
  return array.join(" ");
}

function convertRuwixAlgo(algoStr) {
  return algoStr.split('').map((char, i) =>
    (char !== "'" && char !== "2") ? " 01" + char :
      char === "2" ? " 01" + algoStr[i - 1] : char).join('').trim();
}

// Sanitize OLL display string for the engine: remove parentheses and cube rotations (x, y, z variants)
function sanitizeOLLDisplay(str) {
  // Remove parentheses; split into tokens; drop cube rotations like y, y', y2, x, z
  const raw = str.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const out = [];
  for (const t of raw) {
    // Skip whole-cube rotations for now (not natively supported in engine queue)
    if (/^[xyz](2|'|)?$/i.test(t)) continue;
    // Translate slice moves M/E/S into wide+face equivalents on 3x3
    const m = t.match(/^(M|E|S)(2|')?$/i);
    if (m) {
      const kind = m[1].toUpperCase();
      const suf = m[2] || '';
      if (kind === 'M') {
        if (suf === "'") out.push("r'", "R");
        else if (suf === '2') out.push("r2", "R2");
        else out.push("r", "R'");
      } else if (kind === 'E') {
        if (suf === "'") out.push("u'", "U");
        else if (suf === '2') out.push("u2", "U2");
        else out.push("u", "U'");
      } else if (kind === 'S') {
        if (suf === "'") out.push("f'", "F");
        else if (suf === '2') out.push("f2", "F2");
        else out.push("f", "F'");
      }
      continue;
    }
    out.push(t);
  }
  return out.join('');
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
    sets.push(
      {
        name: algoName,
        moves: generalizerLower(i, moveSet, moveSet2),
        worksFor: [i],
      }
    );
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

for (let key in OLL) {
  let value = OLL[key];
  let newAlgorithm = convertRuwixAlgo(sanitizeOLLDisplay(value));
  algorithms.push(...generalizedBundle(`OLL-${key}`, newAlgorithm));
}
    // const displayStr = OLL[num];
    // const engineStr = convertRuwixAlgo(sanitizeOLLDisplay(displayStr));
    // algorithms.push(...generalizedBundle(`OLL-${num}`, engineStr));

console.log(algorithms[1]);
// console.log("algorithms");
export default algorithms;

// Named export: human-readable OLL display list (3x3) using the OLL object above
// This is used by the UI to show the exact notation strings without numeric prefixes.
export const ollDisplay = Object.entries(OLL).map(([num, str]) => ({
  name: `OLL-${num}`,
  display: String(str).trim(),
  worksFor: [3],
}));
