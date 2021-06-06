import React from "react";
import "./alert.css";

export const Alert = (props) => {
    return (
        <div className="alert-container">
            <div className={`alert ${props.alert.type}`}>
                {props.alert.message}
            </div>
        </div>
    );
};
