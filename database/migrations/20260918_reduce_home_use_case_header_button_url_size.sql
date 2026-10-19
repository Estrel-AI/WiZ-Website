-- Migration: Reduce the size of button_url column in home_use_case_header table from VARCHAR(1024) to VARCHAR(255)

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS home_use_case_header (
  id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  badge_text VARCHAR(20) NOT NULL,
  heading VARCHAR(120) NOT NULL,
  description VARCHAR(300) NOT NULL,
  button_text VARCHAR(30) NOT NULL,
  button_url VARCHAR(1024) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE home_use_case_header
  MODIFY COLUMN button_url VARCHAR(255) NOT NULL;


