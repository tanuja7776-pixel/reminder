import React from "react";
import { Globe } from "lucide-react";
import AuroraBackground from "./AuroraBackground";
import { LANGUAGES } from "../utils/constants";

export default function LanguagePage({ t, onSelect }) {
  return (
    <div className="page-center">
      <AuroraBackground variant="lang" />
      <div className="content-col" style={{ zIndex: 1 }}>
        <div className="logo-mark logo-mark-sm">
          <Globe size={36} color="#fff" strokeWidth={1.8} />
        </div>
        <h2 className="page-heading">{t.selectLanguageTitle}</h2>
        <p className="app-tagline">{t.selectLanguageSub}</p>
        <div className="lang-grid">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className="lang-btn"
              onClick={() => onSelect(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}