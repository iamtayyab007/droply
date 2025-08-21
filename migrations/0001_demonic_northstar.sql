ALTER TABLE "files" ALTER COLUMN "thumbnail_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "user_id" SET DATA TYPE text;