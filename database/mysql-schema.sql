-- WiiZ website MySQL schema
-- Safe to re-run without deleting existing data.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS industry_hierarchy (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id INT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM('industry', 'function', 'usecase') NOT NULL,
  description TEXT NULL,
  slug VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_industry_hierarchy_slug (slug),
  KEY idx_industry_hierarchy_parent_id (parent_id),
  KEY idx_industry_hierarchy_type (type),
  KEY idx_industry_hierarchy_active (is_active),
  CONSTRAINT fk_industry_hierarchy_parent
    FOREIGN KEY (parent_id) REFERENCES industry_hierarchy(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS use_case_details (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hierarchy_id INT UNSIGNED NOT NULL,
  type ENUM('Impact', 'Outcome', 'Artifacts', 'Challenges') NOT NULL,
  description LONGTEXT NOT NULL,
  file_path VARCHAR(1024) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_use_case_details_hierarchy_id (hierarchy_id),
  KEY idx_use_case_details_type (type),
  KEY idx_use_case_details_active (is_active),
  CONSTRAINT fk_use_case_details_hierarchy
    FOREIGN KEY (hierarchy_id) REFERENCES industry_hierarchy(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plans (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  plan_code VARCHAR(120) NOT NULL,
  short_description TEXT NULL,
  highlighted_features LONGTEXT NULL,
  features LONGTEXT NULL,
  hide TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_plans_plan_code (plan_code),
  KEY idx_plans_hide (hide),
  KEY idx_plans_is_active (is_active),
  KEY idx_plans_created_by (created_by),
  KEY idx_plans_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hero_section (
  id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_hero_section_created_by (created_by),
  KEY idx_hero_section_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_features (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  label VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  features JSON NOT NULL,
  media_type ENUM('image', 'video') NULL,
  media_url VARCHAR(1024) NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_home_features_label (label),
  KEY idx_home_features_display_order (display_order),
  KEY idx_home_features_is_active (is_active),
  KEY idx_home_features_media_type (media_type),
  KEY idx_home_features_created_by (created_by),
  KEY idx_home_features_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_use_case_cards (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  use_case_id INT UNSIGNED NOT NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_home_use_case_cards_use_case_id (use_case_id),
  KEY idx_home_use_case_cards_display_order (display_order),
  KEY idx_home_use_case_cards_is_active (is_active),
  KEY idx_home_use_case_cards_created_by (created_by),
  KEY idx_home_use_case_cards_updated_by (updated_by),
  CONSTRAINT fk_home_use_case_cards_use_case
    FOREIGN KEY (use_case_id) REFERENCES industry_hierarchy(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  short_description TEXT NULL,
  content LONGTEXT NOT NULL,
  filepath VARCHAR(500) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_blog_posts_slug (slug),
  KEY idx_blog_posts_status (status),
  KEY idx_blog_posts_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cookie_consent_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  anonymous_id VARCHAR(120) NOT NULL,
  decision ENUM('accepted', 'essential') NOT NULL,
  consent_version VARCHAR(32) NOT NULL,
  accepted_at TIMESTAMP NOT NULL,
  page_path VARCHAR(255) NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(512) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cookie_consent_events_anonymous_id (anonymous_id),
  KEY idx_cookie_consent_events_decision (decision),
  KEY idx_cookie_consent_events_accepted_at (accepted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes
-- 1. This file is additive. It does not drop existing tables.
-- 2. Re-running it preserves existing rows and only adds missing tables/columns.
-- 3. hero_section.data stores JSON with salesBarText, image, heroHeading,
--    highlightedHeading, shortDescription, buttonText, buttonText2, and filepath.
-- 4. Uploaded media files should be stored in backend/hero and backend/impact,
--    while hero_section.data.filepath and use_case_details.file_path store
--    only the relative file path.
-- 5. blog_posts is intentionally simple and keeps only the basic blog fields
--    plus audit columns and a nullable filepath.
-- 6. home_features.features stores a JSON array of strings for the homepage
--    "WiiZ Built AI Agents" section, while media_type/media_url allow either
--    one image or one video per row.
-- 7. home_use_case_cards maps homepage card slots to existing use cases and
--    uses display_order to control the frontend sequence.
-- 8. cookie_consent_events stores versioned website cookie consent decisions
--    for compliance capture and auditing.
