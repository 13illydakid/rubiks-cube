import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ColorButton from "../ColorPicker/ColorButton.jsx";
import "../ColorPicker/ColorPicker.css";
import "./TopFaceColor.css";

const TopFaceColor = (props) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = ["white", "blue", "red", "yellow", "orange", "green"];

  const handleColorClick = (color) => {
    setSelectedColor(color);
  }

  return (
    <Row className="cp-container">
      <Col>
        <div className="faceColorButtonContainer">

          {colors.map((color, i) => <ColorButton
            index={i + 1}
            key={color}
            color={color}
            colorPicked={props.colorPicked}
            changeColor={props.changeColor}
            isMobile={props.isMobile}
            onClick={() => handleColorClick(color)} // Pass the click handler
          />)}
          <strong style={{ color: 'green', fontSize: '1rem' }}>{selectedColor}</strong>
        </div>
      </Col>
    </Row>
  )
}

export default TopFaceColor;
