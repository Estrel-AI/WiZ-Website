-- Migration: Change display_order to unsigned int for page_sections

SET NAMES utf8mb4;

ALTER TABLE page_sections
  MODIFY COLUMN display_order INT UNSIGNED NOT NULL DEFAULT 1;
