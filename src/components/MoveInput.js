import React from "react";
import Draggable from 'react-draggable';

const MoveInput = (props) => {
    const instructTurn = (e) => {
        if(e.key==='Enter'){
            props.algorithm(document.getElementById('moveInput').value,'Custom');
        }
        e.stopPropagation();
    };

    return (
        <div style={{position: "absolute", zIndex: "99"}}>
            <Draggable
                handle=".handle"
                defaultPosition={{x:/*window.innerWidth-220*/0 , y: 150}}
                position={null}
                grid={[50, 50]}
                scale={1}
                onStart={props.handleStart}
                onDrag={props.handleDrag}
                onStop={props.handleStop}>
                <div>
                    <div className="handle" style={{color:"grey"}}>Drag from here</div>
                    <div>
                        <input placeholder="type moves here" id="moveInput" onKeyDown={instructTurn} style={{borderRadius: "4px", margin: "1px",border: "1.5px solid #007bff",width:"200px"}}></input>
                        <button id="moveSubmit" onClick={() => props.algorithm(document.getElementById('moveInput').value,'Custom')}>Enter</button>
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

export default MoveInput;


/*
[
  [
    "white",
    "blue",
    "black",
    "black",
    "orange",
    "black",
    0,
    0,
    2,
    0,
    0,
    2,
    "corner",
    null,
    null
  ],
  [
    "white",
    "blue",
    "black",
    "black",
    "black",
    "black",
    1,
    0,
    2,
    1,
    0,
    2,
    "edge",
    "center",
    null
  ],
  [
    "white",
    "blue",
    "red",
    "black",
    "black",
    "black",
    2,
    0,
    2,
    2,
    0,
    2,
    "corner",
    null,
    null
  ],
  [
    "white",
    "black",
    "black",
    "black",
    "orange",
    "black",
    0,
    0,
    1,
    0,
    0,
    1,
    "edge",
    "center",
    null
  ],
  [
    "white",
    "black",
    "black",
    "black",
    "black",
    "black",
    1,
    0,
    1,
    1,
    0,
    1,
    "middle",
    null,
    2
  ],
  [
    "white",
    "black",
    "red",
    "black",
    "black",
    "black",
    2,
    0,
    1,
    2,
    0,
    1,
    "edge",
    "center",
    null
  ],
  [
    "white",
    "black",
    "black",
    "black",
    "orange",
    "green",
    0,
    0,
    0,
    0,
    0,
    0,
    "corner",
    null,
    null
  ],
  [
    "white",
    "black",
    "black",
    "black",
    "black",
    "green",
    1,
    0,
    0,
    1,
    0,
    0,
    "edge",
    "center",
    null
  ],
  [
    "white",
    "black",
    "red",
    "black",
    "black",
    "green",
    2,
    0,
    0,
    2,
    0,
    0,
    "corner",
    null,
    null
  ],
  [
    "black",
    "blue",
    "black",
    "black",
    "orange",
    "black",
    0,
    1,
    2,
    0,
    1,
    2,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "blue",
    "black",
    "black",
    "black",
    "black",
    1,
    1,
    2,
    1,
    1,
    2,
    "middle",
    null,
    2
  ],
  [
    "black",
    "blue",
    "red",
    "black",
    "black",
    "black",
    2,
    1,
    2,
    2,
    1,
    2,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "black",
    "black",
    "black",
    "orange",
    "black",
    0,
    1,
    1,
    0,
    1,
    1,
    "middle",
    null,
    2
  ],
  [
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
    1,
    1,
    1,
    1,
    1,
    1,
    "none",
    null,
    null
  ],
  [
    "black",
    "black",
    "red",
    "black",
    "black",
    "black",
    2,
    1,
    1,
    2,
    1,
    1,
    "middle",
    null,
    2
  ],
  [
    "black",
    "black",
    "black",
    "black",
    "orange",
    "green",
    0,
    1,
    0,
    0,
    1,
    0,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "black",
    "black",
    "black",
    "black",
    "green",
    1,
    1,
    0,
    1,
    1,
    0,
    "middle",
    null,
    2
  ],
  [
    "black",
    "black",
    "red",
    "black",
    "black",
    "green",
    2,
    1,
    0,
    2,
    1,
    0,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "blue",
    "black",
    "yellow",
    "orange",
    "black",
    0,
    2,
    2,
    0,
    2,
    2,
    "corner",
    null,
    null
  ],
  [
    "black",
    "blue",
    "black",
    "yellow",
    "black",
    "black",
    1,
    2,
    2,
    1,
    2,
    2,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "blue",
    "red",
    "yellow",
    "black",
    "black",
    2,
    2,
    2,
    2,
    2,
    2,
    "corner",
    null,
    null
  ],
  [
    "black",
    "black",
    "black",
    "yellow",
    "orange",
    "black",
    0,
    2,
    1,
    0,
    2,
    1,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "black",
    "black",
    "yellow",
    "black",
    "black",
    1,
    2,
    1,
    1,
    2,
    1,
    "middle",
    null,
    2
  ],
  [
    "black",
    "black",
    "red",
    "yellow",
    "black",
    "black",
    2,
    2,
    1,
    2,
    2,
    1,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "black",
    "black",
    "yellow",
    "orange",
    "green",
    0,
    2,
    0,
    0,
    2,
    0,
    "corner",
    null,
    null
  ],
  [
    "black",
    "black",
    "black",
    "yellow",
    "black",
    "green",
    1,
    2,
    0,
    1,
    2,
    0,
    "edge",
    "center",
    null
  ],
  [
    "black",
    "black",
    "red",
    "yellow",
    "black",
    "green",
    2,
    2,
    0,
    2,
    2,
    0,
    "corner",
    null,
    null
  ]
]
*/