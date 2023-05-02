-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followersCount" INTEGER DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER DEFAULT 0;
