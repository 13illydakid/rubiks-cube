import React, { useEffect, useMemo, useState } from "react";
import "./ColorPicker/ColorPicker.css";
import * as Orientation from "./Orientation";

const COLORS = ["yellow", "red", "blue", "orange", "green", "white"];

export default function OrientationPicker({ onSetOrientation, currentTop, currentFront }) {
  const [topColor, setTopColor] = useState(currentTop || "yellow");
  const [frontColor, setFrontColor] = useState(currentFront || "red");

  // Map selected top color to its valid front colors using Orientation.js
  const allowedFronts = useMemo(() => {
    const map = {
      yellow: Orientation.YellowTop,
      red: Orientation.RedTop,
      blue: Orientation.BlueTop,
      orange: Orientation.OrangeTop,
      green: Orientation.GreenTop,
      white: Orientation.WhiteTop,
    };
    const obj = map[topColor] || {};
    return Object.keys(obj);
  }, [topColor]);

  // When top changes, ensure front is valid; prioritize red if available
  useEffect(() => {
    if (!allowedFronts.includes(frontColor)) {
      const fallback = allowedFronts.includes("red") ? "red" : allowedFronts[0];
      if (fallback) setFrontColor(fallback);
    }
  }, [allowedFronts, frontColor]);

  const handleApply = () => {
    // Debug: log selected values
    // eslint-disable-next-line no-console
    console.log("Set Orientation clicked:", { topFaceColor: topColor, frontFaceColor: frontColor });
    onSetOrientation(topColor, frontColor);
  };

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
      zIndex: 9999,
      pointerEvents: "auto",
      minWidth: "220px"
    }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Cube Orientation</h3>
      <div style={{ fontSize: ".9rem", color: "#555", marginBottom: ".5rem" }}>
        Top: {topColor} • Front: {frontColor}
      </div>
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
          {COLORS.map(color => {
            const isAllowed = allowedFronts.includes(color);
            return (
              <button
                key={color}
                style={{
                  background: color,
                  border: frontColor === color ? "2px solid #333" : "1px solid #ccc",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: isAllowed ? "pointer" : "not-allowed",
                  opacity: isAllowed ? 1 : 0.3,
                }}
                onClick={() => isAllowed && setFrontColor(color)}
                aria-label={`Set front face to ${color}`}
                disabled={!isAllowed}
              />
            );
          })}
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
        onClick={handleApply}
      >
        Set Orientation
      </button>
    </div>
  );
}
