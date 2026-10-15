import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Plus, Trash2, MessageCircle, Globe } from "lucide-react";
import AuroraBackground from "./AuroraBackground";
import { newId, todayStr, nowHM, playBeep } from "../utils/helpers";

export default function AgendaPage({ t, onChangeLanguage }) {
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