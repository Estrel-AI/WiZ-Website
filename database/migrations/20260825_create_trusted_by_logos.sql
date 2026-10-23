-- Create the Trusted By logo module and seed the current homepage logos.
-- Safe to re-run: logo paths are unique.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS trusted_by_logos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  logo_image VARCHAR(1024) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_trusted_by_logos_logo_image (logo_image),
  KEY idx_trusted_by_logos_sort_order (sort_order),
  KEY idx_trusted_by_logos_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO trusted_by_logos (logo_image, sort_order, status)
VALUES
  ('/images/partner-logos/alpha_data.jpg', 1, 'active'),
  ('/images/partner-logos/aws.png', 2, 'active'),
  ('/images/partner-logos/google-cloud.png', 3, 'active'),
  ('/images/partner-logos/nangia.png', 4, 'active'),
  ('/images/partner-logos/nvidia.png', 5, 'active'),
  ('/images/partner-logos/raqmiyat.png', 6, 'active'),
  ('/images/partner-logos/sisl.png', 7, 'active'),
  ('/images/partner-logos/Harrier.png', 8, 'active')
ON DUPLICATE KEY UPDATE
  sort_order = VALUES(sort_order),
  status = VALUES(status),
  updated_at = CURRENT_TIMESTAMP;
