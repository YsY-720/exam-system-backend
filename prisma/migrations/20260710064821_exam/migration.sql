/*
  Warnings:

  - You are about to drop the column `isPublis` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `isPublis`,
    ADD COLUMN `isPublish` BOOLEAN NOT NULL DEFAULT false;
