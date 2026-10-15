import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Plus, Trash2, MessageCircle, Globe, Sparkles, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------
   1. CONSTANTS & TRANSLATIONS
   ------------------------------------------------------------------ */
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

const STRINGS = {
  en: {
    appName: "ReMind",
    tagline: "Your day, planned beautifully",
    start: "Get Started",
    selectLanguageTitle: "Select your language",
    selectLanguageSub: "Choose the language you'd like to use",
    agendaTitle: "What is your today's agenda?",
    date: "Date",
    time: "Time",
    work: "Work",
    alarm: "Alarm",
    add: "Add row",
    delete: "Delete",
    askMe: "Ask me",
    workPlaceholder: "Enter task...",
    changeLanguage: "Change language",
    enableAlarms: "Enable sound & notifications",
    alarmsEnabled: "Alarms enabled",
    notifTitle: "Reminder",
    notifBody: (w) => `It's time for: ${w || "your task"}`,
    empty: "No tasks yet. Add a row to begin your day.",
  },
  te: {
    appName: "ReMind",
    tagline: "మీ రోజును అందంగా ప్లాన్ చేసుకోండి",
    start: "ప్రారంభించండి",
    selectLanguageTitle: "మీ భాషను ఎంచుకోండి",
    selectLanguageSub: "మీరు ఉపయోగించాలనుకుంటున్న భాషను ఎంచుకోండి",
    agendaTitle: "ఈ రోజు మీ ప్రణాళిక ఏమిటి?",
    date: "తేదీ",
    time: "సమయం",
    work: "పని",
    alarm: "అలారం",
    add: "వరుస జోడించు",
    delete: "తొలగించు",
    askMe: "నన్ను అడగండి",
    workPlaceholder: "పని వివరాలు నమోదు చేయండి...",
    changeLanguage: "భాష మార్చు",
    enableAlarms: "శబ్దం & నోటిఫికేషన్‌లు ఆన్ చేయండి",
    alarmsEnabled: "అలారాలు ఆన్‌లో ఉన్నాయి",
    notifTitle: "గుర్తు చేయడం",
    notifBody: (w) => `ఇది సమయం: ${w || "మీ పని"}`,
    empty: "ఇంకా పనులు లేవు. మీ రోజును ప్రారంభించడానికి ఒక వరుసను జోడించండి.",
  },
  hi: {
    appName: "ReMind",
    tagline: "अपने दिन को खूबसूरती से व्यवस्थित करें",
    start: "शुरू करें",
    selectLanguageTitle: "अपनी भाषा चुनें",
    selectLanguageSub: "जिस भाषा का उपयोग करना चाहते हैं उसे चुनें",
    agendaTitle: "आज आपका एजेंडा क्या है?",
    date: "तारीख",
    time: "समय",
    work: "काम",
    alarm: "अलार्म",
    add: "पंक्ति जोड़ें",
    delete: "हटाएं",
    askMe: "मुझसे पूछें",
    workPlaceholder: "काम लिखें...",
    changeLanguage: "भाषा बदलें",
    enableAlarms: "ध्वनि और सूचनाएं सक्षम करें",
    alarmsEnabled: "अलार्म सक्षम है",
    notifTitle: "याद दिलाना",
    notifBody: (w) => `अब समय है: ${w || "आपका काम"}`,
    empty: "अभी तक कोई काम नहीं। अपना दिन शुरू करने के लिए एक पंक्ति जोड़ें।",
  },
  ta: {
    appName: "ReMind",
    tagline: "உங்கள் நாளை அழகாக திட்டமிடுங்கள்",
    start: "தொடங்குங்கள்",
    selectLanguageTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLanguageSub: "நீங்கள் பயன்படுத்த விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்",
    agendaTitle: "இன்று உங்கள் திட்டம் என்ன?",
    date: "தேதி",
    time: "நேரம்",
    work: "வேலை",
    alarm: "அலாரம்",
    add: "வரிசை சேர்",
    delete: "நீக்கு",
    askMe: "என்னிடம் கேளுங்கள்",
    workPlaceholder: "பணியை உள்ளிடவும்...",
    changeLanguage: "மொழியை மாற்று",
    enableAlarms: "ஒலி & அறிவிப்புகளை இயக்கு",
    alarmsEnabled: "அலாரங்கள் இயக்கத்தில் உள்ளன",
    notifTitle: "நினைவூட்டல்",
    notifBody: (w) => `இதற்கான நேரம்: ${w || "உங்கள் பணி"}`,
    empty: "இன்னும் பணிகள் இல்லை. உங்கள் நாளைத் தொடங்க ஒரு வரிசையைச் சேர்க்கவும்.",
  },
  kn: {
    appName: "ReMind",
    tagline: "ನಿಮ್ಮ ದಿನವನ್ನು ಸುಂದರವಾಗಿ ಯೋಜಿಸಿ",
    start: "ಪ್ರಾರಂಭಿಸಿ",
    selectLanguageTitle: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectLanguageSub: "ನೀವು ಬಳಸಲು ಬಯಸುವ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    agendaTitle: "ಇಂದು ನಿಮ್ಮ ಕಾರ್ಯಸೂಚಿ ಏನು?",
    date: "ದಿನಾಂಕ",
    time: "ಸಮಯ",
    work: "ಕೆಲಸ",
    alarm: "ಅಲಾರಂ",
    add: "ಸಾಲು ಸೇರಿಸಿ",
    delete: "ಅಳಿಸಿ",
    askMe: "ನನ್ನನ್ನು ಕೇಳಿ",
    workPlaceholder: "ಕೆಲಸವನ್ನು ನಮೂದಿಸಿ...",
    changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    enableAlarms: "ಶಬ್ದ ಮತ್ತು ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    alarmsEnabled: "ಅಲಾರಂಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
    notifTitle: "ಜ್ಞಾಪನೆ",
    notifBody: (w) => `ಸಮಯ ಆಗಿದೆ: ${w || "ನಿಮ್ಮ ಕೆಲಸ"}`,
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಕೆಲಸಗಳಿಲ್ಲ. ನಿಮ್ಮ ದಿನವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಒಂದು ಸಾಲನ್ನು ಸೇರಿಸಿ.",
  },
  ml: {
    appName: "ReMind",
    tagline: "നിങ്ങളുടെ ദിവസം ഭംഗിയായി ആസൂത്രണം ചെയ്യൂ",
    start: "ആരംഭിക്കുക",
    selectLanguageTitle: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    selectLanguageSub: "നിങ്ങൾ ഉപയോഗിക്കാൻ ആഗ്രഹിക്കുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക",
    agendaTitle: "ഇന്നത്തെ നിങ്ങളുടെ അജണ്ട എന്താണ്?",
    date: "തീയതി",
    time: "സമയം",
    work: "ജോലി",
    alarm: "അലാറം",
    add: "വരി ചേർക്കുക",
    delete: "ഇല്ലാതാക്കുക",
    askMe: "എന്നോട് ചോദിക്കൂ",
    workPlaceholder: "ജോലി നൽകുക...",
    changeLanguage: "ഭാഷ മാറ്റുക",
    enableAlarms: "ശബ്ദവും അറിയിപ്പുകളും ഓണാക്കുക",
    alarmsEnabled: "അലാറങ്ങൾ ഓണാണ്",
    notifTitle: "ഓർമ്മപ്പെടുത്തൽ",
    notifBody: (w) => `സമയമായി: ${w || "നിങ്ങളുടെ ജോലി"}`,
    empty: "ഇതുവരെ ജോലികളൊന്നുമില്ല. നിങ്ങളുടെ ദിവസം തുടങ്ങാൻ ഒരു വരി ചേർക്കുക.",
  },
};

/* ------------------------------------------------------------------
   2. HELPER FUNCTIONS
   ------------------------------------------------------------------ */
let idCounter = 1;
const newId = () => idCounter++;

const todayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    let t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
      t += 0.5;
    }
    setTimeout(() => ctx.close(), 2000);
  } catch (e) {}
}

/* ------------------------------------------------------------------
   3. BACKGROUND ANIMATION
   ------------------------------------------------------------------ */
function AuroraBackground({ variant }) {
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

/* ------------------------------------------------------------------
   4. UI PAGES
   ------------------------------------------------------------------ */
function HomePage({ t, onStart }) {
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

function LanguagePage({ t, onSelect }) {
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

function AgendaPage({ t, onChangeLanguage }) {
  const [rows, setRows] = useState([
    { id: newId(), date: todayStr(), time: "", work: "", alarm: false },
  ]);
  const [alarmsReady, setAlarmsReady] = useState(false);
  const [ringing, setRinging] = useState(null);
  const firedRef = useRef(new Set());

  const addRow = () => {
    setRows((r) => [
      ...r,
      { id: newId(), date: todayStr(), time: "", work: "", alarm: false },
    ]);
  };

  const deleteRow = (id) => {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.id !== id) : r));
  };

  const updateRow = (id, field, value) => {
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const enableAlarms = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }
    playBeep();
    setAlarmsReady(true);
  };

  const triggerAlarm = useCallback(
    (row) => {
      playBeep();
      setRinging(row.id);
      setTimeout(() => setRinging((cur) => (cur === row.id ? null : cur)), 4000);
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(t.notifTitle, { body: t.notifBody(row.work) });
        } catch (e) {}
      }
    },
    [t]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const hm = nowHM();
      const today = todayStr();
      rows.forEach((row) => {
        if (!row.alarm || !row.time) return;
        const key = `${row.id}-${row.date}-${row.time}`;
        if (row.date === today && row.time === hm && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          triggerAlarm(row);
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [rows, triggerAlarm]);

  const askMe = () => {
    window.open("https://chat.openai.com", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page-agenda">
      <AuroraBackground variant="agenda" />
      <div className="agenda-wrap" style={{ zIndex: 1 }}>
        <div className="agenda-topbar">
          <h2 className="agenda-title">{t.agendaTitle}</h2>
          <button className="btn-ghost" onClick={onChangeLanguage}>
            <Globe size={16} style={{ marginRight: 6 }} />
            {t.changeLanguage}
          </button>
        </div>

        {!alarmsReady && (
          <button className="btn-secondary" onClick={enableAlarms}>
            <Bell size={16} style={{ marginRight: 6 }} />
            {t.enableAlarms}
          </button>
        )}
        {alarmsReady && <div className="alarm-ready-badge">✓ {t.alarmsEnabled}</div>}

        <div className="table-card">
          <table className="agenda-table">
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.time}</th>
                <th>{t.work}</th>
                <th>{t.alarm}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={ringing === row.id ? "row-ringing" : ""}
                >
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => updateRow(row.id, "date", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={(e) => updateRow(row.id, "time", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder={t.workPlaceholder}
                      value={row.work}
                      onChange={(e) => updateRow(row.id, "work", e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={row.alarm}
                        onChange={(e) =>
                          updateRow(row.id, "alarm", e.target.checked)
                        }
                      />
                      <span className="slider" />
                    </label>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn"
                      onClick={() => deleteRow(row.id)}
                      title={t.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="agenda-bottombar">
          <button className="btn-add" onClick={addRow}>
            <Plus size={18} style={{ marginRight: 6 }} />
            {t.add}
          </button>
          <button className="btn-ask" onClick={askMe}>
            <MessageCircle size={18} style={{ marginRight: 6 }} />
            {t.askMe}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   5. MAIN APP COMPONENT
   ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang] || STRINGS.en;

  return (
    <div className="app-root">
      <style>{`
        * { box-sizing: border-box; }
        .app-root {
          font-family: 'Segoe UI', Poppins, system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          width: 100%;
          color: #fff;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floaty {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.08); }
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.45;
          animation: floaty 10s ease-in-out infinite;
        }
        .blob1 { width: 320px; height: 320px; background: #fff2; top: -60px; left: -60px; }
        .blob2 { width: 260px; height: 260px; background: #ffffff33; bottom: -40px; right: -20px; animation-delay: 2s; }
        .blob3 { width: 200px; height: 200px; background: #ffffff22; top: 40%; left: 60%; animation-delay: 4s; }

        .page-center {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
        }
        .content-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 520px;
        }
        .logo-mark {
          width: 110px; height: 110px;
          border-radius: 32px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .logo-mark-sm { width: 80px; height: 80px; border-radius: 24px; }
        .app-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: 1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
        .page-heading {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 8px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
        .app-tagline {
          font-size: 1.05rem;
          opacity: 0.92;
          margin: 0 0 32px;
        }
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          background: #fff;
          color: #6a3de8;
          font-weight: 700;
          font-size: 1.05rem;
          padding: 16px 36px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .btn-primary:hover { transform: translateY(-3px) scale(1.03); }
        .btn-glow { animation: pulseGlow 2.5s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(255,255,255,0.25); }
          50% { box-shadow: 0 8px 40px rgba(255,255,255,0.55); }
        }
        .lang-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 16px;
          width: 100%;
        }
        .lang-btn {
          padding: 18px 12px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.16);
          color: #fff;
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lang-btn:hover {
          background: rgba(255,255,255,0.32);
          transform: translateY(-2px);
        }

        .page-agenda {
          position: relative;
          min-height: 100vh;
          padding: 32px 16px 60px;
          overflow: hidden;
        }
        .agenda-wrap {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .agenda-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .agenda-title {
          font-size: 1.7rem;
          font-weight: 800;
          margin: 0;
          text-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .btn-ghost {
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .btn-secondary {
          align-self: flex-start;
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.9);
          color: #185a9d;
          border: none;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.18);
        }
        .alarm-ready-badge {
          align-self: flex-start;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.4);
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .table-card {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px;
          padding: 12px;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          overflow-x: auto;
        }
        .agenda-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .agenda-table th {
          text-align: left;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.85;
          padding: 0 10px 4px;
        }
        .agenda-table td {
          background: rgba(255,255,255,0.92);
          padding: 8px 10px;
          color: #222;
        }
        .agenda-table tr td:first-child { border-radius: 12px 0 0 12px; }
        .agenda-table tr td:last-child { border-radius: 0 12px 12px 0; }
        .agenda-table input[type="text"],
        .agenda-table input[type="date"],
        .agenda-table input[type="time"] {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: #222;
          padding: 6px 4px;
          outline: none;
        }
        .row-ringing td {
          background: #ffe6a7 !important;
          animation: ringPulse 0.6s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        .switch input:checked + .slider { background-color: #185a9d; }
        .switch input:checked + .slider:before { transform: translateX(18px); }
        .icon-btn {
          border: none;
          background: #ffe0e0;
          color: #c0392b;
          width: 32px; height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .icon-btn:hover { background: #ffcaca; }
        .agenda-bottombar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .btn-add, .btn-ask {
          display: inline-flex; align-items: center;
          border: none;
          padding: 12px 22px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }
        .btn-add { background: #ffffff; color: #185a9d; }
        .btn-ask { background: #ffdd55; color: #6a4e00; margin-left: auto; }
        .btn-add:hover, .btn-ask:hover { transform: translateY(-2px); }

        @media (max-width: 520px) {
          .app-title { font-size: 2.2rem; }
          .lang-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {page === "home" && <HomePage t={t} onStart={() => setPage("lang")} />}
      {page === "lang" && (
        <LanguagePage
          t={t}
          onSelect={(code) => {
            setLang(code);
            setPage("agenda");
          }}
        />
      )}
      {page === "agenda" && (
        <AgendaPage t={t} onChangeLanguage={() => setPage("lang")} />
      )}
    </div>
  );
}