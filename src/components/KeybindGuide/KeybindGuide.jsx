import React from "react";
import "./KeybindGuide.css";

const Row = ({ notation, keys }) => (
  <div className="kb-row">
    <span className="kb-keys">{keys}</span>
    <span className="kb-notation">{notation}</span>
  </div>
);

// Group items so each base move (e.g., R) stacks with its prime (R') vertically in the same column
const Section = ({ title, items, className }) => {
  // Build stable base-> { main, prime } groups keeping original order of first appearance
  const map = new Map();
  const order = [];
  items.forEach((it) => {
    const base = it.notation.replace(/'/g, "");
    if (!map.has(base)) {
      map.set(base, { base, main: null, prime: null });
      order.push(base);
    }
    const bucket = map.get(base);
    if (it.notation.includes("'")) bucket.prime = it; else bucket.main = it;
  });

  return (
    <div className={`kb-section ${className || ''}`}>
      <div className="kb-title">{title}</div>
      {/* Matrix of columns; each column contains up to two rows: non-prime then prime */}
      <div className="kb-matrix">
        {order.map((base) => {
          const g = map.get(base);
          return (
            <div className="kb-colpair" key={base}>
              {g.main && (
                <Row key={g.main.notation + g.main.keys} notation={g.main.notation} keys={g.main.keys} />
              )}
              {g.prime && (
                <Row key={g.prime.notation + g.prime.keys} notation={g.prime.notation} keys={g.prime.keys} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KeybindGuide = () => {
  const faces = [
    { notation: "R", keys: "r" },
    { notation: "R'", keys: "shift + r" },
    { notation: "L", keys: "l" },
    { notation: "L'", keys: "shift + l" },
    { notation: "U", keys: "u" },
    { notation: "U'", keys: "shift + u" },
    { notation: "D", keys: "d" },
    { notation: "D'", keys: "shift + d" },
    { notation: "F", keys: "f" },
    { notation: "F'", keys: "shift + f" },
    { notation: "B", keys: "b" },
    { notation: "B'", keys: "shift + b" },
  ];

  // Wide two-layer: Option/Alt + key; add Shift for prime
  const wide = [
    { notation: "r", keys: "option + r" },
    { notation: "r'", keys: "option + shift + r" },
    { notation: "l", keys: "option + l" },
    { notation: "l'", keys: "option + shift + l" },
    { notation: "u", keys: "option + u" },
    { notation: "u'", keys: "option + shift + u" },
    { notation: "d", keys: "option + d" },
    { notation: "d'", keys: "option + shift + d" },
    { notation: "f", keys: "option + f" },
    { notation: "f'", keys: "option + shift + f" },
    { notation: "b", keys: "option + b" },
    { notation: "b'", keys: "option + shift + b" },
  ];

  // Slice moves: note: uppercase often yields prime in this app
  const slices = [
    { notation: "M", keys: "shift + m" },
    { notation: "M'", keys: "m" },
    { notation: "E", keys: "e" },
    { notation: "E'", keys: "shift + e" },
    { notation: "S", keys: "s" },
    { notation: "S'", keys: "shift + s" },
  ];

  const rotations = [
    { notation: "x", keys: "x" },
    { notation: "x'", keys: "shift + x" },
    { notation: "y", keys: "y" },
    { notation: "y'", keys: "shift + y" },
    { notation: "z", keys: "z" },
    { notation: "z'", keys: "shift + z" },
  ];

  return (
    <aside className="keybind-guide" data-no-camera-reset>
      <div className="kb-header">Keybind guide</div>
      <div className="kb-columns">
        <div className="kb-col">
          <Section title="Faces" items={faces} />
          <Section title="Slices" items={slices} />
          <Section title="Rotations" items={rotations} />
        </div>
        <div className="kb-col">
          <Section title="Wide (two-layer)" items={wide} className="wide" />
          <div className="kb-section">
            <div className="kb-title">Prime info</div>
            <div className="kb-info">
              <div><b>'</b> (prime) = reverse direction of the move.</div>
              <div><b>2</b> = 180° turn. <b>2'</b> is also 180° in this app.</div>
              <div>Parentheses group moves; a suffix repeats the group.</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(KeybindGuide);
