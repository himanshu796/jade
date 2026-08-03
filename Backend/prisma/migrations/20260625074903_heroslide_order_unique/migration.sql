/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `HeroSlide` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `HeroSlide_order_key` ON `HeroSlide`(`order`);
