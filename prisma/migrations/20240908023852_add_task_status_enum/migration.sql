-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('peding', 'onHold', 'inProgress', 'underReview', 'completed');

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'peding';
