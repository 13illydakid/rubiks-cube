import React, { useState } from "react";
import "./MenuOptions.css";
import algorithms from "../../cubeFunctions/algorithms";
import cube from "../../cubeFunctions/cube";

const optionLimitSOLVER = 100;

const MenuOptionsUnified = (props) => {
  const { state } = props;
  const [showOll, setShowOll] = useState(false);

  // Left group (Solver/Algorithms)
  const left = () => {
    const algorithmSet = algorithms
      .map((algo) => (
        <button
          id={algo.name}
          key={algo.name}
          className={state.activeAlgo === algo.name ? "algoButton algoActive" : "algoButton"}
          onClick={(e) => algoStart(e, props)}
        >
          text
        </button>
      ));

    const baseOptions = (
      <>
        <button className="leftButton invis"></button>
        {state.cubeDimension <= optionLimitSOLVER ? (
          <button id="Solver" key="Solver" data="Solving" onClick={optionClick} className="leftButton">
            Solver
          </button>
        ) : (
          <button className="leftButton invis"></button>
        )}
        {algorithmSet.length ? (
          <button id="Algorithms" key="Algorithms" data="None" onClick={optionClick} className="leftButton">
            Algorithms
          </button>
        ) : (
          <button className="leftButton invis"></button>
        )}
        {/* OLL moved to NewMenu overlay */}
      </>
    );

    if (state.currentFunc === "Solving") return null;
    if (state.currentFunc === "Color Picker")
      return (
        <>
          <div style={{ paddingTop: "45%" }}></div>
          <button id="ColorPicker" data="Color Picker" key="Color Picker" onClick={optionClick} className="cpButton activeMenu">
            Exit
          </button>
        </>
      );
    if (state.currentFunc === "Algorithms")
      return <div className="algoList">{algorithmSet}</div>;
    return baseOptions;
  };

  // Right group (Scramble/Reset)
  const right = () => {
    const baseOptions = (
      <>
        <button className="rightButton invis" key="Blank"></button>
        <button id="Scramble" key="Scramble" onClick={otherOptionClick} className="rightButton scramble">
          Scramble
        </button>
        <button id="Reset" key="Reset" onClick={otherOptionClick} className="rightButton reset">
          Reset
        </button>
      </>
    );

    if (state.currentFunc === "Solving" || state.currentFunc === "Color Picker" || state.currentFunc === "Algorithms")
      return <div style={{ paddingTop: "45%" }}></div>;
    return baseOptions;
  };

  function algoStart(e, props) {
    if (props.state.autoPlay || props.state.autoRewind || props.state.playOne) return;
  const cD = props.state.cubeDimension;
    const algo = e.target.id;
    const algoSet = [];
    const generated = cube.generateSolved(cD, cD, cD, "yellow", "red");
    generated.preSolveArray = [];
    algorithms.forEach((entry) => {
      if (entry.moves && entry.name === algo) {
        algoSet.push(...entry.moves.split(" "));
      }
    });

    props.setState({
      activeAlgo: algo,
      moveSet: [...algoSet],
      rubiksObject: generated.preSolveArray,
      solveable: true,
      solvedSet: [...algoSet],
      solvedSetIndex: 0,
      prevSet: [],
      autoPlay: false,
      autoRewind: false,
      autoTarget: false,
      playOne: false,
      jumpToEnd: false,
    });
  }

  function optionClick(e) {
    if (props.state.currentFunc !== "None") return;
    if (e.target.id === "ColorPicker") {
      props.setState({ activeMenu: e.target.id, isValidConfig: true });
      props.beginColorPicker();
    } else if (e.target.id === "Solver") {
      props.setState({ activeMenu: e.target.id }, props.beginSolve());
    } else if (e.target.id === "Algorithms") {
      props.setState({ activeMenu: e.target.id, currentFunc: "Algorithms", solveOnce: false, solvedSet: [], prevSet: [], moveSet: [], activeAlgo: "" });
    } else {
      props.setState({ activeMenu: e.target.id, currentFunc: "None" });
    }
  }

  function otherOptionClick(e) {
    switch (e.target.id) {
      case "Reset":
        props.setState({ activeMenu: "", currentFunc: "Reset" });
        break;
      case "Scramble":
        if (props.state.currentFunc === "None") props.beginScramble();
        break;
      default:
        props.setState({ activeMenu: e.target.id, currentFunc: "None" });
    }
  }

  return (
    <div className="menuOptionsWrapper" style={{ display: "flex", justifyContent: "space-between" }}>
      <div>{left()}</div>
      <div style={{ float: "right" }}>{right()}</div>
    </div>
  );
};

export default React.memo(MenuOptionsUnified);
