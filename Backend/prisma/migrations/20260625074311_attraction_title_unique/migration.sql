/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Attraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attraction_title_key` ON `Attraction`(`title`);
