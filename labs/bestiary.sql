-- G1: synthetic GRUNTWORK data. Deliberate missing faction; no FK constraint.
CREATE TABLE factions (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE creatures (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  faction_id INTEGER
);
INSERT INTO factions VALUES (1, 'Городская стража'), (2, 'Контрабандисты');
INSERT INTO creatures VALUES
  (1, 'Стражник', 'humanoid', 1),
  (2, 'Контрабандист', 'humanoid', 2),
  (3, 'Крыса', 'beast', NULL),
  (4, 'Бандит', 'humanoid', 99);
