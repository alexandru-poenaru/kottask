-- DropForeignKey
ALTER TABLE `agendablokken` DROP FOREIGN KEY `fk_agendablok_taak`;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_taak` FOREIGN KEY (`taakId`) REFERENCES `taken`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
