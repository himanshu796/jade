/*
  Warnings:

  - You are about to drop the column `name` on the `attraction` table. All the data in the column will be lost.
  - Added the required column `title` to the `Attraction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attraction` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
