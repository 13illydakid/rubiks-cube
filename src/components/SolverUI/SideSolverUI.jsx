import React from "react";
import "./SideSolverUI.css";

const SideSolverUI = ({ status, onStart, onStop }) => {
  return (
    <div className="sideSolverUI">
      <div className="status">Status: {status}</div>
      <div className="controls">
        <button className="btn btn-primary" onClick={onStart}>Start</button>
        <button className="btn btn-secondary" onClick={onStop}>Stop</button>
      </div>
    </div>
  );
};

export default SideSolverUI;
