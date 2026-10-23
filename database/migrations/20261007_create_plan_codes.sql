-- Migration: Create plan_codes table for dynamic plan code management
-- This allows admin to manage plan codes from the admin panel without rebuilding the application

CREATE TABLE IF NOT EXISTS plan_codes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  plan_key VARCHAR(100) NOT NULL COMMENT 'Normalized key for frontend reference (e.g., STARTER_MONTHLY, BUSINESS_50K_ANNUAL)',
  plan_code VARCHAR(255) NOT NULL COMMENT 'Actual Zoho/Billing plan code (e.g., WIIZ_MONTHLY_STARTER_PLAN_V2_DEV)',
  description VARCHAR(500) NULL COMMENT 'Human-readable description for admin reference',
  is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Soft delete flag',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_plan_codes_plan_key (plan_key),
  KEY idx_plan_codes_is_active (is_active),
  KEY idx_plan_codes_plan_code (plan_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data based on Plan.xls and current production setup
-- These match the plan codes defined in src/config/public-env.ts

INSERT INTO plan_codes (plan_key, plan_code, description, is_active) VALUES
  -- Starter Plans
  ('STARTER_MONTHLY', 'WIIZ_MONTHLY_STARTER_PLAN_V2_DEV', 'Starter Plan - Monthly billing (5,000 credits)', 1),
  ('STARTER_ANNUAL', 'WIIZ_ANNUAL_STARTER_PLAN_V2_DEV', 'Starter Plan - Annual billing (5,000 credits)', 1),

  -- Business Entry Plans (50k credits)
  ('BUSINESS_ENTRY_MONTHLY', 'WIIZ_MONTHLY_BUSINESS_ENTRY_PLAN_V2_DEV', 'Business Entry - Monthly billing (50,000 credits)', 1),
  ('BUSINESS_ENTRY_ANNUAL', 'WIIZ_ANNUAL_BUSINESS_ENTRY_PLAN_V2_DEV', 'Business Entry - Annual billing (50,000 credits)', 1),

  -- Business Standard Plans (100k credits)
  ('BUSINESS_STANDARD_MONTHLY', 'WIIZ_MONTHLY_BUSINESS_STANDARD_PLAN_V2_DEV', 'Business Standard - Monthly billing (100,000 credits)', 1),
  ('BUSINESS_STANDARD_ANNUAL', 'WIIZ_ANNUAL_BUSINESS_STANDARD_PLAN_V2_DEV', 'Business Standard - Annual billing (100,000 credits)', 1),

  -- Enterprise Plan
  ('ENTERPRISE_ANNUAL', 'ENTERPRISE_ANNUAL_BUSINESS_PLAN_V2_DEV', 'Enterprise Plan - Annual (50,000 credits, custom pricing)', 1),

  -- Free Trial
  ('FREE_TRIAL', 'WIIZ_FREE_PLAN_V2_DEV', 'Free Trial Plan (300 credits, 5 days)', 1),

  -- Add-on Plans
  ('ADDON_1000', 'WIIZ_1000RUNS_ADDON_TEST', 'Add-on Pack - 1,000 extra runs', 1),
  ('ADDON_5000', 'WIIZ_5000RUNS_ADDON_TEST', 'Add-on Pack - 5,000 extra runs', 1),
  ('ADDON_10000', 'WIIZ_10000RUNS_ADDON_TEST', 'Add-on Pack - 10,000 extra runs', 1)
ON DUPLICATE KEY UPDATE
  plan_code = VALUES(plan_code),
  description = VALUES(description),
  updated_at = CURRENT_TIMESTAMP;