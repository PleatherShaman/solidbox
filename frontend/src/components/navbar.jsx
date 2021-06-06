import React from "react";
import "./navbar.css";

export const Navbar = () => {
    return (
        <div className="navbar-continer">
            <div className="logo-image">
                <img
                    className="logo-image"
                    src="./solidbox_logo.jpg"
                    alt="solidbox-logo"
                />
            </div>

            <div className="logo-text-container">
                <div className="logo-text">Solidbox</div>
                <div className="logo-subheading">Safe and secure</div>
            </div>
        </div>
    );
};
