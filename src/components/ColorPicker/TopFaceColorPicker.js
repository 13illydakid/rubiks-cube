import React from "react";
import ColorButton from "./ColorButton";
import "./ColorPicker.css";

const colors = ["white", "blue", "red", "yellow", "orange", "green"];

const TopFaceColorPicker = ({ onPick, currentColor }) => {
  return (
    <div className="cp-container" style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Select Top Face Color</h3>
      <div className="colorButtonContainer">
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            colorPicked={currentColor}
            changeColor={() => onPick(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopFaceColorPicker;
