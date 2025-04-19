/*
  Warnings:

  - A unique constraint covering the columns `[emailadres]` on the table `gebruikers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wachtwoord` to the `gebruikers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agendablokken` MODIFY `titel` VARCHAR(255) NOT NULL,
    MODIFY `beschrijving` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `gebruikers` ADD COLUMN `wachtwoord` VARCHAR(255) NOT NULL,
    MODIFY `naam` VARCHAR(255) NOT NULL,
    MODIFY `voornaam` VARCHAR(255) NOT NULL,
    MODIFY `emailadres` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `taken` MODIFY `titel` VARCHAR(255) NOT NULL,
    MODIFY `beschrijving` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idx_user_email_unique` ON `gebruikers`(`emailadres`);
