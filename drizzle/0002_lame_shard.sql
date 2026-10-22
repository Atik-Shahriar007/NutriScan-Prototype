CREATE TABLE `productCatalog` (
	`id` varchar(64) NOT NULL,
	`barcode` varchar(32) NOT NULL,
	`category` enum('food','personalCare','household') NOT NULL,
	`nameEn` varchar(180) NOT NULL,
	`nameBn` varchar(180) NOT NULL,
	`brandEn` varchar(180) NOT NULL,
	`brandBn` varchar(180) NOT NULL,
	`recordJson` text NOT NULL,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productCatalog_id` PRIMARY KEY(`id`),
	CONSTRAINT `productCatalog_barcode_unique` UNIQUE(`barcode`)
);
--> statement-breakpoint
CREATE INDEX `product_catalog_barcode_idx` ON `productCatalog` (`barcode`);--> statement-breakpoint
CREATE INDEX `product_catalog_status_idx` ON `productCatalog` (`status`);