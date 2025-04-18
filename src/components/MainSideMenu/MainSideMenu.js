import React from "react";
import "./MainSideMenu.css";
import "../SideView/SideView.css";
import algs from "../../cubeFunctions/algorithms"
import oll from "../../cubeFunctions/oll";
import MainSideMenuButton from "./MainSideMenuButton";

const MainSideMenu = props => {

  let algorithmSet = algs.filter(algo => algo.worksFor.includes(props.state.cubeDimension));
  let ollSet = oll.filter(algo => algo.worksFor.includes(props.state.cubeDimension));

  function colorPicker() {
    if (props.state.currentFunc === "None") {
      props.setState({ activeMenu: "ColorPicker", isValidConfig: true });
      props.beginColorPicker();
    }
  }

  function solver() {
    if (props.state.currentFunc === "None")
      props.setState({ activeMenu: "Solver" }, props.beginSolve());
  }

  function scramble() {
    if (props.state.currentFunc === "None") {
      props.setState({ activeMenu: "Scrambling" }, props.beginScramble());
    }
  }

  function reset() {
    props.setState({ activeMenu: "", currentFunc: "Reset" })
  }

  function algorithms() {
    if (props.state.currentFunc === "None")
      props.setState({ activeMenu: "Algorithms", currentFunc: "Algorithms", solveOnce: false, solvedSet: [], prevSet: [], moveSet: [] });
  }
  function olls() {
    if (props.state.currentFunc === "None")
      props.setState({ activeMenu: "Olls", currentFunc: "Olls", solveOnce: false, solvedSet: [], prevSet: [], moveSet: [] });
  }

  return (
    <div className="sideMenuWrapper sideLimit">
      {props.state.cubeDimension <= 100 ? <MainSideMenuButton
        name="Top Face"
        onClick={colorPicker}
      /> : []}
      {props.state.cubeDimension <= 100 ?
        <MainSideMenuButton
          name="Solver"
          onClick={solver}
        /> : []}
      {algorithmSet.length > 0 ? <MainSideMenuButton
        name="Patterns"
        onClick={algorithms}
      /> : []}
      {ollSet.length > 0 ? <MainSideMenuButton
        name="OLL"
        onClick={olls}
      /> : []}
      {/* <MainSideMenuButton
                name="Moves"
            /> */}
      <MainSideMenuButton
        name="Scramble"
        onClick={scramble}
      />
      <MainSideMenuButton
        name="Reset"
        onClick={reset}
      />
    </div>
  )
}

export default MainSideMenu;
