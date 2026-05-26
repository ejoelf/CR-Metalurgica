-- Align production database with the current Prisma schema.
-- This migration is intentionally additive and safe to run after the existing production migrations.

-- Business settings fields used by branding, legal and PDF modules.
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "legalName" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "taxId" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "defaultTaxRate" DECIMAL(6,2) NOT NULL DEFAULT 21;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "defaultMargin" DECIMAL(6,2) NOT NULL DEFAULT 15;
ALTER TABLE "business_settings" ADD COLUMN IF NOT EXISTS "quoteValidityDays" INTEGER NOT NULL DEFAULT 15;

-- Client fields used by CRM forms and quote recipient helpers.
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "taxId" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "clientType" TEXT DEFAULT 'particular';

-- Job lifecycle fields used by dashboard, finance and agenda synchronization.
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "acceptedAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "budgetedAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);

-- Finance model fields.
ALTER TABLE "incomes" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "supplierName" TEXT;
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "clientId" TEXT;
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "quoteId" TEXT;
ALTER TABLE "expenses" ALTER COLUMN "category" DROP NOT NULL;

-- Agenda fields used for quote/job reminders.
ALTER TABLE "agenda_events" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "agenda_events" ADD COLUMN IF NOT EXISTS "quoteId" TEXT;

-- File model fields used by upload module.
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "sizeBytes" INTEGER;
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "clientId" TEXT;

UPDATE "files" SET "fileName" = COALESCE("fileName", "filename") WHERE "fileName" IS NULL;
UPDATE "files" SET "fileUrl" = COALESCE("fileUrl", "url") WHERE "fileUrl" IS NULL;
UPDATE "files" SET "sizeBytes" = COALESCE("sizeBytes", "size") WHERE "sizeBytes" IS NULL;

ALTER TABLE "files" ALTER COLUMN "fileName" SET NOT NULL;
ALTER TABLE "files" ALTER COLUMN "fileUrl" SET NOT NULL;

-- PDF document fields used by current PDF service.
ALTER TABLE "pdf_documents" ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;
ALTER TABLE "pdf_documents" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
UPDATE "pdf_documents" SET "fileUrl" = COALESCE("fileUrl", "publicUrl") WHERE "fileUrl" IS NULL;
ALTER TABLE "pdf_documents" ALTER COLUMN "fileUrl" SET NOT NULL;

-- Helpful indexes for newly added relation fields.
CREATE INDEX IF NOT EXISTS "expenses_clientId_idx" ON "expenses"("clientId");
CREATE INDEX IF NOT EXISTS "expenses_quoteId_idx" ON "expenses"("quoteId");
CREATE INDEX IF NOT EXISTS "agenda_events_quoteId_idx" ON "agenda_events"("quoteId");
CREATE INDEX IF NOT EXISTS "files_clientId_idx" ON "files"("clientId");

-- Relation constraints added defensively after columns exist.
ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "expenses_clientId_fkey";
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "expenses_quoteId_fkey";
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "agenda_events" DROP CONSTRAINT IF EXISTS "agenda_events_quoteId_fkey";
ALTER TABLE "agenda_events" ADD CONSTRAINT "agenda_events_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "files" DROP CONSTRAINT IF EXISTS "files_clientId_fkey";
ALTER TABLE "files" ADD CONSTRAINT "files_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
