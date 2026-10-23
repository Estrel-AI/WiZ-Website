-- Add sort_order column to industry_hierarchy for drag-and-drop reordering
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS pattern via procedure

SET NAMES utf8mb4;

ALTER TABLE industry_hierarchy
  ADD COLUMN sort_order INT UNSIGNED NOT NULL DEFAULT 0
  AFTER slug;

CREATE INDEX idx_industry_hierarchy_sort_order ON industry_hierarchy (sort_order);

-- Initialize sort_order based on current id order within each parent group
UPDATE industry_hierarchy AS t
INNER JOIN (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY parent_id, type ORDER BY id) - 1 AS rn
  FROM industry_hierarchy
) AS ranked ON t.id = ranked.id
SET t.sort_order = ranked.rn;
