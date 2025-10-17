import React, { useEffect, useMemo, useState } from "react";
import "./ColorPicker/ColorPicker.css";
import * as Orientation from "./Orientation";

const COLORS = ["yellow", "red", "blue", "orange", "green", "white"];

export default function OrientationPicker({ onSetOrientation, currentTop, currentFront, executeCubeRotation }) {
  const [topColor, setTopColor] = useState(currentTop || "yellow");
  const [frontColor, setFrontColor] = useState(currentFront || "red");
  const [shouldReset, setShouldReset] = useState(true);

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
    console.log(currentTop, currentFront);
    console.log("Set Orientation clicked:", { topFaceColor: topColor, frontFaceColor: frontColor, reset: shouldReset });

    onSetOrientation(topColor, frontColor, { reset: shouldReset });
  };

  const handlePositioning = () => {
    // Build faces array for a given top/front using Orientation tables
    const facesFrom = (top, front) => {
      const map = {
        yellow: Orientation.YellowTop,
        red: Orientation.RedTop,
        blue: Orientation.BlueTop,
        orange: Orientation.OrangeTop,
        green: Orientation.GreenTop,
        white: Orientation.WhiteTop,
      };
      const table = map[top];
      return table ? table[front] : null; // [right,left,back,front,top,bottom]
    };

    // Apply a whole-cube orientation rotation to faces
    const simulate = (faces, axis, prime) => {
      let [right, left, back, front, top, bottom] = faces;
      let newRight = right, newLeft = left, newBack = back, newFront = front, newTop = top, newBottom = bottom;
      if (axis === 'x') {
        if (!prime) { newTop = front; newBack = top; newBottom = back; newFront = bottom; }
        else { newTop = back; newBack = bottom; newBottom = front; newFront = top; }
      } else if (axis === 'y') {
        // if (!prime) { newRight = back; newBack = left; newLeft = front; newFront = right; }
        // else { newLeft = back; newBack = right; newRight = front; newFront = left; }
        if (!prime) { newRight = front; newBack = right; newLeft = back; newFront = left; }
        else { newLeft = front; newBack = left; newRight = back; newFront = right; }
      } else if (axis === 'z') {
        if (!prime) { newRight = top; newBottom = right; newLeft = bottom; newTop = left; }
        else { newLeft = top; newBottom = left; newRight = bottom; newTop = right; }
      }
      return [newRight, newLeft, newBack, newFront, newTop, newBottom];
    };

    // BFS to find minimal x/y/z sequence between orientations
    const computeSequence = (startTop, startFront, targetTop, targetFront) => {
      const startFaces = facesFrom(startTop, startFront);
      const targetKey = `${targetTop}|${targetFront}`;
      const key = (faces) => `${faces[4]}|${faces[3]}`; // top|front
      if (!startFaces) return [];
      if (key(startFaces) === targetKey) return [];
      const moves = [["x", false], ["x", true], ["y", false], ["y", true], ["z", false], ["z", true]];
      const toNotation = (axis, prime) => (prime ? axis.toUpperCase() : axis);
      const q = [{ faces: startFaces, seq: [] }];
      const seen = new Set([key(startFaces)]);
      while (q.length) {
        const { faces, seq } = q.shift();
        for (const [axis, prime] of moves) {
          const nf = simulate(faces, axis, prime);
          const k = key(nf);
          if (seen.has(k)) continue;
          const nseq = [...seq, toNotation(axis, prime)];
          if (k === targetKey) return nseq;
          seen.add(k);
          q.push({ faces: nf, seq: nseq });
        }
      }
      return [];
    };

    const seq = computeSequence(currentTop, currentFront, topColor, frontColor);
    // eslint-disable-next-line no-console
    console.log("Minimal orientation sequence:", seq);

    // Optionally execute the sequence if a runner is passed in
    if (seq.length && typeof executeCubeRotation === 'function') {
      const applyNext = (i = 0) => {
        if (i >= seq.length) return;
        const sym = seq[i];
        const axis = sym.toLowerCase();
        const prime = sym !== axis;
        executeCubeRotation(axis, prime);
        // Stagger calls; App handles actual timing/animation
        setTimeout(() => applyNext(i + 1), 450);
      };
      applyNext(0);
    }

    return seq;
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
      <label style={{ display: "none", alignItems: "center", gap: ".5rem", marginBottom: ".5rem", fontSize: ".9rem", color: "#444" }}>
        <input
          type="checkbox"
          checked={shouldReset}
          onChange={(e) => setShouldReset(e.target.checked)}
        />
        Reset cube on apply
      </label>
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
      <button
        style={{
          color: "red",
          background: "pink",
          display: "none",
        }}
        onClick={handlePositioning}
      >
        test button
      </button>
    </div>
  );
}
