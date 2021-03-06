DROP TABLE IF EXISTS `game_sessions`;
CREATE TABLE `game_sessions` (
  id VARCHAR(128) NOT NULL,
  name VARCHAR(64) NOT NULL,
  player_name VARCHAR(32) NOT NULL,
  date_created DATETIME NOT NULL,
  speed_score TINYINT(1) UNSIGNED NOT NULL,
  accuracy_score TINYINT(1) UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `measurements`;
CREATE TABLE `measurements` (
  id VARCHAR(128) NOT NULL,
  time INT UNSIGNED NOT NULL,
  type VARCHAR(16) NOT NULL,
  value INT UNSIGNED NOT NULL,
  score TINYINT(1) UNSIGNED NOT NULL,
  game_session_id VARCHAR(128) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
