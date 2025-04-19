-- DropForeignKey
ALTER TABLE `agendablokken` DROP FOREIGN KEY `fk_agendablok_gebruiker`;

-- DropForeignKey
ALTER TABLE `agendablokken` DROP FOREIGN KEY `fk_agendablok_taak`;

-- DropForeignKey
ALTER TABLE `taken` DROP FOREIGN KEY `fk_taak_gebruiker`;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_taak` FOREIGN KEY (`taakId`) REFERENCES `taken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_gebruiker` FOREIGN KEY (`gebruikerId`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taken` ADD CONSTRAINT `fk_taak_gebruiker` FOREIGN KEY (`gebruiker`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
