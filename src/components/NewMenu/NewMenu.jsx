import React, { useState } from "react";
import OLLPanel from "../OLL/OLLPanel.jsx";
import PLLPanel from "../PLL/PLLPanel.jsx";
import "./NewMenu.css";

const NewMenu = (props) => {
  const [showOll, setShowOll] = useState(false);
  const [showPll, setShowPll] = useState(false);

  return (
    <div className="newMenu" data-no-camera-reset>
      <button
        className="newMenuBtn"
        onClick={() => {
          if (showPll) setShowPll(false);
          setShowOll((v) => !v);
        }}
      >
        OLL
      </button>
      <button
        className="newMenuBtn"
        onClick={() => {
          if (showOll) setShowOll(false);
          setShowPll((v) => !v);
        }}
      >
        PLL
      </button>
      {showOll && (
        // OLLPanel already positions itself; just toggle it here
        <OLLPanel
          {...props}
          open={showOll}
          reload={props.reload}
          playOne={props.playOne}
          onClose={() => setShowOll(false)}
        />
      )}
      {showPll && (
        <PLLPanel
          {...props}
          open={showPll}
          reload={props.reload}
          playOne={props.playOne}
          onClose={() => setShowPll(false)}
        />
      )}
    </div>
  );
};

export default React.memo(NewMenu);
