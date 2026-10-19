-- Create and seed the singleton Home Use Cases section header CMS record.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS home_use_case_header (
  id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  badge_text VARCHAR(20) NOT NULL,
  heading VARCHAR(120) NOT NULL,
  description VARCHAR(300) NOT NULL,
  button_text VARCHAR(30) NOT NULL,
  button_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO home_use_case_header
  (id, badge_text, heading, description, button_text, button_url)
VALUES
  (1, 'Use Cases', 'Leaderboard of WiiZ Built AI Agents', 'Examples of AI agents built on WiiZ for real enterprise workflows.', 'View All Agents', '/ai-agents')
ON DUPLICATE KEY UPDATE
  badge_text = VALUES(badge_text),
  heading = VALUES(heading),
  description = VALUES(description),
  button_text = VALUES(button_text),
  button_url = VALUES(button_url),
  updated_at = CURRENT_TIMESTAMP;
