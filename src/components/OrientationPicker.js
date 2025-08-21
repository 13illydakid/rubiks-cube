import React, { useState } from "react";
import "./ColorPicker/ColorPicker.css";

const COLORS = ["yellow", "red", "blue", "orange", "green", "white"];

export default function OrientationPicker({ onSetOrientation, currentTop, currentFront }) {
  const [topColor, setTopColor] = useState(currentTop || "yellow");
  const [frontColor, setFrontColor] = useState(currentFront || "red");

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      right: "32px",
      transform: "translateY(-50%)",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      padding: "2rem 1.5rem",
      zIndex: 1000,
      minWidth: "220px"
    }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Cube Orientation</h3>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "bold" }}>Top Face:</label>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          {COLORS.map(color => (
            <button
              key={color}
              style={{
                background: color,
                border: topColor === color ? "2px solid #333" : "1px solid #ccc",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer"
              }}
              onClick={() => setTopColor(color)}
              aria-label={`Set top face to ${color}`}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "bold" }}>Front Face:</label>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          {COLORS.map(color => (
            <button
              key={color}
              style={{
                background: color,
                border: frontColor === color ? "2px solid #333" : "1px solid #ccc",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer"
              }}
              onClick={() => setFrontColor(color)}
              aria-label={`Set front face to ${color}`}
            />
          ))}
        </div>
      </div>
      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => onSetOrientation(topColor, frontColor)}
      >
        Set Orientation
      </button>
    </div>
  );
}
