-- Migration: Add background_image column to section_headers
-- Date: 2026-09-04
--
-- This column stores the URL or relative path of an optional background image
-- for each section header (e.g. Our Vision, Partner Banner, AI Agents Header).
-- The application code already handles NULL gracefully — when no image is set
-- the section falls back to its default gradient/texture background.

ALTER TABLE section_headers
  ADD COLUMN IF NOT EXISTS background_image VARCHAR(500) NULL
  AFTER button_url;

-- Verify the column was added (informational, does not affect execution)
-- SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
-- FROM information_schema.COLUMNS
-- WHERE TABLE_NAME = 'section_headers'
--   AND COLUMN_NAME = 'background_image';
