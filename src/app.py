# app.py
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)
DB = "reminders.db"


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db:
        db.close()


def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                remind_at TEXT NOT NULL,      -- ISO format: 2026-10-20T09:30
                notified INTEGER DEFAULT 0,
                completed INTEGER DEFAULT 0
            )
        """)


@app.post("/api/reminders")
def create_reminder():
    data = request.get_json(force=True)
    if not data.get("title") or not data.get("remind_at"):
        return jsonify(error="title and remind_at are required"), 400
    try:
        datetime.fromisoformat(data["remind_at"])
    except ValueError:
        return jsonify(error="remind_at must be ISO format, e.g. 2026-10-20T09:30"), 400

    db = get_db()
    cur = db.execute(
        "INSERT INTO reminders (title, description, remind_at) VALUES (?, ?, ?)",
        (data["title"], data.get("description", ""), data["remind_at"]),
    )
    db.commit()
    return jsonify(id=cur.lastrowid), 201


@app.get("/api/reminders")
def list_reminders():
    rows = get_db().execute("SELECT * FROM reminders ORDER BY remind_at").fetchall()
    return jsonify([dict(r) for r in rows])


@app.put("/api/reminders/<int:rid>")
def update_reminder(rid):
    data = request.get_json(force=True)
    db = get_db()
    row = db.execute("SELECT * FROM reminders WHERE id = ?", (rid,)).fetchone()
    if not row:
        return jsonify(error="not found"), 404
    db.execute(
        "UPDATE reminders SET title=?, description=?, remind_at=?, completed=? WHERE id=?",
        (
            data.get("title", row["title"]),
            data.get("description", row["description"]),
            data.get("remind_at", row["remind_at"]),
            int(data.get("completed", row["completed"])),
            rid,
        ),
    )
    db.commit()
    return jsonify(message="updated")


@app.delete("/api/reminders/<int:rid>")
def delete_reminder(rid):
    db = get_db()
    db.execute("DELETE FROM reminders WHERE id = ?", (rid,))
    db.commit()
    return jsonify(message="deleted")


def check_due_reminders():
    now = datetime.now().isoformat(timespec="minutes")
    with sqlite3.connect(DB) as conn:
        conn.row_factory = sqlite3.Row
        due = conn.execute(
            "SELECT * FROM reminders WHERE notified = 0 AND completed = 0 AND remind_at <= ?",
            (now,),
        ).fetchall()
        for r in due:
            # Replace this print with email / SMS / push notification logic
            print(f"⏰ REMINDER: {r['title']} - {r['description']}")
            conn.execute("UPDATE reminders SET notified = 1 WHERE id = ?", (r["id"],))


if __name__ == "__main__":
    init_db()
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_due_reminders, "interval", seconds=30)
    scheduler.start()
    app.run(debug=True, use_reloader=False, port=5000)