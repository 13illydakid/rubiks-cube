import React, { useMemo, useState, useEffect } from "react";
import ollAlgorithms, { ollDisplay, OLLSetUP } from "../../cubeFunctions/algorithms";
import moveFuncs from "../../cubeFunctions/move";
import cube from "../../cubeFunctions/cube";
import "./OLL.css";

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

// Group a notation string by parentheses blocks: text outside parentheses grouped together,
// and each parenthesized block kept as a single element (including the parentheses).
function groupByParens(str) {
  const res = [];
  let i = 0;
  let outside = '';
  while (i < str.length) {
    const ch = str[i];
    if (ch === '(') {
      // push any pending outside text
      if (outside.trim()) res.push(outside.trim());
      outside = '';
      // capture until matching ')'
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

const OLLItem = ({ name, notation, selected, onSelect }) => {
  const groups = useMemo(() => groupByParens(notation || ''), [notation]);
  return (
    <div className={"oll-item" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="oll-title">{name}</div>
      <div className="oll-notation" title={notation}>
        {groups.map((g, i) => (
          <span key={i} className="oll-token">{g}</span>
        ))}
      </div>
    </div>
  );
};

const OLLPanel = (props) => {
  const { state, setState, open, reload, playOne, onClose } = props;
  const cD = state.cubeDimension || 3;

  // Build OLL list for 3x3
  const ollList = useMemo(() => {
    // Use human-readable strings for display (from OLL object)
    const display = (ollDisplay || []).filter((a) => a.name?.startsWith("OLL-"));
    return display.map((a) => ({ name: a.name, moves: a.display }));
  }, []);

  // Map: OLL name -> engine-friendly move string from algorithms default export
  const engineAlgoByName = useMemo(() => {
    const map = new Map();
    // generalizedBundle emits entries for sizes 3..N in order; keep first (3x3) for each name
    (ollAlgorithms || []).forEach((a) => {
      if (a && a.name && a.name.startsWith('OLL-') && a.moves) {
        if (!map.has(a.name)) {
          map.set(a.name, a.moves);
        }
      }
    });
    return map;
  }, []);

  const [selected, setSelected] = useState(null); // { name, setupMovesArr, solveMovesArr }
  // No setup/solve phases; we play algorithm only

  // Derive highlight index from App's solvedSetIndex only during solve
  const highlightIndex = useMemo(() => state.solvedSetIndex ?? -1, [state.solvedSetIndex]);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  // Drive autoplay by nudging the engine to execute when a move is queued
  useEffect(() => {
    if (!open) return;
    if (!state.autoPlay) return;
    // Engine is idle when not currently animating a rotation (start > end)
    const idle = state.start > state.end && !state.playOne;
    if (idle && state.moveSet && state.moveSet.length) {
      if (typeof playOne === 'function') {
        playOne({ state, setState });
      } else {
        // Fallback: set playOne flag directly
        setState({ playOne: true, prevSet: [...state.prevSet, state.moveSet[0]] });
      }
    }
  }, [state.start, state.end, state.autoPlay, state.moveSet, state.playOne, open]);

  const prepareCase = (item) => {
    // Use engine-friendly sequence for playback
    const engineMoves = engineAlgoByName.get(item.name) || '';
    // console.log(`engineMoves: ${engineMoves}`);
    const solveMovesArr = splitMoves(engineMoves);
    // console.log(`setupMovesArr: ${setupMovesArr}`);
    const setupMovesArr = invertMoves(solveMovesArr);
    // console.log(`solveMovesArr: ${solveMovesArr}`);
    setSelected({ name: item.name, setupMovesArr, solveMovesArr });
    // Stop any running autoplay and trigger App-level Reset for a reliable solved state
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

  const runSolve = () => {
    if (!selected) return;
    // Keep simple: start algorithm from a freshly solved cube state we create locally
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setState({
      currentFunc: 'Algorithms',
      rubiksObject: generated.tempArr,
      moveSet: [...selected.solveMovesArr],
      solvedSet: [...selected.solveMovesArr],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: true,
      playOne: true,
      autoRewind: false,
      autoTarget: false,
      jumpToEnd: false,
    });
    if (typeof reload === 'function') reload('all');
  };

  const pause = () => setState({ autoPlay: false });

  // Adjust autoplay speed. If currently running an algorithm, enqueue a speed change tuple
  // understood by App.changeSpeed; otherwise, set speed immediately.
  const applySpeed = (speed, rotationSpeed, name) => {
    // When a function is active (Algorithms/Solving), the app consumes [speed, rotationSpeed, name]
    // tuples from moveSet to change speed mid-run. Otherwise, set immediately.
    if (state.currentFunc !== 'None' && (state.autoPlay || state.playOne)) {
      setState({ moveSet: [[speed, rotationSpeed, name], ...state.moveSet] });
    } else {
      // Immediate change mimics changeSpeed's else-branch
      setState({ currentSpeed: name, speed, start: speed, end: 0, rotationSpeed });
    }
  };

  // No setup preview or chain: OLLSetUP retained in algorithms for reference only

  const refreshCase = () => {
    // Trigger App-level Reset to ensure a safe solved state even mid-animation
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

  // No setup/solve chain effect

  if (!open) return null;

  return (
    <div className="oll-panel" data-no-camera-reset>
      <div className="oll-header">
        <div className="oll-title-main">OLL (CFOP)</div>
        <div className="oll-header-right">
          <div className="oll-sub">3x3 cases: {ollList.length}</div>
          <button
            className="oll-close"
            aria-label="Close OLL panel"
            title="Close"
            onClick={() => {
              if (typeof onClose === 'function') onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div className="oll-list">
        {ollList.map((item) => (
          <OLLItem
            key={item.name}
            name={item.name}
            notation={item.moves}
            selected={selected?.name === item.name}
            onSelect={(e) => { prepareCase(item); }}
          />
        ))}
      </div>

      <div className="oll-controls">
        <button
          className="oll-btn"
          onClick={() => {
            // Toggle play/pause behavior
            if (!selected) return;
            if (state.autoPlay || state.playOne) {
              // Pause
              setState({ autoPlay: false, playOne: false });
            } else {
              // Play (resume or start). If there is already a queue, resume; otherwise start from solved
              if (state.moveSet && state.moveSet.length) {
                setState({ autoPlay: true, playOne: true });
                // Log the current state's moveSet when play is pressed
                try { console.log('Starting autoplay with moveSet:', state.moveSet); } catch {}
              } else {
                // Start algorithm-only from solved
                const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
                const nextMoveSet = selected ? [...selected.solveMovesArr] : [];
                setState({
                  currentFunc: 'Algorithms',
                  rubiksObject: generated.tempArr,
                  moveSet: nextMoveSet,
                  solvedSet: selected ? [...selected.solveMovesArr] : [],
                  solvedSetIndex: 0,
                  prevSet: [],
                  autoPlay: true,
                  playOne: true,
                  autoRewind: false,
                  autoTarget: false,
                  jumpToEnd: false,
                });
                if (typeof reload === 'function') reload('all');
                try { console.log('Starting autoplay with moveSet:', nextMoveSet); } catch {}
              }
            }
          }}
          disabled={!selected}
        >
          {(state.autoPlay || state.playOne) ? 'Pause' : 'Play'}
        </button>
        <button className="oll-btn" onClick={refreshCase}>Refresh</button>
      </div>

      {/* Lightweight speed presets focused on slowing autoplay; can adjust mid-run */}
      <div className="oll-speed-controls">
        <span className="label">Speed:</span>
        <button className="oll-btn" onClick={() => applySpeed(1.5, 1050, 'Slowest')}>Slowest</button>
        <button className="oll-btn" onClick={() => applySpeed(3, 750, 'Slower')}>Slower</button>
        <button className="oll-btn" onClick={() => applySpeed(5, 500, 'Slow')}>Slow</button>
        <button className="oll-btn" onClick={() => applySpeed(7.5, 350, 'Medium')}>Medium</button>
      </div>

      {selected && (
        <div className="oll-notation-view" data-no-camera-reset>
          <div className="label">Algorithm:</div>
          <div className="steps">
            {selected.solveMovesArr.map((step, idx) => {
              // Remove numeric prefixes (first two digits) and any parentheses for visual display only
              const pretty = String(step).replace(/^\d{2}/, '').replace(/[()]/g, '');
              return (
                <span key={idx} className={idx === highlightIndex ? "step active" : "step"}>{pretty}</span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OLLPanel);
