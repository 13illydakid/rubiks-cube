import React from "react";

const ColorButton = ({ index, color, colorPicked, changeColor, isMobile }) => {
  let fontSize = isMobile ? ".5rem" : "1.3rem";
  let padding = isMobile ? "5px" : "10px";

  return (
    <div className="colorButtonDiv">
      <button
        className={`colorPicker color${index}`}
        style={{ color, fontSize, padding }}
        onClick={() => changeColor(color)}
      >
        {colorPicked === color ? <strong>{color.toUpperCase()}</strong> : color.toUpperCase()}
      </button>
    </div>
  );
};

export default ColorButton;
