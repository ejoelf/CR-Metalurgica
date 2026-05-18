ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "publicName" TEXT DEFAULT 'CF Metal Pintura';
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "defaultProfitMargin" DECIMAL DEFAULT 15;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "quoteDefaultValidityDays" INTEGER DEFAULT 15;
