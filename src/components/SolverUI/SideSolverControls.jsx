import React from "react";

const SideSolverControls = ({ onPrev, onNext, onReset }) => {
  return (
    <div className="sideSolverControls">
      <button className="btn btn-light" onClick={onPrev}>Prev</button>
      <button className="btn btn-light" onClick={onNext}>Next</button>
      <button className="btn btn-danger" onClick={onReset}>Reset</button>
    </div>
  );
};

export default SideSolverControls;
