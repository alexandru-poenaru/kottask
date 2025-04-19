/*
  Warnings:

  - You are about to drop the column `gebruikerId` on the `agendablokken` table. All the data in the column will be lost.
  - You are about to drop the column `taakId` on the `agendablokken` table. All the data in the column will be lost.
  - Added the required column `agendablokVan` to the `agendablokken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `agendablokken` DROP FOREIGN KEY `fk_agendablok_gebruiker`;

-- DropForeignKey
ALTER TABLE `agendablokken` DROP FOREIGN KEY `fk_agendablok_taak`;

-- AlterTable
ALTER TABLE `agendablokken` DROP COLUMN `gebruikerId`,
    DROP COLUMN `taakId`,
    ADD COLUMN `agendablokVan` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `taakInAgendablok` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_taak` FOREIGN KEY (`taakInAgendablok`) REFERENCES `taken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_gebruiker` FOREIGN KEY (`agendablokVan`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
