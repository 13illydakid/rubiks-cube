import React, { useMemo, useState, useEffect } from "react";
import { pllAlgorithms, pllDisplay } from "../../cubeFunctions/algorithms";
import cube from "../../cubeFunctions/cube";
import "./PLL.css";
import { buildEngineToDisplayIndex } from "../../utils/algorithmDisplayMapping";

// Preload PLL case images (e.g., H.png, Ua.png ...)
const pllImageModules = import.meta.glob("../../assets/pll/*.png", { eager: true, import: 'default' });
const pllImageByKey = (() => {
  const map = new Map();
  for (const path in pllImageModules) {
    const filename = path.split('/').pop(); // e.g., 'Ua.png'
    const base = filename?.split('.')?.[0] || '';
    if (base) map.set(base, pllImageModules[path]);
  }
  return map;
})();

// Helper: split a space-delimited moves string into an array of tokens
const splitMoves = (movesStr) => (movesStr || "").trim().split(/\s+/).filter(Boolean);

// Helper: invert a moves array (to get the solve sequence from setup)
const invertMoves = (movesArr) => {
  const inv = [];
  for (let i = movesArr.length - 1; i >= 0; i--) {
    const m = movesArr[i];
    if (!m) continue;
    if (m.endsWith("'")) inv.push(m.slice(0, -1));
    else inv.push(m + "'");
  }
  return inv;
};

// Group parentheses blocks for display tokens
function groupByParens(str) {
  const res = [];
  let i = 0;
  let outside = '';
  while (i < str.length) {
    const ch = str[i];
    if (ch === '(') {
      if (outside.trim()) res.push(outside.trim());
      outside = '';
      let j = i + 1;
      let depth = 1;
      let block = '(';
      while (j < str.length && depth > 0) {
        const c = str[j];
        block += c;
        if (c === '(') depth++;
        else if (c === ')') depth--;
        j++;
      }
      res.push(block);
      i = j;
    } else {
      outside += ch;
      i++;
    }
  }
  if (outside.trim()) res.push(outside.trim());
  return res;
}

const PLLItem = ({ name, notation, selected, onSelect }) => {
  // name is like 'PLL-Ua' → key 'Ua'
  const key = useMemo(() => String(name || '').replace(/^PLL-/i, ''), [name]);
  const thumbSrc = useMemo(() => pllImageByKey.get(key) || null, [key]);
  const groups = useMemo(() => groupByParens(notation || ''), [notation]);
  const tokenCount = useMemo(() => (String(notation || '')
    .replace(/[()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length), [notation]);
  const notationClass = useMemo(() => {
    let cls = "pll-notation";
    if (tokenCount > 12) cls += " wrap"; // allow second row for longer algs
    if (tokenCount > 16) cls += " compact"; // shrink a bit more for the longest
    return cls;
  }, [tokenCount]);
  return (
    <div className={"pll-item" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="pll-item-container">
        {thumbSrc ? (
          <img className="pll-thumb" src={thumbSrc} alt={`${name} diagram`} loading="lazy" />
        ) : (
          <div className="pll-thumb pll-thumb--placeholder" aria-hidden="true" />
        )}
        <div className="pll-title-notation-container">
          <div className="pll-title">{name}</div>
          <div className={notationClass} title={notation}>
            {groups.map((g, i) => (
              <span key={i} className="pll-token">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PLLPanel = (props) => {
  const { state, setState, open, reload, playOne, onClose } = props;
  const cD = state.cubeDimension || 3;

  // Build PLL list from pllDisplay
  const pllList = useMemo(() => {
    const display = (pllDisplay || []).filter((a) => a.name?.startsWith("PLL-"));
    return display.map((a) => ({ name: a.name, moves: a.display }));
  }, []);

  // Map: PLL name -> engine move string from pllAlgorithms (first occurrence for 3x3)
  const engineAlgoByName = useMemo(() => {
    const map = new Map();
    (pllAlgorithms || []).forEach((a) => {
      if (a && a.name && a.name.startsWith('PLL-') && a.moves) {
        if (!map.has(a.name)) {
          map.set(a.name, a.moves);
        }
      }
    });
    return map;
  }, []);

  const [selected, setSelected] = useState(null);

  useEffect(() => { if (!open) setSelected(null); }, [open]);

  // Drive autoplay when idle and queue has items
  useEffect(() => {
    if (!open) return;
    if (!state.autoPlay) return;
    const idle = state.start > state.end && !state.playOne;
    if (idle && state.moveSet && state.moveSet.length) {
      if (typeof playOne === 'function') playOne({ state, setState });
      else setState({ playOne: true, prevSet: [...state.prevSet, state.moveSet[0]] });
    }
  }, [state.start, state.end, state.autoPlay, state.moveSet, state.playOne, open]);

  const prepareCase = (item) => {
    const engineMoves = engineAlgoByName.get(item.name) || '';
    const solveMovesArr = splitMoves(engineMoves);
    const setupMovesArr = invertMoves(solveMovesArr);
    setSelected({ name: item.name, setupMovesArr, solveMovesArr, displayStr: item.moves });
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setState({
      currentFunc: 'Algorithms',
      rubiksObject: generated.tempArr,
      moveSet: [...setupMovesArr],
      solvedSet: [...solveMovesArr],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: true,
      playOne: true,
      autoRewind: false,
      autoTarget: false,
      jumpToEnd: false,
      highlightEnabled: false, // disable highlighting during setup autoplay
    });
    if (typeof reload === 'function') reload('all');
  };

  const applySpeed = (speed, rotationSpeed, name) => {
    if (state.currentFunc !== 'None' && (state.autoPlay || state.playOne)) {
      setState({ moveSet: [[speed, rotationSpeed, name], ...state.moveSet] });
    } else {
      setState({ currentSpeed: name, speed, start: speed, end: 0, rotationSpeed });
    }
  };

  const refreshCase = () => {
    setState({
      autoPlay: false,
      playOne: false,
      moveSet: [],
      prevSet: [],
      solvedSet: [],
      solvedSetIndex: 0,
      currentFunc: 'Reset',
    });
  };

  if (!open) return null;

  return (
    <div className="pll-panel" data-no-camera-reset>
      <div className="pll-header">
        <div className="pll-title-main">PLL (CFOP)</div>
        <div className="pll-header-right">
          <div className="pll-sub">cases: {pllList.length}</div>
          <button className="pll-close" aria-label="Close PLL panel" title="Close" onClick={() => { if (typeof onClose === 'function') onClose(); }}>×</button>
        </div>
      </div>

      <div className="pll-list">
        {pllList.map((item) => (
          <PLLItem
            key={item.name}
            name={item.name}
            notation={item.moves}
            selected={selected?.name === item.name}
            onSelect={() => prepareCase(item)}
          />
        ))}
      </div>

      <div className="pll-controls">
        <button
          className="pll-btn"
          onClick={() => {
            if (!selected) return;
            if (state.autoPlay || state.playOne) {
              setState({ autoPlay: false, playOne: false });
            } else {
              if (state.moveSet && state.moveSet.length) {
                // Continue setup or existing queue, keep highlighting off until solve starts
                setState({ autoPlay: true, playOne: true, highlightEnabled: false });
              } else {
                const nextSolveSet = selected ? [...selected.solveMovesArr] : [];
                setState({
                  currentFunc: 'Algorithms',
                  moveSet: nextSolveSet,
                  solvedSet: selected ? [...selected.solveMovesArr] : [],
                  solvedSetIndex: 0,
                  prevSet: [],
                  autoPlay: true,
                  playOne: true,
                  autoRewind: false,
                  autoTarget: false,
                  jumpToEnd: false,
                  highlightEnabled: true, // enable highlighting during solve playback
                });
              }
            }
          }}
          disabled={!selected}
        >
          {(state.autoPlay || state.playOne) ? 'Pause' : 'Play'}
        </button>
        <button className="pll-btn" onClick={refreshCase}>Refresh</button>
      </div>

      <div className="pll-speed-controls">
        <span className="label">Speed:</span>
        <button className="pll-btn" onClick={() => applySpeed(1.5, 1050, 'Slowest')}>Slowest</button>
        <button className="pll-btn" onClick={() => applySpeed(3, 750, 'Slower')}>Slower</button>
        <button className="pll-btn" onClick={() => applySpeed(5, 500, 'Slow')}>Slow</button>
        <button className="pll-btn" onClick={() => applySpeed(7.5, 350, 'Medium')}>Medium</button>
        <button className="pll-btn" onClick={() => applySpeed(10, 50, 'Fast')}>Fast</button>
      </div>

  {selected && (() => {
        const { displayTokens, engineIdxToDisplayIdx } = buildEngineToDisplayIndex(selected.displayStr);
        const dispIdx = state.highlightEnabled ? (engineIdxToDisplayIdx[state.solvedSetIndex] ?? -1) : -1;
        return (
          <div className="pll-detail" data-no-camera-reset>
            <div className="pll-notation-view">
              <div className="label">Algorithm:</div>
              <div className="steps">
                {displayTokens.map((tok, idx) => {
                  const active = idx === dispIdx;
                  return (
                    <span key={idx} className={active ? "step active" : "step"}>{tok}</span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default React.memo(PLLPanel);
