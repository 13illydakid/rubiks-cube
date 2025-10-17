// Move parsing/formatting utilities with rotated face definitions.
// Rotation applied (around the right-left axis):
// Front -> Top, Top -> Back, Back -> Bottom, Bottom -> Front. Right/Left unchanged.

// Base face index mapping used across the app:
// 0:F, 1:U, 2:R, 3:B, 4:L, 5:D
const BASE_FACE_TO_INDEX = { F: 0, U: 1, R: 2, B: 3, L: 4, D: 5 };

function rotateFacesX(mapping) {
  // Use temp variables like iterative reversal to avoid overwriting
  const rotated = { ...mapping };
  const tmpFront = mapping.F;
  const tmpTop = mapping.U;
  const tmpBack = mapping.B;
  const tmpBottom = mapping.D;
  // Apply rotation: F->U, U->B, B->D, D->F
  rotated.U = tmpFront;
  rotated.B = tmpTop;
  rotated.D = tmpBack;
  rotated.F = tmpBottom;
  // R/L unchanged
  rotated.R = mapping.R;
  rotated.L = mapping.L;
  return rotated;
}

// Active mapping after rotation
const FACE_TO_INDEX = rotateFacesX(BASE_FACE_TO_INDEX);
// Inverse index -> letter
const INDEX_TO_FACE = Object.entries(FACE_TO_INDEX).reduce((acc, [letter, idx]) => {
  acc[idx] = letter;
  return acc;
}, {});

const moveFuncs = {
  parseMoveArray: function (moveArray) {
    let shifted = moveArray.shift();

    let tempFace = 0;
    let tempDirection = -1;
    let tempDepth = 1;
    let tempIsMulti = false;

    if (shifted) {
      if (shifted.length === 4) tempDirection = 0;
      tempDepth = parseInt(shifted.slice(0, 2));

      if (shifted.slice(2, 3) === shifted.slice(2, 3).toLowerCase()) {
        tempIsMulti = true;
      }

      const ch = shifted.slice(2, 3).toUpperCase();
      tempFace = FACE_TO_INDEX[ch];

      return [tempFace, tempDirection, tempDepth, tempIsMulti];
    }
  },

  convertDataToMove: function (data) {
    let move = "";
    const face = [INDEX_TO_FACE[0], INDEX_TO_FACE[1], INDEX_TO_FACE[2], INDEX_TO_FACE[3], INDEX_TO_FACE[4], INDEX_TO_FACE[5]];
    move += data[2].toString().length < 2 ? "0".concat(data[2]) : data[2];
    move += (data[3] ? face[data[0]].toLowerCase() : face[data[0]]);
    move += (data[1] === -1 ? "" : "'");
    return move;
  },

  convertMoveToData: function (move) {
    if (move.length < 2) return false;
    const face = [INDEX_TO_FACE[0], INDEX_TO_FACE[1], INDEX_TO_FACE[2], INDEX_TO_FACE[3], INDEX_TO_FACE[4], INDEX_TO_FACE[5]];
    const data = [];
    data.push(face.indexOf(move[2].toUpperCase()));
    move.length < 4 ? data.push(-1) : data.push(0);
    move[0] === '0' ? data.push(parseInt(move[1])) : data.push(parseInt(move.substring(0, 2)));
    move[2].toUpperCase() === move[2] ? data.push(false) : data.push(true);
    return data;
  },

  // Converts move string to move array
  // handle move short hand characters. ex: fx => 01Fx 02Fx; x = "" or "'" or "2"
  moveStringToArray: function (str) {
    let tempArray = str.split(" ");
    let moveArray = [];

    // Run through split string and create duplicates where needed
    // Handle other short hands
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].length === 4 && tempArray[i].slice(3, 4) === "2") {
        let tempMove = tempArray[i].slice(0, 3);
        moveArray.push(tempMove);
        moveArray.push(tempMove);
      }
      else {
        moveArray.push(tempArray[i]);
      }
    }
    return moveArray;
  },

  // generate a random move
  generateMove: function (size) {
    let maxDepth = Math.ceil(size / 2);
    let randFace = Math.floor(Math.random() * 6);
    let randTurn = Math.floor((Math.random() * 2) - 1);
    let randIsMulti = Math.floor(Math.random() * 2);
    let randDepth = 1;

    if (randFace > 2 && size % 2) maxDepth -= 1;

    if (size > 2)
      randDepth = Math.floor((Math.random() * maxDepth)) + 1;

    if (randDepth === 1) randIsMulti = 0;

    if (randDepth === Math.ceil(size / 2) && size % 2)
      randIsMulti = 0;

    return moveFuncs.convertDataToMove([randFace, randTurn, randDepth, randIsMulti]);
  },

  equivalentMove(_move, size) {
    const move = _move.split('');
    let inverted = '';
    let depth;
    if (move[0] === '0') {
      depth = size - parseInt(move[1]) + 1;
    }
    else {
      depth = size - parseInt(move[0] + move[1]) + 1;
    }

    if (depth < 10) {
      inverted += `0${depth}`
    }
    else {
      inverted += `${depth}`
    }

    switch (move[2]) {
      case 'F': inverted += 'B'; break;
      case 'f': inverted += 'b'; break;
      case 'U': inverted += 'D'; break;
      case 'u': inverted += 'd'; break;
      case 'R': inverted += 'L'; break;
      case 'r': inverted += 'l'; break;
      case 'B': inverted += 'F'; break;
      case 'b': inverted += 'f'; break;
      case 'L': inverted += 'R'; break;
      case 'l': inverted += 'r'; break;
      case 'D': inverted += 'U'; break;
      case 'd': inverted += 'u'; break;
      default:
    }

    if (move.length < 4) inverted += "'";
    return inverted;
  },

  checkMoveEquivalence(dragMove, nextMove, size) {
    if (nextMove.toLowerCase() === nextMove) {
      if (dragMove.toLowerCase().slice(2) === nextMove.slice(2)) {
        if (parseInt(dragMove.slice(0, 2)) <= parseInt(nextMove.slice(0, 2)))
          return true;
      }
      else if (moveFuncs.equivalentMove(dragMove, size).toLowerCase().slice(2) === nextMove.slice(2)) {
        if (parseInt(moveFuncs.equivalentMove(dragMove, size).slice(0, 2)) <= parseInt(nextMove.slice(0, 2)))
          return true;
      }
    }
    if (dragMove === nextMove || moveFuncs.equivalentMove(dragMove, size) === nextMove) {
      return true;
    }
    return false;
  }
}

export default moveFuncs;
