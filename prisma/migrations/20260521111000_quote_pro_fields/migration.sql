-- Quote PRO fields: manual recipients, obra details, commercial conditions and richer items.

ALTER TABLE "quotes" DROP CONSTRAINT IF EXISTS "quotes_clientId_fkey";
ALTER TABLE "quotes" ALTER COLUMN "clientId" DROP NOT NULL;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientName" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientCompany" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientContactName" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientPhone" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientEmail" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientTaxId" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientAddress" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientCity" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientProvince" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "recipientAdminAddress" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "workObject" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "workLocation" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "includedTasks" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "excludedTasks" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "technicalNotes" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "paymentTerms" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "executionTime" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "warranty" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "commercialConditions" TEXT;

ALTER TABLE "quote_items" ADD COLUMN IF NOT EXISTS "unit" TEXT DEFAULT 'unidad';
ALTER TABLE "quote_items" ADD COLUMN IF NOT EXISTS "note" TEXT;