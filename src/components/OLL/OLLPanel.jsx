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
  const { state, setState, open, reload } = props;
  const cD = state.cubeDimension || 3;

  // Build OLL list for 3x3
  const ollList = useMemo(() => {
    return ollAlgorithms
      .filter((a) => a.name?.startsWith("OLL-") && a.worksFor?.includes(3))
      .map((a) => ({ name: a.name, moves: a.moves }));
  }, []);

  const [selected, setSelected] = useState(null); // { name, setupMovesArr, solveMovesArr }
  const [currentRun, setCurrentRun] = useState(null); // 'setup' | 'solve' | null

  // Derive highlight index from App's solvedSetIndex when our run is active
  const highlightIndex = useMemo(() => {
    if (!currentRun) return -1;
    return state.solvedSetIndex ?? -1;
  }, [state.solvedSetIndex, currentRun]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setCurrentRun(null);
    }
  }, [open]);

  const prepareCase = (item) => {
    const setupMovesArr = splitMoves(item.moves);
    const solveMovesArr = invertMoves(setupMovesArr);
    setSelected({ name: item.name, setupMovesArr, solveMovesArr });
    // Arrange cube into case by auto-running setup
    setCurrentRun("setup");
    // Reset to a solved cube using current orientation to ensure a consistent starting state
    const generated = cube.generateSolved(cD, cD, cD, state.topFaceColor, state.frontFaceColor);
    setState({
      currentFunc: "Algorithms",
      rubiksObject: generated.tempArr,
      moveSet: [...setupMovesArr],
      solvedSet: [...setupMovesArr],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: true,
      autoRewind: false,
      autoTarget: false,
      playOne: false,
      jumpToEnd: false,
    });
    if (typeof reload === "function") reload('all');
  };

  const runSolve = () => {
    if (!selected) return;
    setCurrentRun("solve");
    setState({
      currentFunc: "Algorithms",
      moveSet: [...selected.solveMovesArr],
      solvedSet: [...selected.solveMovesArr],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: true,
      autoRewind: false,
      autoTarget: false,
      playOne: false,
      jumpToEnd: false,
    });
  };

  const pause = () => setState({ autoPlay: false });

  const refreshCase = () => {
    if (!selected) return;
    // Re-run setup from current cube state; simplest approach is to play setup again
    setCurrentRun("setup");
    setState({
      currentFunc: "Algorithms",
      moveSet: [...selected.setupMovesArr],
      solvedSet: [...selected.setupMovesArr],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: true,
      autoRewind: false,
      autoTarget: false,
      playOne: false,
      jumpToEnd: false,
    });
  };

  if (!open) return null;

  return (
    <div className="oll-panel" data-no-camera-reset>
      <div className="oll-header">
        <div className="oll-title-main">OLL (CFOP)</div>
        <div className="oll-sub">3x3 cases: {ollList.length}</div>
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
