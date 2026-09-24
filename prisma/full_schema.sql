USE CALUNG;
DROP TABLE IF EXISTS `consignment_items`;
DROP TABLE IF EXISTS `consignments`;
DROP TABLE IF EXISTS `pharmacies`;
DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pharmacies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `picName` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `consignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pharmacyId` INT NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `paid` INT NOT NULL DEFAULT 0,
  `paidAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `lastVisitDate` VARCHAR(50) NULL,
  `paymentMethod` VARCHAR(100) NULL,
  `paymentNotes` TEXT NULL,
  `visitNotes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_consignment_pharmacy` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `consignment_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `consignmentId` INT NOT NULL,
  `productId` INT NOT NULL,
  `qty` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `remainingQty` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_item_consignment` FOREIGN KEY (`consignmentId`) REFERENCES `consignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
