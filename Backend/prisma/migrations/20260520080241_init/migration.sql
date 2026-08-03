-- AlterTable
ALTER TABLE `booking` ADD COLUMN `totalPrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `maxGuests` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `mobile_number` VARCHAR(191) NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL;
