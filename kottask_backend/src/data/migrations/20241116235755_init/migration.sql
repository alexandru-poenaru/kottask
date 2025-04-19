-- CreateTable
CREATE TABLE `gebruikers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `voornaam` VARCHAR(191) NOT NULL,
    `emailadres` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agendablokken` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gebruikerId` INTEGER UNSIGNED NOT NULL,
    `titel` VARCHAR(191) NOT NULL,
    `beschrijving` VARCHAR(191) NOT NULL,
    `datumVan` DATETIME(0) NOT NULL,
    `datumTot` DATETIME(0) NOT NULL,
    `taakId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taken` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `titel` VARCHAR(191) NOT NULL,
    `beschrijving` VARCHAR(191) NOT NULL,
    `prioriteit` ENUM('NIET_DRINGEND', 'DRINGEND', 'HEEL_DRINGEND') NOT NULL,
    `afgewerkt` BOOLEAN NOT NULL DEFAULT false,
    `gebruiker` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_taakGemaaktVoor` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_taakGemaaktVoor_AB_unique`(`A`, `B`),
    INDEX `_taakGemaaktVoor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_taak` FOREIGN KEY (`taakId`) REFERENCES `taken`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agendablokken` ADD CONSTRAINT `fk_agendablok_gebruiker` FOREIGN KEY (`gebruikerId`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `taken` ADD CONSTRAINT `fk_taak_gebruiker` FOREIGN KEY (`gebruiker`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_taakGemaaktVoor` ADD CONSTRAINT `_taakGemaaktVoor_A_fkey` FOREIGN KEY (`A`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_taakGemaaktVoor` ADD CONSTRAINT `_taakGemaaktVoor_B_fkey` FOREIGN KEY (`B`) REFERENCES `taken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
