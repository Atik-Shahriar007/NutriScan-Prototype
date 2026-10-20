CREATE TABLE `contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contributorKey` varchar(80) NOT NULL,
	`displayName` varchar(80),
	`publicLeaderboard` int NOT NULL DEFAULT 0,
	`productName` varchar(180) NOT NULL,
	`brand` varchar(180),
	`barcode` varchar(32),
	`category` enum('food','personalCare','household') NOT NULL,
	`frontImageUrl` text NOT NULL,
	`backImageUrl` text NOT NULL,
	`status` enum('pending','accepted','rejected','needs-clearer-photo') NOT NULL DEFAULT 'pending',
	`reviewNote` text,
	`pointsAwarded` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`reviewedAt` timestamp,
	CONSTRAINT `contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `contributions_contributor_idx` ON `contributions` (`contributorKey`);--> statement-breakpoint
CREATE INDEX `contributions_leaderboard_idx` ON `contributions` (`status`,`publicLeaderboard`);