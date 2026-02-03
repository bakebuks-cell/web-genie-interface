import React from "react";

export const QuantumPulseLoader = () => {
  return (
    <div className="generating-loader-wrapper">
      <div className="generating-loader-text">
        {"Generating".split("").map((char, index) => (
          <span
            key={index}
            className="generating-loader-letter"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="generating-loader-bar" />
    </div>
  );
};
