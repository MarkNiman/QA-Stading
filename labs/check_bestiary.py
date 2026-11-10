"""Run the synthetic G1 bestiary in an isolated in-memory SQLite database."""
from pathlib import Path
import sqlite3

with sqlite3.connect(":memory:") as db:
    db.executescript(Path(__file__).with_name("bestiary.sql").read_text(encoding="utf-8"))
    humanoids = db.execute(
        "SELECT name FROM creatures WHERE kind = 'humanoid' ORDER BY id"
    ).fetchall()
    expected = [("Стражник",), ("Контрабандист",), ("Бандит",)]
    if humanoids != expected:
        raise AssertionError((humanoids, expected))
    missing = db.execute("""
        SELECT c.name FROM creatures c
        LEFT JOIN factions f ON f.id = c.faction_id
        WHERE c.kind = 'humanoid' AND f.id IS NULL ORDER BY c.id
    """).fetchall()
    if missing != [("Бандит",)]:
        raise AssertionError(missing)
    linked = db.execute("""
        SELECT c.name FROM creatures c
        INNER JOIN factions f ON f.id = c.faction_id ORDER BY c.id
    """).fetchall()
    if linked != [("Стражник",), ("Контрабандист",)]:
        raise AssertionError(linked)
    print("G1: three SQL expectations passed (synthetic data only).")
