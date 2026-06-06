-- CreateTable
CREATE TABLE `drivers` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `drivers_email_key`(`email`),
    INDEX `drivers_email_idx`(`email`),
    INDEX `drivers_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passengers` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `passengers_email_key`(`email`),
    INDEX `passengers_email_idx`(`email`),
    INDEX `passengers_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(36) NOT NULL,
    `car` ENUM('SWIFT', 'ETIOS', 'ERTIGA', 'INNOVA', 'TRAVELLER') NOT NULL,
    `dateTime` DATETIME(0) NOT NULL,
    `startLocation` VARCHAR(500) NOT NULL,
    `endLocation` VARCHAR(500) NOT NULL,
    `startLatitude` DECIMAL(10, 8) NULL,
    `startLongitude` DECIMAL(11, 8) NULL,
    `endLatitude` DECIMAL(10, 8) NULL,
    `endLongitude` DECIMAL(11, 8) NULL,
    `estimatedDistance` FLOAT NULL,
    `estimatedFare` DECIMAL(8, 2) NULL,
    `actualFare` DECIMAL(8, 2) NULL,
    `mobile` VARCHAR(15) NOT NULL,
    `passengerName` VARCHAR(100) NOT NULL,
    `specialRequests` TEXT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
    `acceptedAt` TIMESTAMP(0) NULL,
    `completedAt` TIMESTAMP(0) NULL,
    `cancelledAt` TIMESTAMP(0) NULL,
    `cancellationNote` TEXT NULL,
    `passengerId` VARCHAR(36) NOT NULL,
    `driverId` VARCHAR(36) NULL,

    INDEX `bookings_passengerId_idx`(`passengerId`),
    INDEX `bookings_driverId_idx`(`driverId`),
    INDEX `bookings_status_idx`(`status`),
    INDEX `bookings_dateTime_idx`(`dateTime`),
    INDEX `bookings_created_at_idx`(`created_at`),
    INDEX `bookings_status_dateTime_idx`(`status`, `dateTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_passengerId_fkey` FOREIGN KEY (`passengerId`) REFERENCES `passengers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;