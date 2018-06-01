DROP TABLE IF EXISTS list;

CREATE TABLE list (
  id integer PRIMARY KEY AUTOINCREMENT,
  item text NOT NULL CHECK(length(item) > 0) UNIQUE
);
