/*
  Warnings:

  - The values [SINGLE,SUITE,STUDIO] on the enum `Room_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `room` MODIFY `type` ENUM('DOUBLE', 'DELUXE', 'EXECUTIVE_SUITE', 'EXECUTIVE_SUITE_DUPLEX') NOT NULL;
