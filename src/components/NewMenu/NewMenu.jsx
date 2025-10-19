import React, { useState } from "react";
import OLLPanel from "../OLL/OLLPanel.jsx";
import "./NewMenu.css";

const NewMenu = (props) => {
  const [showOll, setShowOll] = useState(false);

  return (
    <div className="newMenu" data-no-camera-reset>
      <button className="newMenuBtn" onClick={() => setShowOll((v) => !v)}>
        OLL
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
    </div>
  );
};

export default React.memo(NewMenu);
