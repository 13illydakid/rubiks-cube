import React from "react";
import "./Nav.css";
// Cleaned up unused react-bootstrap dropdown imports
import Popup from "reactjs-popup";
import notations from "../../assets/notations.png";
import { Link } from "react-router-dom";
import logo from "../../assets/favicon.png";

const Navbar = props => {
  // Legacy dropdowns removed during cleanup
  return (
    <nav className="navbar navbar-dark fixed-top">
      <div className="logo" >
        <Link to="/" >
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div style={{ float: "right", height: "100%" }} >
        <Popup trigger={<button id="infoBtn">Notations</button>}>
          {close => (
            <div style={{ width: "100%", height: "100%" }}>
              <div className="shadeBackground" style={{ backgroundColor: "black" }} onClick={close}></div>
              <div className="popupDiv">
                <div className="closeBtn" id="closeBtn" onClick={close}>
                  &times;
                </div>
                  <div>Click and drag anywhere <br/> not on the cube to rotate.</div>
                  <div className="cube-notations-container">
                    <img src={notations} alt="Cube Notations" className="notations-image" />
                  </div>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </nav>)
};

export default Navbar;
