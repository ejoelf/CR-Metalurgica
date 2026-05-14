-- CF Metal Pintura PRO - Initial database migration
-- Generated for PostgreSQL + Prisma

CREATE TYPE "ClientStatus" AS ENUM ('lead', 'active', 'inactive', 'archived');
CREATE TYPE "JobStatus" AS ENUM ('pending', 'quoted', 'approved', 'production', 'painted', 'delivered', 'cancelled');
CREATE TYPE "JobPriority" AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE "QuoteStatus" AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled');
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'transfer', 'card', 'mercado_pago', 'other');
CREATE TYPE "IncomeStatus" AS ENUM ('pending', 'paid', 'cancelled', 'refunded');
CREATE TYPE "AgendaType" AS ENUM ('visit', 'measurement', 'production', 'painting', 'delivery', 'payment', 'reminder', 'other');
CREATE TYPE "AgendaStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'postponed');
CREATE TYPE "NotificationType" AS ENUM ('info', 'success', 'warning', 'error', 'reminder');
CREATE TYPE "ContactMessageStatus" AS ENUM ('new', 'contacted', 'converted_to_client', 'dismissed');

CREATE TABLE "roles" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refresh_tokens" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "clients" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "address" TEXT,
  "city" TEXT,
  "notes" TEXT,
  "source" TEXT,
  "status" "ClientStatus" NOT NULL DEFAULT 'lead',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "jobs" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "serviceType" TEXT,
  "status" "JobStatus" NOT NULL DEFAULT 'pending',
  "priority" "JobPriority" NOT NULL DEFAULT 'normal',
  "estimatedStartDate" TIMESTAMP(3),
  "estimatedDeliveryDate" TIMESTAMP(3),
  "realStartDate" TIMESTAMP(3),
  "realDeliveryDate" TIMESTAMP(3),
  "estimatedPrice" DECIMAL(12,2),
  "finalPrice" DECIMAL(12,2),
  "internalNotes" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quotes" (
  "id" TEXT NOT NULL,
  "quoteNumber" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "jobId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "QuoteStatus" NOT NULL DEFAULT 'draft',
  "materialsCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "laborCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "paintCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "extraCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "profitMargin" DECIMAL(6,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "validUntil" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "pdfUrl" TEXT,
  "internalNotes" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_items" (
  "id" TEXT NOT NULL,
  "quoteId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
  "unitPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "incomes" (
  "id" TEXT NOT NULL,
  "clientId" TEXT,
  "jobId" TEXT,
  "quoteId" TEXT,
  "title" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'other',
  "status" "IncomeStatus" NOT NULL DEFAULT 'pending',
  "paidAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "expenses" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "paymentMethod" "PaymentMethod",
  "expenseDate" TIMESTAMP(3) NOT NULL,
  "supplier" TEXT,
  "jobId" TEXT,
  "notes" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agenda_events" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" "AgendaType" NOT NULL DEFAULT 'other',
  "status" "AgendaStatus" NOT NULL DEFAULT 'scheduled',
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3),
  "clientId" TEXT,
  "jobId" TEXT,
  "assignedToId" TEXT,
  "reminderAt" TIMESTAMP(3),
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "agenda_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "gallery_items" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "mainImageUrl" TEXT NOT NULL,
  "beforeImageUrl" TEXT,
  "afterImageUrl" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contact_messages" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "message" TEXT NOT NULL,
  "serviceInterest" TEXT,
  "status" "ContactMessageStatus" NOT NULL DEFAULT 'new',
  "clientId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL DEFAULT 'info',
  "entityType" TEXT,
  "entityId" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "business_settings" (
  "id" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "publicName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "logoUrl" TEXT,
  "instagramUrl" TEXT,
  "facebookUrl" TEXT,
  "googleMapsUrl" TEXT,
  "openingHours" JSONB,
  "quoteDefaultValidityDays" INTEGER NOT NULL DEFAULT 15,
  "defaultProfitMargin" DECIMAL(6,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "files" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "filename" TEXT,
  "mimeType" TEXT,
  "size" INTEGER,
  "entityType" TEXT,
  "entityId" TEXT,
  "jobId" TEXT,
  "quoteId" TEXT,
  "uploadedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "oldValue" JSONB,
  "newValue" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pdf_documents" (
  "id" TEXT NOT NULL,
  "quoteId" TEXT,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "publicUrl" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pdf_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "message_logs" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT,
  "destination" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "message_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ai_suggestions" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "input" JSONB NOT NULL,
  "output" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
CREATE UNIQUE INDEX "quotes_quoteNumber_key" ON "quotes"("quoteNumber");
CREATE UNIQUE INDEX "gallery_items_slug_key" ON "gallery_items"("slug");
CREATE UNIQUE INDEX "pdf_documents_token_key" ON "pdf_documents"("token");

CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");
CREATE INDEX "clients_fullName_idx" ON "clients"("fullName");
CREATE INDEX "clients_phone_idx" ON "clients"("phone");
CREATE INDEX "clients_status_idx" ON "clients"("status");
CREATE INDEX "jobs_clientId_idx" ON "jobs"("clientId");
CREATE INDEX "jobs_status_idx" ON "jobs"("status");
CREATE INDEX "jobs_createdById_idx" ON "jobs"("createdById");
CREATE INDEX "quotes_clientId_idx" ON "quotes"("clientId");
CREATE INDEX "quotes_jobId_idx" ON "quotes"("jobId");
CREATE INDEX "quotes_status_idx" ON "quotes"("status");
CREATE INDEX "quote_items_quoteId_idx" ON "quote_items"("quoteId");
CREATE INDEX "incomes_clientId_idx" ON "incomes"("clientId");
CREATE INDEX "incomes_jobId_idx" ON "incomes"("jobId");
CREATE INDEX "incomes_quoteId_idx" ON "incomes"("quoteId");
CREATE INDEX "incomes_status_idx" ON "incomes"("status");
CREATE INDEX "expenses_category_idx" ON "expenses"("category");
CREATE INDEX "expenses_expenseDate_idx" ON "expenses"("expenseDate");
CREATE INDEX "expenses_jobId_idx" ON "expenses"("jobId");
CREATE INDEX "agenda_events_startAt_idx" ON "agenda_events"("startAt");
CREATE INDEX "agenda_events_status_idx" ON "agenda_events"("status");
CREATE INDEX "agenda_events_clientId_idx" ON "agenda_events"("clientId");
CREATE INDEX "agenda_events_jobId_idx" ON "agenda_events"("jobId");
CREATE INDEX "gallery_items_category_idx" ON "gallery_items"("category");
CREATE INDEX "gallery_items_isPublished_idx" ON "gallery_items"("isPublished");
CREATE INDEX "gallery_items_isFeatured_idx" ON "gallery_items"("isFeatured");
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");
CREATE INDEX "contact_messages_phone_idx" ON "contact_messages"("phone");
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");
CREATE INDEX "notifications_entityType_entityId_idx" ON "notifications"("entityType", "entityId");
CREATE INDEX "files_entityType_entityId_idx" ON "files"("entityType", "entityId");
CREATE INDEX "files_jobId_idx" ON "files"("jobId");
CREATE INDEX "files_quoteId_idx" ON "files"("quoteId");
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");
CREATE INDEX "pdf_documents_quoteId_idx" ON "pdf_documents"("quoteId");
CREATE INDEX "message_logs_type_idx" ON "message_logs"("type");
CREATE INDEX "message_logs_status_idx" ON "message_logs"("status");
CREATE INDEX "ai_suggestions_type_idx" ON "ai_suggestions"("type");

ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "agenda_events" ADD CONSTRAINT "agenda_events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "agenda_events" ADD CONSTRAINT "agenda_events_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "agenda_events" ADD CONSTRAINT "agenda_events_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "agenda_events" ADD CONSTRAINT "agenda_events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "files" ADD CONSTRAINT "files_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "files" ADD CONSTRAINT "files_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "files" ADD CONSTRAINT "files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pdf_documents" ADD CONSTRAINT "pdf_documents_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
