-- DropForeignKey
ALTER TABLE `taken` DROP FOREIGN KEY `fk_taak_gebruiker`;

-- AddForeignKey
ALTER TABLE `taken` ADD CONSTRAINT `fk_taak_gebruiker` FOREIGN KEY (`gebruiker`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
