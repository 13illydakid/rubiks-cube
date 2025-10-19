import React, { useMemo, useState, useEffect } from "react";
import ollAlgorithms from "../../cubeFunctions/algorithms";
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

const OLLItem = ({ name, notation, selected, onSelect }) => {
  return (
    <div className={"oll-item" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="oll-title">{name}</div>
      <div className="oll-notation" title={notation}>{notation}</div>
    </div>
  );
};

const OLLPanel = (props) => {
  const { state, setState, open, reload, playOne, onClose } = props;
  const cD = state.cubeDimension || 3;

  // Build OLL list for 3x3
  const ollList = useMemo(() => {
    return ollAlgorithms
      .filter((a) => a.name?.startsWith("OLL-") && a.worksFor?.includes(3))
      .map((a) => ({ name: a.name, moves: a.moves }));
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
    const setupMovesArr = splitMoves(item.moves);
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
            onSelect={() => prepareCase(item)}
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
            {selected.solveMovesArr.map((step, idx) => (
              <span key={idx} className={idx === highlightIndex ? "step active" : "step"}>{step}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OLLPanel);
