import { describe, it, expect } from 'vitest';
import { buildEngineToDisplayIndex } from '../src/utils/algorithmDisplayMapping.js';

// Minimal unit tests for the display mapping used by OLL/PLL panels

describe('buildEngineToDisplayIndex', () => {
  it('maps one-to-one moves correctly', () => {
    const algo = "R U R' U'";
    const { displayTokens, engineIdxToDisplayIdx } = buildEngineToDisplayIndex(algo);
    expect(displayTokens).toEqual(["R", "U", "R'", "U'"]);
    expect(engineIdxToDisplayIdx.length).toBe(4);
    // Each engine step highlights its own token index
    expect(engineIdxToDisplayIdx).toEqual([0, 1, 2, 3]);
  });

  it('expands double turns to two engine steps but one display token', () => {
    const algo = "R2 U2 R2";
    const { displayTokens, engineIdxToDisplayIdx } = buildEngineToDisplayIndex(algo);
    expect(displayTokens).toEqual(["R2", "U2", "R2"]);
    expect(engineIdxToDisplayIdx.length).toBe(6);
    // First two engine steps map to token 0 (R2)
    // Next two to token 1 (U2), last two to token 2 (R2)
    expect(engineIdxToDisplayIdx).toEqual([0, 0, 1, 1, 2, 2]);
  });

  it('ignores parentheses and handles rotations', () => {
    const algo = "(R U) x y' R2";
    const { displayTokens, engineIdxToDisplayIdx } = buildEngineToDisplayIndex(algo);
    // Parentheses removed from display; x, y', R2 remain
    expect(displayTokens).toEqual(["R", "U", "x", "y'", "R2"]);
    // R, U, x, y' => one engine step each; R2 => two
    expect(engineIdxToDisplayIdx.length).toBe(6);
    expect(engineIdxToDisplayIdx).toEqual([0, 1, 2, 3, 4, 4]);
  });

  it('handles slices M/E/S with suffixes', () => {
    const algo = "M2 E S'";
    const { displayTokens, engineIdxToDisplayIdx } = buildEngineToDisplayIndex(algo);
    expect(displayTokens).toEqual(["M2", "E", "S'"]);
    // M2 => 2 steps, E => 1, S' => 1
    expect(engineIdxToDisplayIdx.length).toBe(4);
    expect(engineIdxToDisplayIdx).toEqual([0, 0, 1, 2]);
  });
});
