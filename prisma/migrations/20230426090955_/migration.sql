/*
  Warnings:

  - Added the required column `ratingcount` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "ratingcount" INTEGER NOT NULL;
