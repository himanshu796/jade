/*
  Warnings:

  - You are about to drop the column `area` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `maxGuests` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `room` table. All the data in the column will be lost.
  - Added the required column `roomTypeId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `room` DROP COLUMN `area`,
    DROP COLUMN `description`,
    DROP COLUMN `image`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `maxGuests`,
    DROP COLUMN `price`,
    DROP COLUMN `type`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `roomTypeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `RoomType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` ENUM('DOUBLE', 'DELUXE', 'EXECUTIVE_SUITE', 'EXECUTIVE_SUITE_DUPLEX') NOT NULL,
    `price` DOUBLE NOT NULL,
    `maxGuests` INTEGER NOT NULL DEFAULT 1,
    `image` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `area` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RoomType_category_key`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `RoomType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
