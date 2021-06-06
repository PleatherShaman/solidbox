import React from "react";
import "./hero-banner.css";

export const HeroBanner = () => {
    return (
        <div
            className={"hero-banner-container"}
            style={{ backgroundImage: "url(/Treasure-amico.png)" }}
        >
            <div className="hero-banner-text">
                <h1>Keeping your funds safe and secure.</h1>

                <p>
                    A smart contract to hold funds while you conduct your
                    business.
                </p>
            </div>
        </div>
    );
};
