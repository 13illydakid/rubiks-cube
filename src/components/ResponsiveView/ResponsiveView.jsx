import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Controls from "../Controls.jsx";
import ColorPicker from "../ColorPicker/ColorPicker.jsx";
import SideColorPicker from "../ColorPicker/SideColorPicker.jsx";
import SideColorPickerController from "../ColorPicker/SideColorPickerController.jsx";
import SolverUI from "../SolverUI/SolverUI.jsx";
import SideSolverUI from "../SolverUI/SideSolverUI.jsx";
import SideSolverControls from "../SolverUI/SideSolverControls.jsx";
import MenuOptionsUnified from "../MenuOptions/MenuOptionsUnified.jsx";
import algorithms from "../../cubeFunctions/algorithms";
import "./ResponsiveView.css";

class ResponsiveView extends Component {
  constructor(props) {
    super(props);
    this.state = { w: window.innerWidth, h: window.innerHeight };
  }

  componentDidMount() {
    this._onResize = () => this.setState({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._onResize);
  }

  // Mid-size/base layout (formerly View.jsx)
  renderBaseView() {
    const props = this.props;
    let activeMenu;
    switch (props.state.activeMenu) {
      case "Moves":
        activeMenu = <Controls {...props} />;
        break;
      case "ColorPicker":
        activeMenu = <ColorPicker {...props} />;
        break;
      case "Solver":
        activeMenu = <SolverUI {...props} />;
        break;
      case "Algorithms":
        activeMenu = <SolverUI {...props} />;
        break;
      default:
        activeMenu = "";
    }

    return (
      <div className="menuWrapper" style={{ pointerEvents: "none", display: "none" }}>
        <Row style={{ height: "100%", margin: "0px" }}>
          {props.state.activeMenu === "ColorPicker" || props.state.activeMenu === "Solver" ? null : (
            <Col key="MenuOptions" className="MenuOptions" style={{ paddingLeft: "20px", paddingBottom: "10px" }}>
              <MenuOptionsUnified {...props} />
            </Col>
          )}
          <Col
            id="menuBox"
            style={{ position: "relative", bottom: "0px", height: "100%" }}
            xs={
              props.state.currentFunc === "Color Picker" || props.state.activeMenu === "Solver"
                ? 12
                : props.state.currentFunc === "None" ||
                  props.state.currentFunc === "Scrambling" ||
                  props.state.currentFunc === "Reset"
                ? 4
                : 8
            }
          >
            {activeMenu}
          </Col>
          {props.state.activeMenu === "ColorPicker" || props.state.activeMenu === "Solver" || props.state.activeMenu === "Algorithms" ? null : null}
        </Row>
      </div>
    );
  }

  // Desktop layout (formerly SideView)
  renderDesktop() {
    const props = this.props;

    let activeMenu;
    let activeMenuBottom;
    let activeMenuExit;

    const exitConfirm = () => {
      const el = document.querySelector(".warningPopupSolver");
      if (el) el.style.visibility = "visible";
      const c = document.querySelector(".controllerBox");
      if (c) c.style.visibility = "hidden";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "hidden";
    };

    const exitCpConfirm = () => {
      const el = document.querySelector(".warningPopup");
      if (el) el.style.display = "block";
      const c = document.querySelector(".colorButtonContainer");
      if (c) c.style.visibility = "hidden";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "hidden";
    };

    const exitAlgo = () => {
      props.setState({
        activeMenu: "",
        currentFunc: "Reset",
        solvedSet: [],
        hoverData: [],
        prevSet: [],
        moveSet: [],
        isValidConfig: false,
        targetSolveIndex: -1,
        solveMoves: "",
        autoPlay: false,
        autoRewind: false,
        autoTarget: false,
        playOne: false,
        activeAlgo: "none",
      });
    };

    function stay() {
      const el = document.querySelector(".warningPopupSolver");
      if (el) el.style.visibility = "hidden";
      const c = document.querySelector(".controllerBox");
      if (c) c.style.visibility = "visible";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "visible";
    }

    function stayCp() {
      const el = document.querySelector(".warningPopup");
      if (el) el.style.display = "none";
      const c = document.querySelector(".colorButtonContainer");
      if (c) c.style.visibility = "visible";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "visible";
    }

    function leave(e, props) {
      const el = document.querySelector(".warningPopupSolver");
      if (el) el.style.visibility = "hidden";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "visible";
      e.stopPropagation();
      props.stopSolve();

      const active = document.querySelector(".activeMenu");
      if (active) active.classList.remove("activeMenu");

      const dataEl = document.querySelector("#solverChangeData");
      if (dataEl && dataEl.data) {
        let data = dataEl.data.split(",");
        if (data[0] === "ColorPicker") {
          props.setState({ activeMenu: "", currentFunct: "None", isValidConfig: false });
          dataEl.data = "";
          return;
        }
        const target = document.querySelector(`#${data[0]}`);
        if (target) target.classList.add("activeMenu");
        props.setState({ activeMenu: data[0], currentFunct: data[1], isValidConfig: false });
        dataEl.data = "";
      } else {
        props.setState({ activeMenu: "", currentFunct: "None", isValidConfig: false });
      }
    }

    const leaveCp = () => {
      const el = document.querySelector(".warningPopup");
      if (el) el.style.display = "none";
      const b = document.querySelector(".bottomExitDiv");
      if (b) b.style.visibility = "visible";
      this.props.endColorPicker();
      const active = document.querySelector(".activeMenu");
      if (active) active.classList.remove("activeMenu");
      const dataEl = document.querySelector("#cpChangeData");
      if (dataEl && dataEl.data) {
        let data = dataEl.data.split(",");
        if (data[0] === "Solver") {
          this.props.setState({ activeMenu: "", currentFunct: "None", isValidConfig: false });
          dataEl.data = "";
          return;
        }
        const target = document.querySelector(`#${data[0]}`);
        if (target) target.classList.add("activeMenu");
        dataEl.data = "";
        this.props.setState({ activeMenu: data[0], currentFunc: data[1], isValidConfig: false }, () => this.props.beginSolve());
      } else {
        this.props.setState({ activeMenu: "", currentFunct: "None", isValidConfig: false });
      }
    };

    const solverLeaveButton = (
      <button id="Solver" data="Solving" onClick={exitConfirm} className="exitButton">
        Exit
      </button>
    );

    const algoLeaveButton = (
      <button id="Algorithms" data="Algorithms" onClick={exitAlgo} className="exitButton">
        Exit
      </button>
    );

    const cpLeaveButton = (
      <button id="ColorPicker" data="Color Picker" onClick={exitCpConfirm} className="exitButton">
        Exit
      </button>
    );

    const confirmLeavePopup = (
      <div id="controlsPopup" className="warningPopupSolver" style={{ position: "absolute", left: "35vw", width: "30vw", bottom: "8px" }}>
        <div id="solverChangeData" data=""></div>
        <div className="solverMessage">Are you sure you want to leave Solver? Progress will not be saved.</div>
        <button onClick={stay} className="solverLeaveStay">
          Stay
        </button>
        <button onClick={(e) => leave(e, this.props)} className="solverLeaveStay">
          Leave
        </button>
      </div>
    );

    const confirmLeavePopupCp = (
      <div id="controlsPopup" className="warningPopup" style={{ position: "absolute", left: "35vw", width: "30vw", bottom: "8px" }}>
        <div id="cpChangeData" data=""></div>
        <div className="cpMessage">Are you sure you want to leave Color Picker? Progress will not be saved.</div>
        <button onClick={stayCp} className="cpLeaveStay">
          Stay
        </button>
        <button onClick={leaveCp} className="cpLeaveStay">
          Leave
        </button>
      </div>
    );

    switch (props.state.activeMenu) {
      case "Moves":
        activeMenu = <Controls {...props} />;
        break;
      case "ColorPicker":
        activeMenu = <SideColorPicker {...props} />;
        activeMenuBottom = <SideColorPickerController {...props} />;
        activeMenuExit = cpLeaveButton;
        break;
      case "Solver":
        activeMenu = <SideSolverUI {...this.props} />;
        activeMenuBottom = <SideSolverControls {...this.props} />;
        activeMenuExit = solverLeaveButton;
        break;
      case "Algorithms":
        activeMenu = <SideSolverUI {...this.props} />;
        activeMenuBottom = <SideSolverControls {...this.props} />;
        activeMenuExit = algoLeaveButton;
        break;
      default:
        activeMenu = this.renderBaseView();
        activeMenuBottom = "";
    }

    return [
      <div className="sideMenuWrapper sideLimit" key="sideMenuWrapper" style={{ pointerEvents: "none", display: "none" }}>
        {this.renderBaseView()}
        {activeMenu}
      </div>,
      <div className="bottomMenuWrapper" key="bottomMenuWrapper" style={{ pointerEvents: "none", display: "none" }}>
        {activeMenuBottom}
        {confirmLeavePopupCp}
        {confirmLeavePopup}
        <div className="bottomExitDiv" onClick={activeMenuExit === cpLeaveButton ? leaveCp : (e) => leave(e, this.props)}>
          {activeMenuExit}
        </div>
      </div>,
    ];
  }

  // Mobile layout (formerly MobileView)
  renderMobile() {
    const algoLength = algorithms.filter((set) => set.worksFor.includes(this.props.state.cubeDimension)).length;
    const otherOptionClick = (e, props) => {
      switch (e.target.id) {
        case "Reset":
          props.setState({ activeMenu: "", currentFunc: "Reset" });
          break;
        case "Scramble":
          if (props.state.currentFunc === "None") {
            props.beginScramble();
          }
          break;
        default:
          props.setState({ activeMenu: e.target.id, currentFunc: "None" });
      }
    };
    const optionClick = (e, props) => {
      if (props.state.currentFunc === "None") {
        if (e.target.id === "ColorPicker") {
          props.setState({ activeMenu: e.target.id, isValidConfig: true });
          props.beginColorPicker();
        } else if (e.target.id === "Solver") {
          props.setState({ activeMenu: e.target.id });
          props.beginSolve();
        } else if (e.target.id === "Algorithms") {
          props.setState({ activeMenu: e.target.id, currentFunc: "Algorithms", solveOnce: false, solvedSet: [], prevSet: [], moveSet: [] });
        }
      }
    };

    return (
      <div className="menuWrapper" style={{ display: "none" }}>
        {(this.props.state.currentFunc === "None" ||
          this.props.state.currentFunc === "Drag Turn" ||
          this.props.state.currentFunc === "Undo" ||
          this.props.state.currentFunc === "Redo" ||
          this.props.state.currentFunc === "Scrambling") &&
        this.props.state.activeMenu !== "Moves" ? (
          <Row style={{ width: "100%", height: "100%", margin: 0 }}>
            <Col xs={6} style={{ paddingRight: "7.5px" }}>
              {this.props.state.cubeDimension <= 100 ? (
                <>
                  <button className="mobileButton" id="ColorPicker" data="Color Picker" onClick={(e) => optionClick(e, this.props)} key={1}>
                    Color Picker
                  </button>
                  <button className="mobileButton" id="Solver" data="Solving" onClick={(e) => optionClick(e, this.props)} key={2}>
                    Solver
                  </button>
                </>
              ) : (
                <>
                  <button className="blankButton" key={1}></button>
                  <button className="blankButton" key={2}></button>
                </>
              )}
              {algoLength ? (
                <button className="mobileButton" id="Algorithms" data="Algorithms" onClick={(e) => optionClick(e, this.props)} key={3}>
                  Patterns
                </button>
              ) : (
                ""
              )}
            </Col>
            <Col xs={6} style={{ paddingLeft: "7.5px" }}>
              {this.props.state.cubeDimension < 1 ? (
                <button className="mobileButton" onClick={() => otherOptionClick} key={0}>
                  Moves
                </button>
              ) : (
                <button className="blankButton" key={0}></button>
              )}
              <button className="mobileButton" id="Scramble" onClick={(e) => otherOptionClick(e, this.props)} key={2}>
                Scramble
              </button>
              <button className="mobileButton" id="Reset" onClick={(e) => otherOptionClick(e, this.props)} key={3}>
                Reset
              </button>
            </Col>
          </Row>
        ) : this.props.state.currentFunc === "Color Picker" ? (
          <ColorPicker {...this.props} isMobile={true}></ColorPicker>
        ) : this.props.state.currentFunc === "Solving" ? (
          <SolverUI {...this.props} mobile={true} />
        ) : this.props.state.currentFunc === "Algorithms" ? (
          <>
            <SolverUI {...this.props} mobile={true} />
          </>
        ) : this.props.state.activeMenu === "Moves" ? (
          <Row style={{ height: "100%" }}>
            <Col xs={2}>
              <div id="infoBtn" style={{ fontSize: "2rem", padding: 0, display: "inline" }} onClick={() => { this.props.setState({ activeMenu: "" }); }}>
                ←
              </div>
            </Col>
            <Col xs={10}>
              <Controls {...this.props} />
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </div>
    );
  }

  render() {
    const { w, h } = this.state;
    if (w > 900 && h > 580) return this.renderDesktop();
    if (w > 600) return this.renderBaseView();
    return this.renderMobile();
  }
}

export default React.memo(ResponsiveView);
