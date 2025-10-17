const sizeLimit = 30;
/*
const cross = "01R 01R 01L' 01D 01F 01F 01R' 01D' 01R' 01L 01U' 01D 01R 01D 01B 01B 01R' 01U 01D 01D";
const checkerboard = "01U 01U 01D 01D 01R 01R 01L 01L 01F 01F 01B 01B";
const checkerboard1 = "01U' 01R 01R 01L 01L 01F 01F 01B 01B 01U' 01R 01L 01F 01B' 01U 01F 01F 01D 01D 01R 01R 01L 01L 01F 01F 01U 01U 01F 01F 01U' 01F 01F";
const python = "01F 01F 01R' 01B' 01U 01R' 01L 01F' 01L 01F' 01B 01D' 01R 01B 01L 01L";
const sixSpots = "01U 01D' 01R 01L' 01F 01B' 01U 01D'";
const cubex3 = "01U' 01L' 01U' 01F' 01R 01R 01B' 01R 01F 01U 01B 01B 01U 01B' 01L 01U' 01F 01U 01R 01F'";
const rings = "02R 03R 04R 05R 02B' 03B' 04B' 01L 01L 02F 02B 01L 01L 02B' 02D' 03D' 04D' 05D' 02F' 01L 01L 02F 02B 01L 01L 02B' 02D 02D 03D 03D 04D 04D 05D 05D 03R 04R 01U' 03R' 04R' 02D' 03D' 04D' 05D' 03R 04R 01U 02R' 03R' 04R' 05R' 03F' 04F' 03R' 04R' 03F 04F 02F 03F 04F 05F 02L 02L 03L 03L 04L 04L 02F 02F 03R 03R 04R 04R 02B 02B 03B 03B 04B 04B 02L 02L";
const cubex4Twisted = "01B' 02R 02R 02L 02L 01U 01U 02R 02R 02L 02L 01B 01F 01F 01R 01U' 01R 01U 01R 01R 01U 01R 01R 01F' 01U 01F' 01U 02U 01L 02L 01U' 02U' 01F 01F 02F 02F 01D 02D 01R' 02R' 01U 02U 01F 02F 01D 01D 02D 02D 01R 01R 02R 02R";
const cubex2 = "01F 01L 01F 01U' 01R 01U 01F 01F 01L 01L 01U' 01L' 01B 01D' 01B' 01L 01L 01U";

//convertRuwixAlgo("".split(' ').join(''));
const checkboardInCube = convertRuwixAlgo("BDF'B'DL2ULU'BD'RBRD'RL'FU2D");
const perpendicularLines = convertRuwixAlgo("R2 U2 R2 U2 R2 U2 L2 D2 L2 D2 L2 D2 L2 R2".split(' ').join(''));
const verticalStripes = convertRuwixAlgo("F U F R L2 B D' R D2 L D' B R2 L F U F".split(' ').join(''));
const giftBox = convertRuwixAlgo("U B2 R2 B2 L2 F2 R2 D' F2 L2 B F' L F2 D U' R2 F' L' R'".split(' ').join(''));
const twister = convertRuwixAlgo("F R' U L F' L' F U' R U L' U' L F'".split(' ').join(''));
const spiral = convertRuwixAlgo("L' B' D U R U' R' D2 R2 D L D' L' R' F U".split(' ').join(''));
const fourCrosses = convertRuwixAlgo("U2 R2 L2 F2 B2 D2 L2 R2 F2 B2".split(' ').join(''));
const unionJack = convertRuwixAlgo("U F B' L2 U2 L2 F' B U2 L2 U".split(' ').join(''));
const displaceMotif = convertRuwixAlgo("L2 B2 D' B2 D L2 U R2 D R2 B U R' F2 R U' B' U'".split(' ').join(''));
const viaduct = convertRuwixAlgo("R2 U2 L2 D B2 L2 B2 R2 D' U L' D F' U' R2 F' U B2 U2 R'".split(' ').join(''));
const staircase = convertRuwixAlgo("L2 F2 D' L2 B2 D' U' R2 B2 U' L' B2 L D L B' D L' U".split(' ').join(''));
const wrapped2x2 = convertRuwixAlgo("D' B2 F2 L2 U' F2 R2 D F2 U2 L' B R' U' L' F D' F L D2".split(' ').join(''));
const exchangedDuckFeet = convertRuwixAlgo("U F R2 F' D' R U B2 U2 F' R2 F D B2 R B'".split(' ').join(''));
const pyraminx = convertRuwixAlgo("D L' U R' B' R B U2 D B D' B' L U D'".split(' ').join(''));
const twinPeaks = convertRuwixAlgo("U L2 B2 R2 U R2 D' U L F' U L' D B' U L B' L R' U'".split(' ').join(''));
const cornerPyramid = convertRuwixAlgo("U' D B R' F R B' L' F' B L F R' B' R F' U' D".split(' ').join(''));
const sixTwoOne = convertRuwixAlgo("U B2 D2 L B' L' U' L' B D2 B2".split(' ').join(''));
const yinYang = convertRuwixAlgo("R L B F R L U' D' F' B' U D".split(' ').join(''));
const snakeEyes = convertRuwixAlgo("R2 U2 R2 U2 R2 U2".split(' ').join(''));
const weirdo = convertRuwixAlgo("R' F' U F2 U' F R' F2 D2 F2 D2 F2 D F2 R2 U2".split(' ').join(''));
*/

// const anaconda = reverseAlgo(convertRuwixAlgo("RU'U'R'R'FRF'UUR'FRF'"));
// const one = convertRuwixAlgo("RU'U'R")
const one = convertRuwixAlgo("RU'U'R'R'FRF'UUR'FRF'");

const two = reverseAlgo(convertRuwixAlgo("FRUR'U'F'fRUR'U'f'"));
const three = reverseAlgo(convertRuwixAlgo("fRUR'U'f'U'FRUR'U'F'"));
const four = reverseAlgo(convertRuwixAlgo("fRUR'U'f'UFRUR'U'F'"));
const five = reverseAlgo(convertRuwixAlgo("r'UURUR'Ur"));
const six = reverseAlgo(convertRuwixAlgo("rU'U'R'U'RU'r'"));
const seven = reverseAlgo(convertRuwixAlgo("rUR'URU'U'r'"));
const eight = reverseAlgo(convertRuwixAlgo("r'u'RU'R'UUr"));
const nine = reverseAlgo(convertRuwixAlgo("RUR'U'R'FRRUR'U'F'"));
const ten = reverseAlgo(convertRuwixAlgo("RUR'UR'FRF'RU'U'R'"));
const eleven = reverseAlgo(convertRuwixAlgo("r'RRUR'URU'U'R'UM'"));
const twelve = reverseAlgo(convertRuwixAlgo("M'R'U'RU'R'UURU'M"));
const thirteen = reverseAlgo(convertRuwixAlgo("fRURRU'R'URU'f'"));
const fourteen = reverseAlgo(convertRuwixAlgo("R'FRUR'F'RFU'F'"));
const fifteen = reverseAlgo(convertRuwixAlgo("r'U'rR'U'RUr'Ur"));
const sixteen = reverseAlgo(convertRuwixAlgo("rUr'RUR'U'rU'r'"));
const seventeen = reverseAlgo(convertRuwixAlgo("lU'l'fRRBR'UR'U'f'"));
const eighteen = reverseAlgo(convertRuwixAlgo("rUR'URU'U'r'r'U'RU'R'UUr"));
const nineteen = reverseAlgo(convertRuwixAlgo("r'RURUU'U'rR'R'FRF'"));
const twenty = reverseAlgo(convertRuwixAlgo("rUR'U'M'M'URU'R'U'M'"));
const twentyone = reverseAlgo(convertRuwixAlgo("RU'U'R'U'RUR'U'RU'R'"));
const twentytwo = reverseAlgo(convertRuwixAlgo("RU'U'R'R'U'RRU'R'R'U'U'R"));
const twentythree = reverseAlgo(convertRuwixAlgo("RRD'RU'U'R'DRU'U'R"));
const twentyfour = reverseAlgo(convertRuwixAlgo("rUR'U'r'FRF'"));
const twentyfive = reverseAlgo(convertRuwixAlgo("F'rUR'U'r'FR"));
const twentysix = reverseAlgo(convertRuwixAlgo("RU'U'R'U'RU'R'"));
const twentyseven = reverseAlgo(convertRuwixAlgo("RUR'URU'U'R'"));
const twentyeight = reverseAlgo(convertRuwixAlgo("rUR'U'r'RURU'R'"));
const twentynine = reverseAlgo(convertRuwixAlgo("RUR'U'RU'R'F'U'FRUR'"));
const thirty = reverseAlgo(convertRuwixAlgo("fRURRU'U'URRU'R'f'"));
const thirtyone = reverseAlgo(convertRuwixAlgo("r'F'UFrU'r'U'r"));
const thirtytwo = reverseAlgo(convertRuwixAlgo("RUB'U'R'URBR'"));
const thirtythree = reverseAlgo(convertRuwixAlgo("RUR'U'R'FRF'"));
const thirtyfour = reverseAlgo(convertRuwixAlgo("RURRU'R'FRURU'F'"));
const thirtyfive = reverseAlgo(convertRuwixAlgo("RU'U'R'R'FRF'RU'U'R'"));
const thirtysix = reverseAlgo(convertRuwixAlgo("R'U'RU'R'URUlU'R'U"));
const thirtyseven = reverseAlgo(convertRuwixAlgo("FRU'R'U'RUR'F'"));
const thirtyeight = reverseAlgo(convertRuwixAlgo("RUR'URU'R'U'R'FRF'"));
const thirtynine = reverseAlgo(convertRuwixAlgo("RUR'F'U'FURUUR'"));
const forty = reverseAlgo(convertRuwixAlgo("R'FRUR'U'F'UR"));
const fortyone = reverseAlgo(convertRuwixAlgo("RUR'URU'U'R'FRUR'U'F'"));
const fortytwo = reverseAlgo(convertRuwixAlgo("R'U'RU'R'UURFRUR'U'F'"));
const fortythree = reverseAlgo(convertRuwixAlgo("B'U'R'URB"));
const fortyfour = reverseAlgo(convertRuwixAlgo("fRUR'U'f'"));
const fortyfive = reverseAlgo(convertRuwixAlgo("FRUR'U'F'"));
const fortysix = reverseAlgo(convertRuwixAlgo("R'U'R'FRF'UR"));
const fortyseven = reverseAlgo(convertRuwixAlgo("b'U'R'URU'R'URb"));
const fortyeight = reverseAlgo(convertRuwixAlgo("FRUR'U'RUR'U'F'"));
const fortynine = reverseAlgo(convertRuwixAlgo("RB'R'R'FRRBR'R'F'R"));
const fifty = reverseAlgo(convertRuwixAlgo("r'UrrU'r'r'U'rrUr'"));
const fiftyone = reverseAlgo(convertRuwixAlgo("fRUR'U'RUR'U'f'"));
const fiftytwo = reverseAlgo(convertRuwixAlgo("R'F'U'FU'RUR'UR"));
const fiftythree = reverseAlgo(convertRuwixAlgo("r'UURUR'U'RUR'Ur"));
const fiftyfour = reverseAlgo(convertRuwixAlgo("rU'U'R'U'RUR'U'RU'r'"));
const fiftyfive = reverseAlgo(convertRuwixAlgo("rU'U'R'U'r'RRUR'U'rU'r'"));
const fiftysix = reverseAlgo(convertRuwixAlgo("rUr'URU'R'URU'R'rU'r'"));
const fiftyseven = reverseAlgo(convertRuwixAlgo("RUR'U'M'URU'r'"));




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
  return algoStr
    .split('')
    .map((char, i) =>
      (char !== "'" && char !== "2") ?
        " 01" + char :
        char === "2" ?
          " 01" + algoStr[i - 1] :
          char
    )
    .join('')
    .trim();
}

// Removed unused bundle() helper

let blankBundle = (name) => {
  let cubeSizes = [];
  for (let i = 2; i <= sizeLimit; i++) cubeSizes.push(i);
  return {
    name: name,
    worksFor: cubeSizes
  }
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
        // preSolve: tempObj ? tempObj : null,
      }
    );
    // Interesting filter but all look the same, so disbaled
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
  }
  else moveSet.split(" ").forEach(e => moves.push(move(depth, e.substring(2).toUpperCase())));
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

let algorithms = [
  blankBundle("None Selected"),
  // ...generalizedBundle("Anaconda", anaconda),
  ...generalizedBundle("OLL-1", one),
  ...generalizedBundle("OLL-2", two),
  ...generalizedBundle("OLL-3", three),
  ...generalizedBundle("OLL-4", four),
  ...generalizedBundle("OLL-5", five),
  ...generalizedBundle("OLL-6", six),
  ...generalizedBundle("OLL-7", seven),
  ...generalizedBundle("OLL-8", eight),
  ...generalizedBundle("OLL-9", nine),
  ...generalizedBundle("OLL-10", ten),
  ...generalizedBundle("OLL-11", eleven),
  ...generalizedBundle("OLL-12", twelve),
  ...generalizedBundle("OLL-13", thirteen),
  ...generalizedBundle("OLL-14", fourteen),
  ...generalizedBundle("OLL-15", fifteen),
  ...generalizedBundle("OLL-16", sixteen),
  ...generalizedBundle("OLL-17", seventeen),
  ...generalizedBundle("OLL-18", eighteen),
  ...generalizedBundle("OLL-19", nineteen),
  ...generalizedBundle("OLL-20", twenty),
  ...generalizedBundle("OLL-21", twentyone),
  ...generalizedBundle("OLL-22", twentytwo),
  ...generalizedBundle("OLL-23", twentythree),
  ...generalizedBundle("OLL-24", twentyfour),
  ...generalizedBundle("OLL-25", twentyfive),
  ...generalizedBundle("OLL-26", twentysix),
  ...generalizedBundle("OLL-27", twentyseven),
  ...generalizedBundle("OLL-28", twentyeight),
  ...generalizedBundle("OLL-29", twentynine),
  ...generalizedBundle("OLL-30", thirty),
  ...generalizedBundle("OLL-31", thirtyone),
  ...generalizedBundle("OLL-32", thirtytwo),
  ...generalizedBundle("OLL-33", thirtythree),
  ...generalizedBundle("OLL-34", thirtyfour),
  ...generalizedBundle("OLL-35", thirtyfive),
  ...generalizedBundle("OLL-36", thirtysix),
  ...generalizedBundle("OLL-37", thirtyseven),
  ...generalizedBundle("OLL-38", thirtyeight),
  ...generalizedBundle("OLL-39", thirtynine),
  ...generalizedBundle("OLL-40", forty),
  ...generalizedBundle("OLL-41", fortyone),
  ...generalizedBundle("OLL-42", fortytwo),
  ...generalizedBundle("OLL-43", fortythree),
  ...generalizedBundle("OLL-44", fortyfour),
  ...generalizedBundle("OLL-45", fortyfive),
  ...generalizedBundle("OLL-46", fortysix),
  ...generalizedBundle("OLL-47", fortyseven),
  ...generalizedBundle("OLL-48", fortyeight),
  ...generalizedBundle("OLL-49", fortynine),
  ...generalizedBundle("OLL-50", fifty),
  ...generalizedBundle("OLL-51", fiftyone),
  ...generalizedBundle("OLL-52", fiftytwo),
  ...generalizedBundle("OLL-53", fiftythree),
  ...generalizedBundle("OLL-54", fiftyfour),
  ...generalizedBundle("OLL-55", fiftyfive),
  ...generalizedBundle("OLL-56", fiftysix),
  ...generalizedBundle("OLL-57", fiftyseven),

]

export default algorithms;
