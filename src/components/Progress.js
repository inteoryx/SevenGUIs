import React from "react";
import "./Progress.css";


function Progress(props) {
    return (
        <div className="progressBar">
            <div className={"progressBarInner" + ((props.progress >= 1) ? " complete" : "")} style={{ width: props.progress * 100 + "%" }} />
        </div>
    );
}

export default Progress;