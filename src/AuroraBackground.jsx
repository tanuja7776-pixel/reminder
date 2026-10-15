import React from "react";

export default function AuroraBackground({ variant }) {
  const palettes = {
    home: ["#2b1055", "#7597de", "#ff7eb3", "#ff758c"],
    lang: ["#ff9a8b", "#ff6a88", "#a18cd1", "#fbc2eb"],
    agenda: ["#43cea2", "#185a9d", "#00c9ff", "#92fe9d"],
  };
  const colors = palettes[variant] || palettes.home;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: `linear-gradient(120deg, ${colors[0]}, ${colors[1]} 40%, ${colors[2]} 70%, ${colors[3]})`,
        backgroundSize: "300% 300%",
        animation: "gradientShift 14s ease infinite",
      }}
    >
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
    </div>
  );
}