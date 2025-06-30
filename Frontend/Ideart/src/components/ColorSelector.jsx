import React from "react";

const colors = [
  { name: "black", hex: "#000000" },
  { name: "white", hex: "#ffffff" },
  { name: "red", hex: "#e60000" },
  { name: "blue", hex: "#0000b3" },
];

const ColorSelector = () => {
  return (
    <div className="color-selector">
      {colors.map((color) => (
        <span
          key={color.name}
          className="color-circle"
          style={{ backgroundColor: color.hex }}
        ></span>
      ))}
    </div>
  );
};

export default ColorSelector;
