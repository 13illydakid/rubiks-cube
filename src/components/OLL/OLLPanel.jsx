import React, { useMemo, useState, useEffect } from "react";
import ollAlgorithms, { ollDisplay } from "../../cubeFunctions/algorithms";
import cube from "../../cubeFunctions/cube";
import "./OLL.css";

// Preload OLL case images (1.png ... 57.png)
const ollImageModules = import.meta.glob("../../assets/oll/*.png", { eager: true, import: 'default' });
const ollImageByNumber = (() => {
  const map = new Map();
  for (const path in ollImageModules) {
    const filename = path.split('/').pop(); // e.g., '12.png'
    const base = filename?.split('.')?.[0] || '';
    const num = parseInt(base, 10);
    if (!Number.isNaN(num)) {
      map.set(String(num), ollImageModules[path]);
    }
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
  // Determine the per-case thumbnail based on name 'OLL-<n>'
  const thumbSrc = useMemo(() => {
    const numStr = String(name || '').replace(/^OLL-/i, '');
    return ollImageByNumber.get(numStr) || null;
  }, [name]);
  return (
    <div className={"oll-item" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="oll-item-container">
        {thumbSrc ? (
          <img className="oll-thumb" src={thumbSrc} alt={`${name} diagram`} loading="lazy" />
        ) : (
          <div className="oll-thumb oll-thumb--placeholder" aria-hidden="true" />
        )}
        <div className="oll-title-notation-container">
          <div className="oll-title">{name}</div>
          <div className="oll-notation" title={notation}>
            {groups.map((g, i) => (
              <span key={i} className="oll-token">{g}</span>
            ))}
          </div>
        </div>
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

  // No selected-case diagram needed anymore

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
  setSelected({ name: item.name, setupMovesArr, solveMovesArr, displayStr: item.moves });
    // Immediately initiate autoplay to "set up" the case from a solved cube using moveSet (setup/inverted moves)
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setState({
      currentFunc: 'Algorithms',
      rubiksObject: generated.tempArr,
      // Use setup/inverted moves to create the OLL case on the cube
      moveSet: [...setupMovesArr],
      // Keep the forward algorithm for display/highlight and later Play
      solvedSet: [...solveMovesArr],
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

  const runSolve = () => {
    if (!selected) return;
    // Keep simple: start algorithm from a freshly solved cube state we create locally
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setState({
      currentFunc: 'Algorithms',
      rubiksObject: generated.tempArr,
      moveSet: [...selected.setupMovesArr],
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
                try {
                  console.log('Starting autoplay with moveSet:', state.moveSet);
                  console.log('Starting autoplay with solveSet:', state.solvedSet);
                } catch {}
              } else {
                // Start the forward algorithm (solvedSet) from the current cube state
                // At this point, selecting a case has already set the cube into the OLL case by running setup moves.
                const nextSolveSet = selected ? [...selected.solveMovesArr] : [];
                setState({
                  currentFunc: 'Algorithms',
                  moveSet: nextSolveSet,
                  // Keep solvedSet for highlighting; we can reuse the same array
                  solvedSet: selected ? [...selected.solveMovesArr] : [],
                  solvedSetIndex: 0,
                  prevSet: [],
                  autoPlay: true,
                  playOne: true,
                  autoRewind: false,
                  autoTarget: false,
                  jumpToEnd: false,
                });
                try { console.log('Starting autoplay with solveSet as moveSet:', nextSolveSet); } catch {}
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

      {selected && (() => {
        // Display the original OLL notation exactly (with parentheses and x/y/z), and
        // map engine step index to display token index for highlighting.
  const size = state.cubeDimension || 3;
  const raw = String(selected.displayStr || '').replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim();
        const tokens = raw.length ? raw.split(/\s+/) : [];
  // console.log("tokens:", tokens);
        const displayTokens = [];
        const engineIdxToDisplayIdx = [];
        const pushMap = (count) => { for (let i = 0; i < count; i++) engineIdxToDisplayIdx.push(displayTokens.length); };

        const isParen = (t) => t === '(' || t === ')';
        const rotMatch = (t) => t.match(/^([xyz])(2|'|)?$/i);
  const sliceMatch = (t) => t.match(/^([MES])((2')|2|'|)?$/i);
  const moveMatch = (t) => t.match(/^([RULDBFruldbf])((2')|2|'|)?$/);

        tokens.forEach((t) => {
          if (!t) return;
          const rot = rotMatch(t);
          const sl = sliceMatch(t);
          const mv = moveMatch(t);
          if (isParen(t)) {
            // Skip displaying parentheses tokens
            return;
          }
          // Push visible token, then map engine steps for it
          displayTokens.push(t);
          if (rot) {
            // Whole-cube rotation counts as one engine token (two if 2)
            const raw = rot[2] || '';
            const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
            if (suf === '2') pushMap(2);
            else pushMap(1);
          } else if (sl) {
            // Slice is a single engine token (two if 2)
            const raw = sl[2] || '';
            const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
            if (suf === '2') pushMap(2);
            else pushMap(1);
          } else if (mv) {
            // Standard face move; "2" is two tokens, otherwise one
            const raw = mv[2] || '';
            const suf = raw && raw.startsWith('2') ? '2' : raw === "'" ? "'" : '';
            if (suf === '2') pushMap(2);
            else pushMap(1);
          } else {
            // Unknown token: do not map
          }
        });

        const dispIdx = engineIdxToDisplayIdx[state.solvedSetIndex] ?? -1;
        return (
        <div className="oll-detail" data-no-camera-reset>
          <div className="oll-notation-view">
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

export default React.memo(OLLPanel);
