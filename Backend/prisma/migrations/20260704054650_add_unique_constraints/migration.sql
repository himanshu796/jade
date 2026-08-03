/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `DiningGallery` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DiningGallery_title_key` ON `DiningGallery`(`title`);
