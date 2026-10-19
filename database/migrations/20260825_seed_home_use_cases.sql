-- Seed the three use cases displayed in the WiiZ homepage leaderboard.
-- Safe to re-run: hierarchy rows are keyed by slug and cards by use case.

SET NAMES utf8mb4;

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (NULL, 'Banking and Financial Services', 'industry', 'Enterprise AI agents for banking, financial services, compliance, and customer operations.', 'banking-financial-services', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

SET @banking_industry_id = (SELECT id FROM industry_hierarchy WHERE slug = 'banking-financial-services' LIMIT 1);

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (@banking_industry_id, 'Compliance and Customer Operations', 'function', 'AI-assisted compliance assessment and customer grievance operations.', 'banking-compliance-customer-operations', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id), title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

SET @banking_function_id = (SELECT id FROM industry_hierarchy WHERE slug = 'banking-compliance-customer-operations' LIMIT 1);

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (@banking_function_id, 'ComplyIQ: Compliance Gap Assessment and Remediator Agent', 'usecase', 'Maps regulatory clauses to internal documents, identifies compliance gaps, and recommends automated remediation.', 'complyiq-compliance-gap-assessment-remediator-agent', 1),
  (@banking_function_id, 'Customer Grievance Intel', 'usecase', 'Unifies complaint channels, identifies root causes, and drafts resolutions for approval.', 'customer-grievance-intel', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id), title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (NULL, 'Manufacturing', 'industry', 'Enterprise AI agents for production visibility, machine utilization, and operational improvement.', 'manufacturing', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

SET @manufacturing_industry_id = (SELECT id FROM industry_hierarchy WHERE slug = 'manufacturing' LIMIT 1);

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (@manufacturing_industry_id, 'Production Operations', 'function', 'AI-supported production monitoring and machine utilization analysis.', 'manufacturing-production-operations', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id), title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

SET @manufacturing_function_id = (SELECT id FROM industry_hierarchy WHERE slug = 'manufacturing-production-operations' LIMIT 1);

INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, is_active)
VALUES
  (@manufacturing_function_id, 'Production Output and Machine Util.', 'usecase', 'Provides real-time production output dashboards by machine and shift, with idle-time classification and variance reporting.', 'production-output-and-machine-utilization', 1)
ON DUPLICATE KEY UPDATE
  parent_id = VALUES(parent_id), title = VALUES(title), description = VALUES(description), type = VALUES(type), is_active = VALUES(is_active);

SET @complyiq_id = (SELECT id FROM industry_hierarchy WHERE slug = 'complyiq-compliance-gap-assessment-remediator-agent' LIMIT 1);
SET @grievance_id = (SELECT id FROM industry_hierarchy WHERE slug = 'customer-grievance-intel' LIMIT 1);
SET @production_id = (SELECT id FROM industry_hierarchy WHERE slug = 'production-output-and-machine-utilization' LIMIT 1);

UPDATE use_case_details d
JOIN industry_hierarchy u ON u.id = d.hierarchy_id
SET d.description = CASE
  WHEN u.slug = 'complyiq-compliance-gap-assessment-remediator-agent' AND d.type = 'Impact' THEN '100% improved in compliance automation.'
  WHEN u.slug = 'customer-grievance-intel' AND d.type = 'Impact' THEN 'Unified complaint intelligence with controlled draft resolution.'
  WHEN u.slug = 'production-output-and-machine-utilization' AND d.type = 'Impact' THEN 'Real-time production and machine utilization visibility.'
  ELSE d.description
END,
d.is_active = 1
WHERE u.slug IN ('complyiq-compliance-gap-assessment-remediator-agent', 'customer-grievance-intel', 'production-output-and-machine-utilization');

INSERT INTO use_case_details (hierarchy_id, type, description, file_path, is_active)
SELECT @complyiq_id, 'Impact', '100% improved in compliance automation.', 'impact/1.jpg', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @complyiq_id AND type = 'Impact');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @complyiq_id, 'Challenges', '<ul><li>Regulatory clauses and internal policies are difficult to compare at scale.</li><li>Compliance gaps require time-consuming manual review.</li><li>Remediation steps need traceability and approval.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @complyiq_id AND type = 'Challenges');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @complyiq_id, 'Outcome', '<ul><li>Faster clause-to-document mapping.</li><li>Clear compliance gap identification.</li><li>Recommended remediation with an auditable trail.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @complyiq_id AND type = 'Outcome');
INSERT INTO use_case_details (hierarchy_id, type, description, file_path, is_active)
SELECT @grievance_id, 'Impact', 'Unified complaint intelligence with controlled draft resolution.', 'impact/2.jpg', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @grievance_id AND type = 'Impact');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @grievance_id, 'Challenges', '<ul><li>Complaints arrive through fragmented channels.</li><li>Root-cause analysis is slow and inconsistent.</li><li>Resolution drafting requires repeated manual effort.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @grievance_id AND type = 'Challenges');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @grievance_id, 'Outcome', '<ul><li>Unified view of customer complaints.</li><li>Faster root-cause briefs for service teams.</li><li>Draft resolutions held for human approval.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @grievance_id AND type = 'Outcome');
INSERT INTO use_case_details (hierarchy_id, type, description, file_path, is_active)
SELECT @production_id, 'Impact', 'Real-time production and machine utilization visibility.', 'impact/3.jpg', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @production_id AND type = 'Impact');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @production_id, 'Challenges', '<ul><li>Production output is distributed across machines and shifts.</li><li>Idle time and variance are difficult to classify quickly.</li><li>Operational teams need timely visibility to act.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @production_id AND type = 'Challenges');
INSERT INTO use_case_details (hierarchy_id, type, description, is_active)
SELECT @production_id, 'Outcome', '<ul><li>Machine- and shift-level production dashboards.</li><li>Automated idle-time classification.</li><li>Actionable variance reporting for operations teams.</li></ul>', 1
WHERE NOT EXISTS (SELECT 1 FROM use_case_details WHERE hierarchy_id = @production_id AND type = 'Outcome');

INSERT INTO home_use_case_cards (use_case_id, display_order, is_active)
VALUES
  (@complyiq_id, 1, 1),
  (@grievance_id, 2, 1),
  (@production_id, 3, 1)
ON DUPLICATE KEY UPDATE
  display_order = VALUES(display_order), is_active = VALUES(is_active), updated_at = CURRENT_TIMESTAMP;
