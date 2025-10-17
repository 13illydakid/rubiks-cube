import { describe, it, expect } from 'vitest';
import * as Orientation from '../components/Orientation';

// Utilities mirroring the app's orientation logic
const facesFrom = (top, front) => {
  const map = {
    yellow: Orientation.YellowTop,
    red: Orientation.RedTop,
    blue: Orientation.BlueTop,
    orange: Orientation.OrangeTop,
    green: Orientation.GreenTop,
    white: Orientation.WhiteTop,
  };
  const table = map[top];
  return table ? table[front] : null; // [right,left,back,front,top,bottom]
};

const keyTopFront = (faces) => `${faces[4]}|${faces[3]}`; // top|front

const simulate = (faces, axis, prime) => {
  let [right, left, back, front, top, bottom] = faces;
  let newRight = right, newLeft = left, newBack = back, newFront = front, newTop = top, newBottom = bottom;
  if (axis === 'x') {
    if (!prime) { newTop = front; newBack = top; newBottom = back; newFront = bottom; }
    else { newTop = back; newBack = bottom; newBottom = front; newFront = top; }
  } else if (axis === 'y') {
    if (!prime) { newRight = front; newBack = right; newLeft = back; newFront = left; }
    else { newLeft = front; newBack = left; newRight = back; newFront = right; }
  } else if (axis === 'z') {
    if (!prime) { newRight = top; newBottom = right; newLeft = bottom; newTop = left; }
    else { newLeft = top; newBottom = left; newRight = bottom; newTop = right; }
  }
  return [newRight, newLeft, newBack, newFront, newTop, newBottom];
};

const computeSequence = (startTop, startFront, targetTop, targetFront) => {
  const startFaces = facesFrom(startTop, startFront);
  const targetKey = `${targetTop}|${targetFront}`;
  const key = keyTopFront;
  if (!startFaces) return [];
  if (key(startFaces) === targetKey) return [];
  const moves = [['x', false], ['x', true], ['y', false], ['y', true], ['z', false], ['z', true]];
  const q = [{ faces: startFaces, seq: [] }];
  const seen = new Set([key(startFaces)]);
  while (q.length) {
    const { faces, seq } = q.shift();
    for (const [axis, prime] of moves) {
      const nf = simulate(faces, axis, prime);
      const k = key(nf);
      if (seen.has(k)) continue;
      const nseq = [...seq, { axis, prime }];
      if (k === targetKey) return nseq;
      seen.add(k);
      q.push({ faces: nf, seq: nseq });
    }
  }
  return [];
};

const COLORS = ['yellow', 'red', 'blue', 'orange', 'green', 'white'];

// Build allowed top/front combos using Orientation tables
const allowedFrontsForTop = (top) => Object.keys({
  yellow: Orientation.YellowTop,
  red: Orientation.RedTop,
  blue: Orientation.BlueTop,
  orange: Orientation.OrangeTop,
  green: Orientation.GreenTop,
  white: Orientation.WhiteTop,
}[top] || {});

describe('Orientation BFS and simulation', () => {
  it('finds a sequence for every valid start/target combo', () => {
    for (const startTop of COLORS) {
      const startFronts = allowedFrontsForTop(startTop);
      for (const startFront of startFronts) {
        for (const targetTop of COLORS) {
          const targetFronts = allowedFrontsForTop(targetTop);
          for (const targetFront of targetFronts) {
            const seq = computeSequence(startTop, startFront, targetTop, targetFront);
            // Apply sequence to verify target reached
            let faces = facesFrom(startTop, startFront);
            for (const step of seq) {
              faces = simulate(faces, step.axis, step.prime);
            }
            const reached = keyTopFront(faces);
            expect(reached).toBe(`${targetTop}|${targetFront}`);
            // Optional sanity: sequence length should be small (<= 4)
            expect(seq.length).toBeLessThanOrEqual(4);
          }
        }
      }
    }
  });

  it('x/y/z simulation matches App.applyOrientationRotation semantics', () => {
    // Spot check from default (yellow top, red front)
    const start = facesFrom('yellow', 'red');
    let f;
    f = simulate(start, 'y', false); // y: left->front
    expect(keyTopFront(f)).toBe('yellow|blue');
    f = simulate(start, 'y', true); // y': right->front
    expect(keyTopFront(f)).toBe('yellow|green');
    f = simulate(start, 'x', false); // x: front->top
    expect(keyTopFront(f)).toBe('red|white'); // top becomes red; front becomes bottom(=white)
    f = simulate(start, 'x', true); // x'
    expect(keyTopFront(f)).toBe('orange|yellow');
    f = simulate(start, 'z', false); // z: left->top
    expect(keyTopFront(f)).toBe('blue|red');
    f = simulate(start, 'z', true); // z'
    expect(keyTopFront(f)).toBe('green|red');
  });
});
