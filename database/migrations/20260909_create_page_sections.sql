-- Create page_sections table for admin-driven section ordering (e.g. About page editor)
-- Table is also auto-created at runtime by src/lib/admin-page-sections.ts, so this is optional.
-- Safe to re-run.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS page_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(50) NOT NULL,
  section_key VARCHAR(50) NOT NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_page_section (page_key, section_key),
  INDEX idx_page_section_order (page_key, display_order),
  INDEX idx_page_section_active (page_key, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the About page default section order (idempotent)
INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'ABOUT', 'VISION', 1, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'ABOUT' AND section_key = 'VISION');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'ABOUT', 'MISSIONS', 2, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'ABOUT' AND section_key = 'MISSIONS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'ABOUT', 'LEADERSHIP', 3, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'ABOUT' AND section_key = 'LEADERSHIP');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'ABOUT', 'PRODUCT', 4, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'ABOUT' AND section_key = 'PRODUCT');

-- Seed the Home page default section order (idempotent)
INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'HERO', 1, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'HERO');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'TRUSTED_BY', 2, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'TRUSTED_BY');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'FEATURES', 3, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'FEATURES');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'USE_CASES', 4, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'USE_CASES');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'AI_ADOPTION', 5, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'AI_ADOPTION');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'OPERATIONALIZE', 6, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'OPERATIONALIZE');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'TESTIMONIALS', 7, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'TESTIMONIALS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'FAQS', 8, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'FAQS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'HOME', 'CTA', 9, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'HOME' AND section_key = 'CTA');

-- Seed the Partner page default section order (idempotent)
INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PARTNER', 'BANNER', 1, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PARTNER' AND section_key = 'BANNER');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PARTNER', 'PATHWAY', 2, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PARTNER' AND section_key = 'PATHWAY');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PARTNER', 'BENEFITS', 3, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PARTNER' AND section_key = 'BENEFITS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PARTNER', 'FORM', 4, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PARTNER' AND section_key = 'FORM');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PARTNER', 'FIND_PARTNER', 5, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PARTNER' AND section_key = 'FIND_PARTNER');

-- Seed the Pricing page default section order (idempotent)
INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PRICING', 'PLANS', 1, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PRICING' AND section_key = 'PLANS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PRICING', 'ADDONS', 2, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PRICING' AND section_key = 'ADDONS');

INSERT INTO page_sections (page_key, section_key, display_order, is_active)
SELECT 'PRICING', 'CTA', 3, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM page_sections WHERE page_key = 'PRICING' AND section_key = 'CTA');