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
  const [currentRun, setCurrentRun] = useState(null); // 'setup' | 'solve' | null

  // Derive highlight index from App's solvedSetIndex only during solve
  const highlightIndex = useMemo(() => {
    if (currentRun !== 'solve') return -1;
    return state.solvedSetIndex ?? -1;
  }, [state.solvedSetIndex, currentRun]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setCurrentRun(null);
    }
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
    const setupMovesArr = splitMoves(engineMoves);
    const solveMovesArr = invertMoves(setupMovesArr);
    setSelected({ name: item.name, setupMovesArr, solveMovesArr });
    // Do not start any moves on selection; wait for Run
    setCurrentRun(null);
    // If something was already running, stop it cleanly
    setState({ autoPlay: false, playOne: false });
  };

  const runSolve = () => {
    if (!selected) return;
    // Reset to solved and first run setup; when setup completes we'll auto-start solve
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setCurrentRun('setup');
    setState({
      currentFunc: 'Algorithms',
      rubiksObject: generated.tempArr,
      moveSet: [...selected.setupMovesArr],
      // Keep solve moves in solvedSet for highlighting later
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

  // Apply setup instantly without animation by computing a new rubiksObject
  const applySetupInstant = (ollName) => {
    try {
      const num = parseInt(String(ollName).replace('OLL-', ''), 10);
      const setupStr = OLLSetUP && OLLSetUP[num];
      const cDlocal = state.cubeDimension || 3;
      const generated = cube.generateSolved(cDlocal, cDlocal, cDlocal, state.topFaceColor, state.frontFaceColor);
      if (!setupStr) {
        setState({ rubiksObject: generated.tempArr });
        if (typeof reload === 'function') reload('all');
        return;
      }
      // Basic sanitize: drop parentheses and x/y/z cube rotations; split tokens
      const raw = setupStr.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
      // Translate M/E/S into 3x3 equivalents (wide+face) for immediate application
      const translated = [];
      for (const t of raw) {
        if (/^[xyz](2|'|)?$/i.test(t)) continue; // drop whole-cube rotations for setup
        const m = t.match(/^(M|E|S)(2|')?$/i);
        if (m) {
          const kind = m[1].toUpperCase();
          const suf = m[2] || '';
          if (kind === 'M') {
            if (suf === "'") translated.push("r'", "R");
            else if (suf === '2') translated.push("r2", "R2");
            else translated.push("r", "R'");
          } else if (kind === 'E') {
            if (suf === "'") translated.push("u'", "U");
            else if (suf === '2') translated.push("u2", "U2");
            else translated.push("u", "U'");
          } else if (kind === 'S') {
            if (suf === "'") translated.push("f'", "F");
            else if (suf === '2') translated.push("f2", "F2");
            else translated.push("f", "F'");
          }
        } else {
          translated.push(t);
        }
      }
      // Convert plain tokens to engine-prefixed tokens (01X, optional 2 or ')
      const engineTokens = translated.map(tok => {
        // already engine-style? keep
        if (/^\d{2}[A-Za-z](2|'|)?$/.test(tok)) return tok;
        // face or wide move with optional suffix
        if (/^[FfRrUuLlDdBb](2|'|)?$/.test(tok)) return `01${tok}`;
        return tok; // fallback
      });
      // Use move functions to apply synchronously
      const moveArray = moveFuncs.moveStringToArray(engineTokens.join(' '));
      let rubiksObject = generated.tempArr;
      let tempState = {
        cubeDimension: cDlocal,
        blockMoveLog: true,
        moveLog: '',
        solveMoves: '',
        end: 0,
        solveState: -1,
      };
      while (moveArray.length) {
        const data = moveFuncs.parseMoveArray(moveArray);
        const obj = cube.rotateCubeFace(...data, tempState.blockMoveLog, tempState.moveLog, tempState.solveMoves, tempState.end, tempState.solveState);
        rubiksObject = cube.rotateFace(obj.face, obj.turnDirection, obj.cubeDepth, obj.isMulti, cDlocal, rubiksObject);
      }
      setState({ rubiksObject, moveSet: [], prevSet: [], autoPlay: false, playOne: false });
      if (typeof reload === 'function') reload('all');
    } catch (e) {
      // Fail-safe: do nothing on error
    }
  };

  const refreshCase = () => {
    if (!selected) return;
    // Re-run full chain from solved
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setCurrentRun('setup');
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

  // After setup completes, automatically start solve
  useEffect(() => {
    if (!open) return;
    if (currentRun !== 'setup') return;
    const idle = state.start > state.end && !state.playOne;
    const setupDone = !state.moveSet || state.moveSet.length === 0;
    if (idle && setupDone && selected) {
      setCurrentRun('solve');
      setState({
        currentFunc: 'Algorithms',
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
    }
  }, [open, currentRun, state.start, state.end, state.playOne, state.moveSet, selected, setState]);

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
            onSelect={(e) => { prepareCase(item); applySetupInstant(item.name); }}
          />
        ))}
      </div>

      <div className="oll-controls">
        <button className="oll-btn" onClick={runSolve} disabled={!selected}>Run</button>
        <button className="oll-btn" onClick={pause} disabled={!selected}>Pause</button>
        <button className="oll-btn" onClick={refreshCase} disabled={!selected}>Refresh</button>
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
