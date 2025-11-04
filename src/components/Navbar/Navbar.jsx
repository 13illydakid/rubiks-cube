import React from "react";
import "./Nav.css";
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import logo from "../../assets/favicon.png";

const notationImageModules = import.meta.glob("../../assets/notations/*.png", { eager: true, import: 'default' });
const notationImageByNumber = (() => {
  const map = new Map();
  for (const path in notationImageModules) {
    const filename = path.split('/').pop();
    const base = filename?.split('.')?.[0] || '';
    const num = parseInt(base, 10);
    if (!Number.isNaN(num)) {
      map.set(String(num), notationImageModules[path]);
    }
  }
  return map;
});

// Build the map once at module load using the provided function expression
const notationImageMap = notationImageByNumber();

const Navbar = (props) => {
  const rows = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9],
    [13, 14, 15, 10, 11, 12]
  ];

  return (
    <nav className="navbar navbar-dark fixed-top">
      <div className="logo" >
        <Link to="/" >
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="notations-container" aria-label="Cube notation legend">
        {rows.map((nums, idx) => (
          <div className={`notations-row row-${idx + 1}`} key={`row-${idx + 1}`}>
            {nums.map((n) => {
              const src = notationImageMap.get(String(n));
              if (!src) return null;
              return (
                <img
                  key={`notation-${n}`}
                  className="notation-img"
                  src={src}
                  alt={`Notation ${n}`}
                  loading="lazy"
                />
              );
            })}
          </div>
        ))}
      </div>
    </nav>)
};

export default Navbar;
