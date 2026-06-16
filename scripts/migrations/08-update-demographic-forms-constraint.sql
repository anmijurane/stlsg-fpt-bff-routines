-- Migration to update the CHECK constraint on demographic_forms
-- Only require contact info (email or phone) if membership is 'invite'

ALTER TABLE demographic_forms
  DROP CONSTRAINT IF EXISTS demographic_forms_contact_required;

-- Clean up any dummy 'no-information' values if they exist, resetting them to NULL
UPDATE demographic_forms
SET contact_email = NULL
WHERE contact_email = 'no-information';

UPDATE demographic_forms
SET contact_phone = NULL
WHERE contact_phone = 'no-information';

ALTER TABLE demographic_forms
  ADD CONSTRAINT demographic_forms_contact_required
    CHECK (
      membership != 'invite'
      OR (
        NULLIF(BTRIM(contact_email), '') IS NOT NULL
        OR NULLIF(BTRIM(contact_phone), '') IS NOT NULL
      )
    );
