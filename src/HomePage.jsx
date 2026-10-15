import React from "react";
import { Bell, Sparkles, ArrowRight } from "lucide-react";
import AuroraBackground from "./AuroraBackground";

export default function HomePage({ t, onStart }) {
  return (
    <div className="page-center">
      <AuroraBackground variant="home" />
      <div className="content-col" style={{ zIndex: 1 }}>
        <div className="logo-mark">
          <Bell size={56} color="#fff" strokeWidth={1.8} />
        </div>
        <h1 className="app-title">{t.appName}</h1>
        <p className="app-tagline">{t.tagline}</p>
        <button className="btn-primary btn-glow" onClick={onStart}>
          <Sparkles size={20} style={{ marginRight: 8 }} />
          {t.start}
          <ArrowRight size={20} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  );
}