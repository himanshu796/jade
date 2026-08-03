/*
  Warnings:

  - A unique constraint covering the columns `[ownerName]` on the table `About` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `About_ownerName_key` ON `About`(`ownerName`);
