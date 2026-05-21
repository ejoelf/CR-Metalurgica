ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "signatureUrl" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "includeDigitalSignature" BOOLEAN NOT NULL DEFAULT false;