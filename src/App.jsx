import React, { Component } from 'react';
import OrientationPicker from "./components/OrientationPicker.jsx";
import * as Orientation from "./components/Orientation";
import Navbar from "./components/Navbar/Navbar.jsx";
import Speeds from "./components/Speeds/Speeds.jsx";
import MoveInput from "./components/MoveInput.jsx";
import SolverInfo from "./components/SolverInfo/SolverInfo.jsx";
import ColorPickerInfo from "./components/ColorPickerInfo/ColorPickerInfo.jsx";
import Menu from "./components/MenuWrapper/MenuWrapper.jsx";

import * as THREE from "three";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import cube from './cubeFunctions/cube';
import moveFuncs from './cubeFunctions/move';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorPickerUIFunctions from "./components/ColorPicker/ColorPickerUIFunctions";

// TODO:
/*
 * 1. Start moving functions to other files: STARTED
 *
 * 2. UI Rework: Started
 *
 * 3. Continue working on solvers.
 *
 * 4. ISSUES:
 *  - Fix issue is yellow solver
 */

class App extends Component {
  // Container for Three.js canvas
  canvasRef = React.createRef();
  handleSetOrientation = () => {
    this.setState({ activeMenu: "SetOrientation" });
  }

  handlePickOrientation = (topColor, frontColor, options) => {
    const reset = options && options.reset === true;
    // Validate combination using Orientation.js mappings
    const topKey = `${topColor.charAt(0).toUpperCase()}${topColor.slice(1)}Top`;
    const orientationObj = Orientation[topKey];
    const orientationFaces = orientationObj ? orientationObj[frontColor] : null;
    // Debug: log inputs and mapping result
    // eslint-disable-next-line no-console
    console.log("handlePickOrientation invoked:", { topColor, frontColor, orientationKey: topKey, isValid: !!orientationFaces, faces: orientationFaces });
    if (!orientationFaces) {
      alert("Invalid orientation selection.");
      return;
    }
    if (reset) {
      // Generate solved cube with selected orientation and reset state
      const cD = this.state.cubeDimension;
      const generated = cube.generateSolved(cD, cD, cD, topColor, frontColor);
      this.setState({
        topFaceColor: topColor,
        frontFaceColor: frontColor,
        orientationFaces,
        rubiksObject: generated.tempArr,
        // Reset to a fresh cube state
        moveLog: "",
        moveSet: [],
        prevSet: [],
        solvedSet: [],
        solvedSetIndex: 0,
        solveMoves: "",
        solveState: -1,
        undoIndex: 0,
        blockMoveLog: false,
        isMulti: false,
        face: 0,
        turnDirection: 0,
        start: 7.5,
        end: 0,
        activeMenu: "",
        reload: true,
      }, () => {
        // eslint-disable-next-line no-console
        console.log("Orientation state applied with reset:", { topFaceColor: this.state.topFaceColor, frontFaceColor: this.state.frontFaceColor });
        // Repaint and snap all cubelets to solved positions with new colors
        this.reloadTurnedPieces('all');
      });
    } else {
      // Update only orientation/top/front so future operations interpret faces relative to new orientation
      // Do not change rubiksObject; pieces stay in current positions relative to each other.
      this.setState({
        topFaceColor: topColor,
        frontFaceColor: frontColor,
        orientationFaces,
      }, () => {
        // eslint-disable-next-line no-console
        console.log("Orientation state applied without reset:", { topFaceColor: this.state.topFaceColor, frontFaceColor: this.state.frontFaceColor });
      });
    }
  }
  state = {
    cubes: [],           // Contains visual cube
    rubiksObject: [],    // Contains memory cube
    blackObject: [],
    topFaceColor: "yellow", // Default top
    frontFaceColor: "red",  // Default front
    speed: 7.5,          // Control individual piece rotation speed (don't change)
    rotationSpeed: 350,  // Controls visual rotation speed
    start: 7.5,          // Start value for a rotation or set of rotations
    end: 0,              // End value for a roation or set of rotations
    turnDirection: 0,    // Dictates whether the rotation is clockwise or counterclockwise
    face: 0,             // The face being turned
    cameraX: -10,          // Camera position x
    cameraY: 30,         // Camera position y
    cameraZ: 30,          // Camera position z
    currentFunc: "None", // Variable used to display current function
    moveLog: "",         // Keeps a log of all moves
    moveSet: [],         // Algorithms queue moves through this variable
    prevSet: [],
    angle: 3.9,          // Camera angle
    cubeDimension: null, // Cube dimensions. Ex: 3 => 3x3x3 cube
    cubeDepth: 1,        // Used to determine rotation depth on cubes greater than 3
    currentSpeed: "Medium",// Displays which speed is selected
    moves: 0,            // Used by scramble functions
    reload: false,       // Lets animate know when to reload the cube (after every move)
    solveState: -1,      // Dictates progression of solve function
    solveMoves: "",      // Keeps track of moves used during solve
    solvedSet: [],
    solvedSetIndex: 0,
    facePosX: null,
    facePosY: null,
    facePosZ: null,
    faceSide: null,
    colorPicked: 'white',
    mouseFace: null,
    mouseDown: false,
    mousePos: null,
    undoIndex: 0,        // Index to keep track of where undo/redo is
    blockMoveLog: false, // Blocks adding move when undoing/redoing a move
    previousPiece: null, // Keeps track of hovered face to not redraw
    rubiksIndex: 0,      // Index to keep track of middles while solving
    middles: [],         // Contains all middle segments
    corners: [],         // Contains all corner segments
    // showStats: false,     // Setting for stats
    showMoveInput: false,  // Setting for custom move input
    showControls: false,   // Setting for move controls
    showHints: true,
    showGuideArrows: true,
    activeDragsInput: 0,  // Keeps track of draggable input
    deltaPositionInput: {
      x: 100, y: 100
    },
    controlledPositionInput: {
      x: 0, y: 0
    },
    activeDragsControls: 0,// Keeps track of draggable buttons
    deltaPositionControls: {
      x: 100, y: 100
    },
    controlledPositionControls: {
      x: 0, y: 0
    },
    isMulti: false,
    isVisible: false,
    isValidConfig: true,
    hoverData: [],
    showSolveController: false,
    autoPlay: false,
    autoRewind: false,
    autoTarget: false,
    playOne: false,
    generateAllMoves: false,
    isLocal: null,
    cpErrors: [],
    activeMenu: "",
    solveTime: 0,
    targetSolveIndex: -1,
    activeAlgo: "None Selected",
    sliderSpeed: 40,
    jumpToEnd: false,
    algoUp: false,
    algoDown: false,
    upDateCp: 0
    ,
    // Feature flag to enable advanced cube rotation notations (x,y,z)
    advancedNotationEnabled: true,
  };

  // Toggle advanced notation feature on/off
  toggleAdvancedNotation = (enabled) => {
    this.setState({ advancedNotationEnabled: enabled !== undefined ? enabled : !this.state.advancedNotationEnabled });
  }

  // Compute orientation faces array from current state's top/front
  getOrientationFacesFromState = () => {
    const { topFaceColor, frontFaceColor } = this.state;
    const map = {
      yellow: Orientation.YellowTop,
      red: Orientation.RedTop,
      blue: Orientation.BlueTop,
      orange: Orientation.OrangeTop,
      green: Orientation.GreenTop,
      white: Orientation.WhiteTop,
    };
    const table = map[topFaceColor];
    return table ? table[frontFaceColor] : Orientation.YellowTop["red"]; // [right,left,back,front,top,bottom]
  }

  // Apply axis rotation to orientation (updates which colors are at top/front)
  applyOrientationRotation = (axis, isPrime) => {
    const faces = [...this.getOrientationFacesFromState()]; // [right,left,back,front,top,bottom]
    let [right, left, back, front, top, bottom] = faces;
    let newRight = right, newLeft = left, newBack = back, newFront = front, newTop = top, newBottom = bottom;

    if (axis === 'x') {
      if (!isPrime) {
        // front->top, top->back, back->bottom, bottom->front
        newTop = front; newBack = top; newBottom = back; newFront = bottom;
        newRight = right; newLeft = left;
      } else {
        // inverse
        newTop = back; newBack = bottom; newBottom = front; newFront = top;
        newRight = right; newLeft = left;
      }
    } else if (axis === 'y') {
      if (!isPrime) {
        // front->right, right->back, back->left, left->front
        newRight = front; newBack = right; newLeft = back; newFront = left;
        newTop = top; newBottom = bottom;
      } else {
        // inverse
        newLeft = front; newBack = left; newRight = back; newFront = right;
        newTop = top; newBottom = bottom;
      }
    } else if (axis === 'z') {
      if (!isPrime) {
        // top->right, right->bottom, bottom->left, left->top
        newRight = top; newBottom = right; newLeft = bottom; newTop = left;
        newFront = front; newBack = back;
      } else {
        // inverse
        newLeft = top; newBottom = left; newRight = bottom; newTop = right;
        newFront = front; newBack = back;
      }
    }

    const orientationFaces = [newRight, newLeft, newBack, newFront, newTop, newBottom];
    this.setState({
      orientationFaces,
      topFaceColor: newTop,
      frontFaceColor: newFront,
    });
  }

  // Execute whole-cube rotation around axis using existing rotateOneFace pipeline
  executeCubeRotation = (axis, isPrime) => {
    if (this.state.currentFunc !== "None") return;
    const cD = this.state.cubeDimension || this.getSizeFromUrl();
    let faceIndex = 0; // F,U,R,B,L,D => 0-5
    if (axis === 'x') faceIndex = 2;      // R axis
    else if (axis === 'y') faceIndex = 1; // U axis
    else if (axis === 'z') faceIndex = 0; // F axis
    const direction = isPrime ? 0 : -1;
    // depth = cD, isMulti = true to rotate all layers
    this.rotateOneFace(axis, [faceIndex, direction, cD, true]);
    // Update orientation immediately so subsequent algorithms use new top/front
    this.applyOrientationRotation(axis, isPrime);
  }

  // Bind keys to functions
  keyBinds = key => {
    switch (key) {

      case 'R':
        this.rotateOneFace(key + "'", [2, 0, 1]);
        break;
      case 'r':
        this.rotateOneFace(key.toUpperCase(), [2, -1, 1]);
        break;

      case 'L':
        this.rotateOneFace(key + "'", [4, 0, 1]);
        break;
      case 'l':
        this.rotateOneFace(key.toUpperCase(), [4, -1, 1]);
        break;

      case 'F':
        this.rotateOneFace(key + "'", [0, 0, 1]);
        break;
      case 'f':
        this.rotateOneFace(key.toUpperCase(), [0, -1, 1]);
        break;

      case 'U':
        this.rotateOneFace(key + "'", [1, 0, 1]);
        break;
      case 'u':
        this.rotateOneFace(key.toUpperCase(), [1, -1, 1]);
        break;

      case 'D':
        this.rotateOneFace(key + "'", [5, 0, 1]);
        break;
      case 'd':
        this.rotateOneFace(key.toUpperCase(), [5, -1, 1]);
        break;

      case 'B':
        this.rotateOneFace(key + "'", [3, 0, 1]);
        break;
      case 'b':
        this.rotateOneFace(key.toUpperCase(), [3, -1, 1]);
        break;

      // Advanced cube rotations (toggleable)
      case 'x':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('x', false);
        break;
      case 'X':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('x', true);
        break;
      case 'y':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('y', false);
        break;
      case 'Y':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('y', true);
        break;
      case 'z':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('z', false);
        break;
      case 'Z':
        if (this.state.advancedNotationEnabled) this.executeCubeRotation('z', true);
        break;

      case '1':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('white');
        }
        break;
      case '2':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('blue');
        }
        break;
      case '3':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('red');
        }
        break;
      case '4':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('yellow');
        }
        break;
      case '5':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('orange');
        }
        break;
      case '6':
        if (this.state.currentFunc === 'Color Picker') {
          this.changeColor('green');
        }
        break;
      case 'ArrowLeft':
        if (this.state.currentFunc === 'Solving' || this.state.currentFunc === 'Algorithms') {
          this.rewindSolve();
        }
        else if (this.state.currentFunc === 'None') {
          this.undo();
        }
        break;
      case 'ArrowRight':
        if (this.state.currentFunc === 'Solving' || this.state.currentFunc === 'Algorithms') {
          if (!this.state.moveSet.length) return;
          if ((this.state.moveSet[0] === this.state.moveSet[1] || this.state.moveSet[1] === "stop'") && !this.state.autoPlay) {
            this.setState({
              autoPlay: true,
              autoRewind: false,
              targetSolveIndex: this.state.solvedSetIndex + 2
            });
          }
          else {
            if (this.state.playOne === true) return;
            if (this.state.moveSet[0] && typeof (this.state.moveSet[0][0]) === 'string' && this.state.moveSet[0] !== "'") {
              this.setState({ playOne: true, prevSet: [...this.state.prevSet, this.state.moveSet[0]] });
            }
          }
        }
        else if (this.state.currentFunc === 'None') {
          this.redo();
        }
        break;
      case 'ArrowDown':
        if (this.state.currentFunc === "Algorithms") {
          this.setState({ algoDown: true, resized: true });
        }
        break;
      case 'ArrowUp':
        if (this.state.currentFunc === "Algorithms") {
          this.setState({ algoUp: true, resized: true });
        }
        break;
      default:
    }
  }

  // Handles key press event
  keyHandling = e => {
    this.keyBinds(e.key);
  }

  onMouseUp(event) {
    this.setState({ mouseDown: false });
  }

  onSliderChange = (value) => {
    this.setState({ sliderSpeed: value })
    switch (value) {
      case 0:
        this.changeSpeed(1.5, 1050, "Slowest");
        break;
      case 10:
        this.changeSpeed(3, 750, "Slower")
        break;
      case 20:
        this.changeSpeed(5, 500, "Slow")
        break;
      case 30:
        this.changeSpeed(7.5, 350, "Medium")
        break;
      case 40:
        this.changeSpeed(10, 250, "Fast")
        break;
      case 50:
        this.changeSpeed(15, 175, "Faster")
        break;
      case 60:
        this.changeSpeed(30, 100, "Fastest")
        break;
      case 70:
        this.changeSpeed(90, 20, "Zoomin")
        break;
      default:
        console.log("unexpected behavior");
    }
  }

  // Functions to change speed
  changeSpeed = (_speed, _rotationSpeed, _name, bypass) => {
    this.state.currentFunc !== "None" && !bypass ?
      this.setState({ moveSet: [[_speed, _rotationSpeed, _name], ...this.state.moveSet] }) :
      this.setState({ currentSpeed: _name, speed: _speed, start: _speed, end: 0, rotationSpeed: _rotationSpeed });
  }

  changeColor = (color) => {
    this.setState({ colorPicked: color });
    let tempObj = [...this.state.rubiksObject];
    for (let i = 0; i < tempObj.length; i++) {
      // tempObj[5] = color;
      // tempObj[6] = color;
      // tempObj[7] = color;
      let tempCube = [...tempObj[i]];
      tempCube[1] = color;
      tempObj[i] = [...tempCube];
      // i = tempObj.length;
    }
    this.setState({ rubiksObject: [...tempObj], isValidConfig: false, upDateCp: this.state.upDateCp + 1, cpErrors: [] }, () => {
      this.reloadTurnedPieces('cp');
    });
  }

  changeFaceColor = (pos, side, color) => {
    let tempObj = [...this.state.rubiksObject]
    for (let i = 0; i < tempObj.length; i++) {
      let tempCube = [...tempObj[i]];
      if (tempCube[6] === pos.x && tempCube[7] === pos.y && tempCube[8] === pos.z) {
        tempCube[side] = color;
        tempObj[i] = [...tempCube];
        i = tempObj.length;
      }
    }
    this.setState({ rubiksObject: [...tempObj], isValidConfig: false, upDateCp: this.state.upDateCp + 1, cpErrors: [] }, () => {
      this.reloadTurnedPieces('cp');
    });
  }

  // removed obsolete changeTopFaceColor; orientation now controlled via OrientationPicker

  runCheckColors() {
    let obj = ColorPickerUIFunctions.checkColors(this.state);
    if (obj.error) this.setState({ cpErrors: [...obj.error] });
    else if (obj.success) this.setState({ isValidConfig: true, cpErrors: [] });
  }

  setColorPickedCube = () => {
    let rubiks = [...this.state.rubiksObject];
    let size = this.state.cubeDimension;
    let generated = cube.generateSolved(size, size, size, "yellow", "red");
    let newGenerated = [];
    let checked = [];
    let otherChecked = [];

    generated.tempArr.forEach(([...piece], pieceIndex) => {
      newGenerated.push([]);
      rubiks.forEach(([...rubik], i) => {
        let validPiece = 0;
        piece.slice(0, 6).sort().forEach((face, index) => {
          if (rubik.slice(0, 6).sort()[index] === face) { validPiece++; }
        });
        if (validPiece === 6 && !checked.includes(pieceIndex) && !otherChecked.includes(i)) {
          let validEdgePlacement = false;
          let validMiddlePlacement = false;
          if (piece.includes("edge")) {
            validEdgePlacement = ColorPickerUIFunctions.checkValidMatchEdge(piece, rubik, size);
            // A center edge cannot match with a non center edge
            if ((piece[13] === "center" && rubik[13] !== "center") ||
              (rubik[13] === "center" && piece[13] !== "center")) {
              validEdgePlacement = false;
            }
            else if (piece[13] === "center" && rubik[13] === "center") {
              validEdgePlacement = true;
            }
          }
          else if (piece.includes("middle")) {
            validMiddlePlacement = ColorPickerUIFunctions.checkValidMatchMiddle(piece, rubik, size);
          }
          else {
            validEdgePlacement = true;
            validMiddlePlacement = true;
          }
          if (validEdgePlacement || validMiddlePlacement) {
            checked.push(pieceIndex);
            otherChecked.push(i);
            newGenerated[pieceIndex] = [
              ...rubik.slice(0, 9),
              ...piece.slice(9, 15)
            ];
          }
        }
      })
    });

    this.setState({ rubiksObject: newGenerated, currentFunc: "None", activeMenu: "" }, () => {
      this.reloadTurnedPieces('check');
      this.setState({ activeMenu: 'Solver' });
      this.beginSolve();
    });
  }

  // Allows the user to undo a move
  undo = () => {
    let undoIndex = this.state.undoIndex;
    let moveString = this.state.moveLog;
    const moveArray = moveFuncs.moveStringToArray(moveString);
    if (moveString === "") return;

    else if (this.state.currentFunc !== "None") return;

    else if (moveArray.length - 1 - undoIndex >= 0)
      this.setState({
        blockMoveLog: true,
        currentFunc: "Undo",
        moveSet: [moveArray[moveArray.length - 1 - undoIndex]],
        undoIndex: undoIndex + 1
      });
  }

  // Allows the user to redo a move
  redo = () => {
    if (this.state.currentFunc !== "None") return;
    let undoIndex = this.state.undoIndex;
    let moveString = this.state.moveLog;
    if (moveString === "") return;

    const moveArray = moveFuncs.moveStringToArray(moveString);

    let backwardsMove = moveArray[moveArray.length - undoIndex];
    try {
      backwardsMove.includes("'") ? backwardsMove = backwardsMove.substring(0, 3) : backwardsMove += "'";
    } catch (err) {
      return;
    }

    if (undoIndex > 0)
      this.setState({
        blockMoveLog: true,
        currentFunc: "Redo",
        moveSet: [backwardsMove],
        undoIndex: undoIndex - 1
      });
  }

  // Control when single buttons can be clicked
  rotateOneFace = (e, vals) => {
    if (vals.length < 4) vals.push(false);

    if (this.state.currentFunc === "None") {

      let cD = this.state.cubeDimension;
      let rubiksObject = this.state.rubiksObject;
      let blockMoveLog = this.state.blockMoveLog;
      let moveLog = this.state.moveLog;
      let solveMoves = this.state.solveMoves;
      let solveState = this.state.solveState;
      let end = this.state.end;
      let obj = cube.rotateCubeFace(vals[0], vals[1], vals[2], vals[3], blockMoveLog, moveLog, solveMoves, end, solveState);

      obj.currentFunc = e;
      obj.rubiksObject = cube.rotateFace(obj.face, obj.turnDirection, obj.cubeDepth, obj.isMulti, cD, rubiksObject);

      this.setState(obj);
    }
  }

  // Small bug, account for double turns
  algorithm = (moveString, moveName) => {
    if (this.state.currentFunc === "Solving" || this.state.currentFunc === "Algorithms") {
      if (this.state.moveSet[0]) {
        if (moveFuncs.checkMoveEquivalence(moveString, this.state.moveSet[0], this.state.cubeDimension)) {
          this.playOne(this);
        }
      }
      return;
    }
    if (this.state.currentFunc !== "None") return;
    const moveArray = moveFuncs.moveStringToArray(moveString);
    this.setState({ currentFunc: moveName, moveSet: moveArray });
  }

  // Resets the cube and the move log
  reset = () => {
    let cD = this.state.cubeDimension;
    let generated = cube.generateSolved(cD, cD, cD, this.state.topFaceColor || "yellow", this.state.frontFaceColor || "red");
    let rubiksObject = generated.tempArr;
    this.setState({ rubiksObject, moveSet: [], moveLog: "", currentFunc: "None", solveState: -1, autoPlay: false, playOne: false, isVisible: false, hoverData: [], solveMoves: "", prevSet: [], cpErrors: [], activeMenu: "none" }, () => {
      this.reloadTurnedPieces('all');
    });
  }

  // Changes state active function to begin scrambling
  beginScramble = () => {

    if (this.state.currentFunc === "None") {
      let moveSet = [];
      while (moveSet.length < 25) {
        let temp = moveFuncs.generateMove(this.state.cubeDimension);
        if (moveSet[moveSet.length - 1] &&
          moveSet[moveSet.length - 1].slice(0, 3) === temp.slice(0, 3) &&
          moveSet[moveSet.length - 1].length !== temp.length);
        else if (moveSet[moveSet.length - 2] &&
          moveSet[moveSet.length - 1] &&
          moveSet[moveSet.length - 2] === temp &&
          moveSet[moveSet.length - 1] === temp);
        else moveSet.push(temp);
      }
      this.setState({ currentFunc: "Scrambling", moveSet });
    }
  }

  // Starts the solve process
  beginSolve = () => {
    if (this.state.currentFunc !== "None") return;
    this.setState({ currentFunc: "Solving", solveState: 0, autoPlay: false, playOne: false, solveOnce: true });
  }

  stopSolve = () => {
    this.setState({ currentFunc: "None", solveState: -1, autoPlay: false, playOne: false, isVisible: false, hoverData: [], solveMoves: "", prevSet: [], moveSet: [], targetSolveIndex: -1, solvedSet: [] });
  }

  beginColorPicker = () => {
    let cD = this.state.cubeDimension;
    if (this.state.currentFunc !== "None") return;
    const blank = [...cube.generateBlank(cD, cD, cD)];
    this.setState({ currentFunc: "Color Picker", rubiksObject: [...blank] }, () => {
      this.reloadTurnedPieces('cp');
    });
  }

  endColorPicker = () => {
    this.reset();
    this.setState({ currentFunc: "None", cpErrors: [] });
  }

  playOne = props => {
    if (!props.state.moveSet.length) return;
    if ((props.state.moveSet[0] === props.state.moveSet[1] || props.state.moveSet[1] === "stop'") && !props.state.autoPlay) {
      props.setState({
        autoPlay: true,
        autoRewind: false,
        targetSolveIndex: props.state.solvedSetIndex + 2
      });
    }
    else {
      if (props.state.playOne === true) return;
      if (props.state.moveSet[0] && typeof (props.state.moveSet[0][0]) === 'string' && props.state.moveSet[0] !== "'") {
        props.setState({ playOne: true, prevSet: [...props.state.prevSet, props.state.moveSet[0]] });
      }
    }
  }

  rewindSolve = () => {
    if (this.state.playOne) return;
    if ((this.state.prevSet[this.state.prevSet.length - 1] === this.state.prevSet[this.state.prevSet.length - 2] || this.state.prevSet[this.state.prevSet.length - 1] === "stop'") && !this.state.autoRewind) {
      this.setState({
        autoPlay: false, autoRewind: true, targetSolveIndex: this.state.solvedSetIndex - 2
      });
      return;
    }
    let newMoveSet = [];
    let tempMoveSet = [...this.state.moveSet];
    let tempPrev = [...this.state.prevSet];
    let lastEl = tempPrev[tempPrev.length - 1];
    let popped = tempPrev.pop();
    if (!popped) {
      this.setState({ autoRewind: false });
      return;
    }
    popped[popped.length - 1] === "'" ? popped = popped.slice(0, 3) : popped += "'";
    newMoveSet.push(popped, lastEl, ...tempMoveSet);
    this.setState({
      playOne: true,
      prevSet: tempPrev,
      moveSet: newMoveSet,
      solvedSetIndex: this.state.solvedSetIndex - 2
    })
  }

  handleDragInput = (e, ui) => {
    const { x, y } = this.state.deltaPositionInput;
    this.setState({
      deltaPositionInput: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onStartInput = () => {
    this.setState({ activeDragsInput: this.state.activeDragsInput + 1 });
  };

  onStopInput = () => {
    this.setState({ activeDragsInput: this.state.activeDragsInput - 1 });
  };

  mouseOver = (name, data, e) => {
    if (this.state.showHints)
      this.setState({
        isVisible: true,
        hoverData: data
      });
  }

  mouseLeave = () => {
    this.setState({
      isVisible: false,
      hoverData: []
    });
  }

  /* Each piece that's rotated has its rotation disrupted on other planes.
   *
   * This function solves that issue by setting all piece rotations back to zero
   * and then placing colors to look as though the piece were still rotated.
   *
   * Some optimizations have been added. Undersides and insides of some pieces
   * appear white instead of black initially but does not disrupt the rest of
   * the cube. Likely won't be changed since that optimization greatly improves
   * run time.
   */
  reloadTurnedPieces = (pos) => {
    let cubes = [...this.state.cubes];

    for (let i = 0; i < this.state.rubiksObject.length; i++) {

      let tempCube = { ...cubes[i] };
      let rotation = tempCube.rotation;


      if (pos === tempCube.position) {
        tempCube.opacity = 1;
        cubes[i] = tempCube;
      }

      else if ((rotation.x !== 0 || rotation.y !== 0 || rotation.z !== 0) ||
        (pos === 'all' || pos === 'cp' || pos === 'check')) {
        if (pos === 'all' || pos === 'cp') {
          tempCube.position.x = this.state.rubiksObject[i][9];
          tempCube.position.y = this.state.rubiksObject[i][10];
          tempCube.position.z = this.state.rubiksObject[i][11];
        }
        if (pos === 'check') {
          tempCube.position.x = this.state.rubiksObject[i][6];
          tempCube.position.y = this.state.rubiksObject[i][7];
          tempCube.position.z = this.state.rubiksObject[i][8];
        }
        tempCube.material[0].color = new THREE.Color(this.state.rubiksObject[i][2]);
        tempCube.material[1].color = new THREE.Color(this.state.rubiksObject[i][4]);
        tempCube.material[2].color = new THREE.Color(this.state.rubiksObject[i][3]);
        tempCube.material[3].color = new THREE.Color(this.state.rubiksObject[i][0]);
        tempCube.material[4].color = new THREE.Color(this.state.rubiksObject[i][1]);
        tempCube.material[5].color = new THREE.Color(this.state.rubiksObject[i][5]);

        tempCube.rotation.x = 0; tempCube.rotation.y = 0; tempCube.rotation.z = 0;
        cubes[i] = tempCube;

      }
    }

    this.setState({ cubes, reload: false });
  }

  // Changes the settings by passing setting to change and new val for the setting
  changeSettings(settingToChange, newVals) {
    switch (settingToChange) {
      // case 'displayStats':
      //   this.state.showStats ? document.body.children[9].style.display = "none" : document.body.children[9].style.display = "";
      //   this.setState({showStats : !this.state.showStats});
      //   break;
      case 'displayMoveInput':
        this.setState({ showMoveInput: !this.state.showMoveInput });
        break;
      case 'displayControls':
        this.setState({ showControls: !this.state.showControls });
        break;
      case 'displayHints':
        this.setState({ showHints: !this.state.showHints });
        break;
      default:
        console.log("Invalid Setting");
    }
  }

  // Remove event listener on compenent unmount
  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyHandling);
    if (typeof window !== 'undefined' && this.handleGlobalDblClick) {
      window.removeEventListener('dblclick', this.handleGlobalDblClick, false);
    }
  }

  // Gets the url to be parsed
  getSizeFromUrl(checkLocal) {
    let limit = 75;
    let size;
    let parts = window.location.href.split('/');
    let checkID = parts[parts.length - 1].slice(0, 4);

    if (checkLocal) {
      if (parts[2].substr(0, 9) === 'localhost') {
        return true;
      }
      else {
        return false;
      }
    }

    if (checkID === '#id=') {
      size = parseInt(parts[parts.length - 1].substr(4));
    }

    if (size <= limit && size >= 1) return size; else return 3;
  }

  calculateTurn(current, previous, piece, pieceFace, cD) {

    let calculated = null;
    let depth = null;
    let turn = null;

    // difference in initial mouse down location and current mouse down
    const dif = {
      x: (previous.x - current.x),
      y: (previous.y - current.y),
      z: (previous.z - current.z)
    }

    if (current.x === previous.x && current.y === previous.y && current.z === previous.z) {
      return null;
    }

    function calculateTurnAtFace(coord1, compare1, coord2, compare2, piece1, piece2, dir1, dir2) {
      if (Math.abs(coord1) >= Math.abs(coord2) && (Math.abs(coord1) > .05))
        return { calculated: compare1 ? dir1 : (dir1 + "'"), depth: piece2 }

      if (Math.abs(coord2) > Math.abs(coord1) && (Math.abs(coord2) > .05)) {
        return { calculated: compare2 ? dir2 : (dir2 + "'"), depth: piece1 }
      }
      return { calculated: null, depth: null };
    }

    //determines the move based on mouse difference from click to new position
    // With new orientation: Front(0)->Top(1), Bottom(5)->Front(0). We remap pieceFace handling accordingly.
    switch (pieceFace) {
      case 0: // old Front now behaves like Up
        turn = calculateTurnAtFace(dif.z, dif.z < 0, dif.x, dif.x >= 0, cD - piece.z, cD - piece.x, "R", "U");
        calculated = turn.calculated; depth = turn.depth;
        break;
      case 1: // old Top now behaves like Back
        turn = calculateTurnAtFace(dif.x, dif.x <= 0, dif.y, dif.y < 0, cD - piece.x, piece.y + 1, "B", "R");
        calculated = turn.calculated; depth = turn.depth;
        break;
      case 2: // old Right unchanged in lateral logic but adjust vertical ref to new Up
        turn = calculateTurnAtFace(dif.z, dif.z > 0, dif.y, dif.y > 0, cD - piece.z, piece.y + 1, "F", "U");
        calculated = turn.calculated; depth = turn.depth;
        break;
      case 3: // old Back unchanged laterally
        turn = calculateTurnAtFace(dif.z, dif.z > 0, dif.x, dif.x <= 0, cD - piece.z, cD - piece.x, "R", "U");
        calculated = turn.calculated; depth = turn.depth;
        break;
      case 4: // old Left unchanged laterally but vertical maps to new Up
        turn = calculateTurnAtFace(dif.z, dif.z < 0, dif.y, dif.y < 0, cD - piece.z, piece.y + 1, "F", "U");
        calculated = turn.calculated; depth = turn.depth;
        break;
      case 5: // old Bottom now behaves like Front
        turn = calculateTurnAtFace(dif.x, dif.x >= 0, dif.y, dif.y > 0, cD - piece.x, piece.y + 1, "F", "R");
        calculated = turn.calculated; depth = turn.depth;
        break;
      default:
    }

    //console.log("{ turn: " + calculated + " } , { depth: " + depth + " }");
    return ((depth < 10 ? "0" : "") + depth + calculated);
  }

  // Proto function for feature to be built later
  calculateTheta() {

  }

  menuSetState = (obj) => {
    //console.log(obj);
    this.setState(obj, () => {
      if (obj.activeAlgo) {
        this.reloadTurnedPieces('all');
      }
    });
  }

  windowResized = () => {
    this.setState({ resized: true });
  }

  // Smoothly animate the camera back to a target orientation over `durationMs`.
  // By default, keeps the current radius (distance to target) to avoid zooming.
  animateCameraTo = (targetPos, durationMs = 600, lockRadius = true) => {
    if (!this.camera || !this.controls) return;
    if (this._camAnimRAF) {
      cancelAnimationFrame(this._camAnimRAF);
      this._camAnimRAF = null;
    }

    // OrbitControls target is the cube origin
    const target = new THREE.Vector3(0, 0, 0);
    const startVec = this.camera.position.clone().sub(target);
    const endVec = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z).sub(target);

    const startSph = new THREE.Spherical().setFromVector3(startVec);
    const endSphRaw = new THREE.Spherical().setFromVector3(endVec);
    const startRadius = startSph.radius;
    const endSph = endSphRaw.clone();
    if (lockRadius) endSph.radius = startRadius;

    // Normalize azimuthal delta to take shortest path around the circle
    let dTheta = endSph.theta - startSph.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    const dPhi = endSph.phi - startSph.phi;

    const t0 = performance.now();
    const dur = Math.max(0, durationMs);

    const prevEnabled = this.controls.enabled;
    this.controls.enabled = false;

    const clampPhi = (phi) => Math.min(Math.max(phi, 0.0001), Math.PI - 0.0001);
    const easeInOutCubic = (t) => (t < 0.5) ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const raw = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const t = easeInOutCubic(raw);
      const sph = new THREE.Spherical(
        lockRadius ? startRadius : (startSph.radius + (endSph.radius - startSph.radius) * t),
        clampPhi(startSph.phi + dPhi * t),
        startSph.theta + dTheta * t
      );
      const pos = new THREE.Vector3().setFromSpherical(sph).add(target);
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.controls.update();
      if (raw < 1) {
        this._camAnimRAF = requestAnimationFrame(step);
      } else {
        this._camAnimRAF = null;
        this.controls.enabled = prevEnabled;
        if (this.renderer && this.scene) {
          this.renderer.render(this.scene, this.camera);
        }
      }
    };

    this._camAnimRAF = requestAnimationFrame(step);
  }

  // Initialization and animation functions
  componentDidMount() {

    // Initial set up variables
    let cD = this.getSizeFromUrl();
    let generated = cube.generateSolved(cD, cD, cD, this.state.topFaceColor || "yellow", this.state.frontFaceColor || "red");
    let rubiksObject = generated.tempArr;
    let tempCubes = [];

    let previousPiece = null;
    let previousPieceIndex = null;
    let ignoreChange = false;

    // === THREE.JS VARIABLES ===
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000);
  let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // Expose refs on instance for later access (e.g., dblclick reset)
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let cubeGeometry = new THREE.BoxGeometry();
    let loader = new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW92XE-j1aJzRMI9kvvMZIf2VikZzzdEI87zl4rWgHMJBNJ9iw7A&s');
    let moveHintImage = new THREE.TextureLoader().load('https://cdn2.iconfinder.com/data/icons/communication-language/100/Up_Arrow-01-512.png');

    // const ambientLight = new THREE.AmbientLight(0xffffff);
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    // const pointLight = new THREE.PointLight(0x404040, 40);
    // pointLight.position.set(2.6, 1.7, 3);
    // scene.add(pointLight);

    // const pLightHelper = new THREE.PointLightHelper(pointLight, 5);
    // scene.add(pLightHelper);

    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    // scene.add(directionalLight);
    // directionalLight.position.set(-30, 50, 0);

    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);

    // const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8);
    // scene.add(spotLight);
    // spotLight.position.set(30, 30, -20);

    // const sLightHelper = new THREE.SpotLightHelper(spotLight, 7);
    // scene.add(sLightHelper);

    let tanFOV = Math.tan(((Math.PI / 180) * camera.fov / 2));
    let windowHeight = window.innerHeight;


    // Add PlaneGeometry
    // const planeGeometry = new THREE.PlaneGeometry(30, 30);
    // const planeMaterial = THREE.MeshBasicMaterial({
    //   color: 0xFFFFFF,
    //   side: THREE.DoubleSide
    // });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // scene.add(plane);
    // plane.rotation.x = -0.5 * Math.PI;

    // const gridHelper = new THREE.GridHelper(30);
    // scene.add(gridHelper);

  const groups = cube.generateMoveHints(moveHintImage, cD);
  // Create a pivot/cube group hierarchy for correct center rotation
  const pivotGroup = new THREE.Group();
  scene.add(pivotGroup);
  const cubeGroup = new THREE.Group();
  pivotGroup.add(cubeGroup);
  // Place the pivot at the cube's geometric center and offset the cube group
  const centerPoint = cD / 2 - 0.5;
  // Keep pivot at origin; scene translation centers the cube at world origin
  pivotGroup.position.set(0, 0, 0);

    let calculateTurn = this.calculateTurn;
    let algorithmFunc = this.algorithm;

    function onWindowResize(resized) {
      camera.aspect = window.innerWidth / window.innerHeight;

      // adjust the FOV
      camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));

      camera.updateProjectionMatrix();
      // Always look at cube center (world origin)
      camera.lookAt(0, 0, 0);

      renderer.setSize(window.innerWidth, window.innerHeight - 10);
      renderer.render(scene, camera);
      resized();
    }

    function onmousedown(event) {
      controls.enabled = true;
      ignoreChange = false;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      // Projects mouse onto scene to find intersected objects
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(cubeGroup.children, true);

      // Check if anything is intersected
      if (intersects.length) {
        ignoreChange = true;
        controls.saveState();
        controls.enabled = false;
        let faceInteresected = intersects[0].faceIndex;
        let tempIndex = -1;
        for (let i = 0; i < 6; i++) {
          if (faceInteresected === i * 2 || faceInteresected === i * 2 + 1) {
            tempIndex = i;
            //this.setState({mouseFace : i});
            break;
          }
        }

        if (this.state.currentFunc === "Color Picker") {

          let toFace = [2, 4, 3, 0, 1, 5];
          this.changeFaceColor({ x: intersects[0].object.position.x, y: intersects[0].object.position.y, z: intersects[0].object.position.z }, toFace[tempIndex], this.state.colorPicked)
        }
        if (intersects[0].object.material[tempIndex] && tempIndex > -1) {
          if (intersects[0].object.material[tempIndex].color) {
            previousPiece = intersects[0];
            previousPieceIndex = tempIndex;
    renderer.setClearColor(new THREE.Color("black"), 0);
          }
        }
      }
      else {
        controls.enabled = true;
        previousPiece = null;
        previousPieceIndex = null;
      }
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      // Projects mouse onto scene to find intersected objects
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(cubeGroup.children, true);

      if (previousPiece) {
        if (intersects.length) {
          let current = intersects[0].point;
          let toFace = [2, 4, 3, 0, 1, 5];
          let tempPrev = { ...previousPiece.point };
          let tempPos = { ...previousPiece.object.position };
          let intersected = Math.floor(previousPiece.faceIndex / 2);
          let calculated = calculateTurn(current, tempPrev, tempPos, toFace[intersected], cD);
          //console.log(calculated);
          if (calculated !== null && !calculated.includes("null")) {

            // if(this.state.currentFunc==="Solving"){
            //   console.log("attempted move during solve state");
            // }

            algorithmFunc(calculated, "Drag Turn");
            previousPiece.object.material[previousPieceIndex].opacity = 1;
            previousPiece = null;
            previousPieceIndex = null;
          }
        }
      }
    }

    function ontouchend(event) {
      if (previousPiece) previousPiece.object.material[previousPieceIndex].opacity = 1;
      if (ignoreChange) controls.reset();
      ignoreChange = false;
      previousPiece = null;
      controls.enabled = true;
    }

    // Add global double-click handler to reset camera angle (ignores UI regions)
    this.handleGlobalDblClick = (evt) => {
      try {
        const path = (evt.composedPath && evt.composedPath()) || [];
        const shouldIgnore = path.some(el => {
          if (!el || !el.dataset) return false;
          return el.dataset.noCameraReset === 'true' || el.dataset.role === 'sidebar' || el.dataset.role === 'orientation';
        });
        if (shouldIgnore) return;
        if (this.camera && this.controls) {
          const init = this.initialCameraPosition || { x: 10, y: 10, z: 10 };
          this.animateCameraTo(init, 650);
        }
      } catch (_) { /* no-op */ }
    };

    // Bind event listeners to window
    window.addEventListener("keydown", this.keyHandling, false);
    window.addEventListener("pointermove", onMouseMove.bind(this), false);
    window.addEventListener("pointerdown", onmousedown.bind(this), false);
    // window.addEventListener("touchstart", ontouchstart.bind(this), false);
    // window.addEventListener("pointermove", ontouchmove.bind(this), false);
    // window.addEventListener("touchend", ontouchend, false);
    window.addEventListener("pointerup", ontouchend, false);
    window.addEventListener("resize", () => onWindowResize(this.windowResized), false);
  window.addEventListener('dblclick', this.handleGlobalDblClick, false);

    // Set background color and size
    renderer.setClearColor(new THREE.Color("black"), 0.3);
    renderer.domElement.className = "canvas";
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Append renderer to a stable React-managed container instead of brittle body index
    if (this.canvasRef && this.canvasRef.current) {
      // Clear any previous canvas (hot reload)
      this.canvasRef.current.innerHTML = "";
      this.canvasRef.current.appendChild(renderer.domElement);
    } else {
      // Fallback to body if ref not ready (shouldn't happen)
      document.body.appendChild(renderer.domElement);
    }

    // Prevents bluring
    loader.anisotropy = renderer.capabilities.getMaxAnisotropy();
    moveHintImage.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // generate cubes with face colors based off memory cube
    for (let i = 0; i < rubiksObject.length; i++) {

      // Store x,y,z of memory cube in easier to read variables
      let cubeX = rubiksObject[i][6];
      let cubeY = rubiksObject[i][7];
      let cubeZ = rubiksObject[i][8];

      const cubeMaterialsTwo = [
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][2] === "black" ? 0.7 : 0.7, color: rubiksObject[i][2], side: THREE.BackSide }), // red
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][4] === "black" ? 0.7 : 0.7, color: rubiksObject[i][4], side: THREE.BackSide }), // orange
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][3] === "black" ? 0.7 : 0.7, color: rubiksObject[i][3], side: THREE.BackSide }), // yellow
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: 0.7, side: THREE.BackSide }), // white
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][1] === "black" ? 0.7 : 0.7, color: rubiksObject[i][1], side: THREE.BackSide }), // blue
        new THREE.MeshStandardMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][5] === "black" ? 0.7 : 0.7, color: rubiksObject[i][5], side: THREE.BackSide }), // green
      ];
      const cubeMaterials = [
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][2] === "black" ? 0.5 : 0.5, color: rubiksObject[i][2], side: THREE.DoubleSide }), // red
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][4] === "black" ? 0.8 : 0.8, color: rubiksObject[i][4], side: THREE.DoubleSide }), // orange
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][3] === "black" ? 0.6 : 0.6, color: rubiksObject[i][3], side: THREE.DoubleSide }), // yellow
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: 0.5, side: THREE.DoubleSide }), // white
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][1] === "black" ? 0.7 : 0.7, color: rubiksObject[i][1], side: THREE.DoubleSide }), // blue
        new THREE.MeshPhongMaterial({ map: loader, transparent: true, opacity: rubiksObject[i][5] === "black" ? 0.6 : 0.6, color: rubiksObject[i][5], side: THREE.DoubleSide }), // green
      ];

      // Add the new cube to temp cubes
      tempCubes[i] = new THREE.Mesh(cubeGeometry, cubeMaterials);
      tempCubes[i].translateX(cubeX);
      tempCubes[i].translateY(cubeY);
      tempCubes[i].translateZ(cubeZ);

      let tempTempCubes = [];
      tempTempCubes[i] = new THREE.Mesh(cubeGeometry, cubeMaterialsTwo);
      tempTempCubes[i].translateX(cubeX);
      tempTempCubes[i].translateY(cubeY);
      tempTempCubes[i].translateZ(cubeZ);
    }

    // Center the cube at world origin by offsetting the cube group
    cubeGroup.position.set(-centerPoint, -centerPoint, -centerPoint);

    // Allows for drag to rotate camera
  let controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.enableDamping = true;   //damping
    controls.dampingFactor = 0.15;   //damping inertia
    controls.enableZoom = false;      //Zooming
    controls.autoRotate = false;     //Enable auto rotation
    controls.minDistance = (2 + cD);
    controls.maxDistance = (2 + cD) + 20;
    controls.enablePan = false;
    controls.keys = {
      LEFT: null, //left arrow
      UP: null, // up arrow
      RIGHT: null, // right arrow
      BOTTOM: null // down arrow
    };

    // Orbit around the cube's center at world origin
    controls.target.set(0, 0, 0);
    controls.update();

    // Store controls on instance
    this.controls = controls;

    controls.addEventListener("change", (e) => {
      if (renderer) renderer.render(scene, camera);
    });

    // Attach hint groups to the cube group so they share the same center offset
    groups.forEach(group => cubeGroup.add(...group));

    // add cubes to state and then render
    this.setState({
      cubes: tempCubes,
      cubeDimension: cD,
      cameraZ: 10,
      cameraX: 10,
      cameraY: 10,
      rubiksObject,
      middles: generated.middles,
      edges: generated.edges,
      corners: generated.corners,
      currentFunc: 'Reset',
      generatedButtons: cube.generateButtonData(this.getSizeFromUrl())
    }, () => {
      //let cubeGroup = new THREE.Group();
      // Callback required to wait for setState to finish
      for (let i = 0; i < rubiksObject.length; i++) {
        // Logic to only render outer pieces since inside pieces aren't ever used
        if ((this.state.cubes[i].position.x === 0 || this.state.cubes[i].position.x === this.state.cubeDimension - 1) ||
          (this.state.cubes[i].position.y === 0 || this.state.cubes[i].position.y === this.state.cubeDimension - 1) ||
          (this.state.cubes[i].position.z === 0 || this.state.cubes[i].position.z === this.state.cubeDimension - 1)) {
          cubeGroup.add(this.state.cubes[i]);
        }
      }

  camera.position.z = this.state.cameraZ;// * Math.sin( this.state.angle );
      camera.position.y = this.state.cameraY;
      camera.position.x = this.state.cameraX;// * Math.cos( this.state.angle );
  camera.lookAt(0, 0, 0);
    // Visually align initial cube as if an 'x' rotation occurred (90deg about X)
    // Apply this to the pivot so the rotation happens around the cube center
    // Initial visual orientation: lowercase 'x' (rotate in the direction of 'r')
    pivotGroup.rotation.x = -Math.PI / 2;

      // Save initial camera position and controls state for reset
      this.initialCameraPosition = {
        x: this.state.cameraX,
        y: this.state.cameraY,
        z: this.state.cameraZ,
      };
      if (this.controls && this.controls.saveState) {
        this.controls.saveState();
      }

      renderer.render(scene, camera);
      animate();
    });

    // Function runs continuously to animate cube
    let animate = () => {

      requestAnimationFrame(animate);

      for (let i = 0; i < groups.length; i++) {
        groups[i].forEach(group => group.visible = false)
      }
      // Animate queued rotation
      if (this.state.start <= this.state.end) {
        this.setState(cube.rotatePieces(cube.rotatePoint, tempCubes, this.state));
      }

      // Handles move queueing based on function
      else {


        if (this.state.currentFunc === "Color Picker" || this.state.currentFunc === "None" || this.state.currentFunc === "Solving" || this.state.currentFunc === "Algorithms") {

          //check here that data isn't the same as previous so not running this every time
          // Data on move button triggers visual move hints
          if (this.state.isVisible) {
            let [hFace, hDir, hDepth, hMulti] = this.state.hoverData;
            if (hFace < 3) {
              if (hDir === -1) {
                if (!hMulti) {
                  groups[hFace][hDepth - 1].visible = true;
                }
                else
                  for (let i = 0; i <= hDepth - 1; i++) {
                    groups[hFace][i].visible = true;
                  }
              }
              else {
                if (!hMulti) {
                  groups[hFace + 3][hDepth - 1].visible = true;
                }
                else
                  for (let i = 0; i <= hDepth - 1; i++) {
                    groups[hFace + 3][i].visible = true;
                  }
              }
            }
            else {
              if (hFace === 3) hFace = 0;
              if (hFace === 4) hFace = 2;
              if (hFace === 5) hFace = 1;

              if (hDir === -1) {
                if (!hMulti) {
                  groups[hFace + 3][(groups[hFace + 3].length - 1) - (hDepth - 1)].visible = true;
                }
                else
                  for (let i = groups[hFace + 3].length - 1; i >= (groups[hFace + 3].length - 1) - (hDepth - 1); i--) {
                    groups[hFace + 3][i].visible = true;
                  }
              }
              else {
                if (!hMulti) {
                  groups[hFace][(groups[hFace].length - 1) - (hDepth - 1)].visible = true;
                }
                else
                  for (let i = groups[hFace].length - 1; i >= (groups[hFace + 3].length - 1) - (hDepth - 1); i--) {
                    groups[hFace][i].visible = true;
                  }
              }
            }
          }
        }

        if (this.state.reload) this.reloadTurnedPieces(this.state.face);
        if (this.state.currentFunc !== "None") {

          // Doesn't work with !==
          if (this.state.currentFunc === "Undo" ||
            this.state.currentFunc === "Redo") { }

          else {
            let moveLog = this.state.moveLog;
            let index = this.state.undoIndex;

            if (index > 0) {
              let moveArray = moveFuncs.moveStringToArray(moveLog);

              if (this.state.currentFunc[0] === '0' || this.state.currentFunc[0] === '1' ||
                this.state.currentFunc[1] === '1' || this.state.currentFunc[1] === '2' || this.state.currentFunc[1] === '3') {
                let tempVal = moveArray[moveArray.length - 1];
                for (let i = 0; i <= index; i++) {
                  moveArray.pop();
                }
                moveArray.push(tempVal);
              }

              else {
                for (let i = 0; i < index; i++) {
                  moveArray.pop();
                }
              }

              moveLog = moveArray.join(" ");
              this.setState({ undoIndex: 0, moveLog });
            }
          }

          // Moves based on active function
          if (this.state.currentFunc === "Scrambling") {
            if (this.state.moveSet && this.state.moveSet.length) {
              let cD = this.state.cubeDimension;
              let tempRubiks = this.state.rubiksObject;
              let blockMoveLog = this.state.blockMoveLog;
              let moveLog = this.state.moveLog;
              let solveMoves = this.state.solveMoves;
              let solveState = this.state.solveState;
              let end = this.state.end;


              if (typeof (this.state.moveSet[0][0]) === 'number') {
                //console.log("changing speed");
                let moveSet = this.state.moveSet;
                this.changeSpeed(...moveSet[0], true);
                moveSet.shift();
                this.setState({ moveSet });
              }
              else {
                let moveData = moveFuncs.parseMoveArray(this.state.moveSet);


                if (moveData) {
                  let obj = cube.rotateCubeFace(...moveData, blockMoveLog, moveLog, solveMoves, end, solveState);

                  obj.rubiksObject = cube.rotateFace(obj.face, obj.turnDirection, obj.cubeDepth, obj.isMulti, cD, tempRubiks);

                  this.setState(obj);
                }
              }
            }
            else {
              this.setState({ currentFunc: "None", moves: 0 });
            }

          }
          else if (this.state.currentFunc === "Solving" || this.state.currentFunc === "Algorithms") {

            // Place holder for full solve testing
            if (this.state.autoTarget && !this.state.autoPlay && !this.state.autoRewind) {
              this.setState({ autoTarget: false }, () => this.reloadTurnedPieces('check'))
            }

            // If playone or autoplay is true, progress accordingly
            else if (this.state.playOne) {
              let cD = this.state.cubeDimension;
              let tempRubiks = this.state.rubiksObject;
              let blockMoveLog = this.state.blockMoveLog;
              let moveLog = this.state.moveLog;
              let solveMoves = this.state.solveMoves;
              let moveSet = this.state.moveSet;
              let end = this.state.end;
              let solveState = this.state.solveState;
              let obj = {};

              if (typeof (moveSet[0][0]) === 'number') {
                this.changeSpeed(...moveSet[0], true);
                moveSet.shift();
                obj.moveSet = moveSet;
              }
              else {

                // generates data for next move
                let moveData = moveFuncs.parseMoveArray(moveSet);

                // takes next move data and queues changes to be made to state

                if (moveData) {
                  obj = cube.rotateCubeFace(...moveData, blockMoveLog, moveLog, solveMoves, end, solveState);
                }

                // Turn off play one so only runs once
                if (this.state.playOne) obj.playOne = false;

                // hides move the hint during the move
                this.mouseLeave();

                // store the object here
                if (moveData) {
                  obj.rubiksObject = cube.rotateFace(obj.face, obj.turnDirection, obj.cubeDepth, obj.isMulti, cD, tempRubiks);
                  obj.solvedSetIndex = this.state.solvedSetIndex + 1;
                }

                //console.log(obj);
              }
              this.setState(obj);
            }
            // Show hint over next move
            else if (this.state.moveSet.length) {
              let moveSet = this.state.moveSet;
              let obj = {};
              if (typeof (moveSet[0][0]) === 'number') {
                //console.log("changing speed");
                this.changeSpeed(...moveSet[0], true);
                moveSet.shift();
                obj.moveSet = moveSet;
              }
              else {
                let data = moveFuncs.convertMoveToData(moveSet[0]);
                if (data) {
                  this.mouseOver(this.state.moveSet[0], data);
                }
              }
              if (obj.length) {
                this.setState({ obj });
              }
            }
          }

          else if (this.state.currentFunc === "Color Picker") {
            // Code here for color picker interface
          }
          else if (this.state.currentFunc === 'Reset') {
            this.reset();
          }
          else {
            if (this.state.moveSet.length) {
              let cD = this.state.cubeDimension;
              let tempRubiks = this.state.rubiksObject;
              let blockMoveLog = this.state.blockMoveLog;
              let moveLog = this.state.moveLog;
              let solveMoves = this.state.solveMoves;
              let solveState = this.state.solveState;
              let end = this.state.end;


              if (typeof (this.state.moveSet[0][0]) === 'number') {
                //console.log("changing speed");
                let moveSet = this.state.moveSet;
                this.changeSpeed(...moveSet[0], true);
                moveSet.shift();
                this.setState({ moveSet });
              }
              else {
                let moveData = moveFuncs.parseMoveArray(this.state.moveSet);


                if (moveData) {
                  let obj = cube.rotateCubeFace(...moveData, blockMoveLog, moveLog, solveMoves, end, solveState);

                  obj.rubiksObject = cube.rotateFace(obj.face, obj.turnDirection, obj.cubeDepth, obj.isMulti, cD, tempRubiks);

                  this.setState(obj);
                }
              }

            }
            else {
              this.setState({ currentFunc: "None" });
            }
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
  }

  // Renders html to the index.html page
  render() {

    return (
      <div className="App" style={{ width: "max-content" }}>
        {/* Three.js canvas container (fixed, full-viewport). Placed first so UI paints above it. */}
        <div
          ref={this.canvasRef}
          style={{ position: "fixed", inset: 0, zIndex: 0 }}
        />

        <Navbar
          title="ZERO"
          changeSettings={this.changeSettings.bind(this)}
          isLocal={this.getSizeFromUrl(true)}
          state={this.state}
        />

        {this.state.currentFunc === "Color Picker" ? <></> : <p style={{ position: "fixed", top: "110px", left: "10px", color: "lightgrey", fontSize: "1rem", display: "none" }}>Speed: {this.state.currentSpeed}</p>}

        {this.state.currentFunc === "Color Picker" ? [] : <Speeds //Top left with slider
          onSliderChange={this.onSliderChange}
          speed={this.state.sliderSpeed}
        />}
        {this.state.showMoveInput ?
          <MoveInput
            algorithm={this.algorithm}
            handleDrag={this.handleDragInput}
            onStart={this.onStartInput}
            onStop={this.onStopInput}
          /> : []
        }
        {this.state.currentFunc === "Solving" ?
          <SolverInfo
            solvedSetLength={this.state.solvedSet.length}
            prevSetLength={this.state.prevSet.length}
          /> : []
        }
        {this.state.currentFunc === "Color Picker" ?
          <ColorPickerInfo
            colorPicked={this.state.colorPicked}
          /> : []
        }

        <div data-role="sidebar" data-no-camera-reset="true">
          <Menu
            state={this.state}
            setState={this.menuSetState}
            beginScramble={this.beginScramble}
            disableHover={this.state.showGuideArrows}

            //Controls
            generatedButtons={this.state.generatedButtons}
            size={this.getSizeFromUrl()}
            rotateOneFace={this.rotateOneFace}
            mouseEnter={this.mouseOver}
            mouseLeave={this.mouseLeave}

            //Color Picker
            beginColorPicker={this.beginColorPicker}
            endColorPicker={this.endColorPicker}
            colorPicked={this.state.colorPicked}
            changeColor={this.changeColor}
            isValidConfig={this.state.isValidConfig}
            setColorPickedCube={this.setColorPickedCube}
            cpErrors={this.state.cpErrors}
            runCheckColors={this.runCheckColors}

            //Solver
            beginSolve={this.beginSolve}
            stopSolve={this.stopSolve}
            playOne={this.playOne}
            rewindOne={this.rewindSolve}
            reload={this.reloadTurnedPieces}

            // Orientation
            onSetOrientation={this.handleSetOrientation}
          />
        </div>
        {/* Always show OrientationPicker */}
        <div data-role="orientation" data-no-camera-reset="true">
          <OrientationPicker
            onSetOrientation={this.handlePickOrientation}
            executeCubeRotation={this.executeCubeRotation}
            currentTop={this.state.topFaceColor}
            currentFront={this.state.frontFaceColor}
          />
        </div>

        <div style={{ width: "100%", position: "absolute", bottom: "85px", margin: "auto", display: "flex" }}>
          <div style={{ margin: "auto", display: "inline-flex", }}>
            {this.state.currentFunc === "None" || this.state.currentFunc === "Undo" || this.state.currentFunc === "Redo" || this.state.currentFunc === "Drag Turn" ?
              [<button key="undo" className="redoUndo" style={{ marginRight: "8px", fontSize: "2rem", color: "red", lineHeight: "2rem" }} onClick={() => this.undo()}><i className="fas fa-arrow-left"></i></button>,
              <button key="redo" className="redoUndo" style={{ marginLeft: "8px", fontSize: "2rem", color: "green", lineHeight: "2rem" }} onClick={() => this.redo()}><i className="fas fa-arrow-right"></i></button>]
              : ""
            }
          </div>
          {/* removed debug buttons */}
        </div>

      </div>
    );
  }
}

export default App;
