import React from "react";

const SideColorPickerController = ({ onChange, value }) => {
  return (
    <div className="sideColorPickerController">
      <label htmlFor="scpSelect" style={{ marginRight: 8 }}>Select color:</label>
      <select id="scpSelect" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="white">White</option>
        <option value="blue">Blue</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
        <option value="orange">Orange</option>
        <option value="green">Green</option>
      </select>
    </div>
  );
};

export default SideColorPickerController;
