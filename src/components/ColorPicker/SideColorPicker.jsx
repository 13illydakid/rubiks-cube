import React from "react";
import "./ColorPicker.css";

const SideColorPicker = (props) => {
  function hideWarning() {
    document.querySelector(".warningPopup").style.display = "none";
    document.querySelector(".colorButtonContainer").style.visibility = "visible";
  }
  function showWarning() {
    document.querySelector(".warningPopup").style.display = "block";
    document.querySelector(".warningPopup").style.width = "100%";
    document.querySelector(".colorButtonContainer").style.visibility = "hidden";
  }

  return (
    <div className="sideColorPicker">
      <div className="warningPopup">
        <div id="cpChangeData" data=""></div>
        <div className="cpMessage">Progress will not be saved.</div>
        <button onClick={hideWarning} className="cpLeaveStay">Stay</button>
        <button onClick={props.endColorPicker} className="cpLeaveStay">Leave</button>
      </div>
      <div className="colorButtonContainer">
        {props.children}
        <div className="colorButtonDiv" style={{ paddingBottom: "0px", width: "100%" }}>
          <button id="ColorPicker" data="Color Picker" onClick={showWarning} className="colorPicker activeMenu colorPickerExit">Exit</button>
        </div>
      </div>
    </div>
  );
};

export default SideColorPicker;
