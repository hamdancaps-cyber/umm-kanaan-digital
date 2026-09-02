CREATE TABLE `purchase_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`providerOrderId` varchar(180) NOT NULL,
	`productTitle` varchar(255) NOT NULL,
	`productHandle` varchar(180) NOT NULL,
	`amount` varchar(32) NOT NULL,
	`currencyCode` varchar(12) NOT NULL,
	`accessStatus` enum('pending','granted','revoked') NOT NULL DEFAULT 'pending',
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchase_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchase_records_providerOrderId_unique` UNIQUE(`providerOrderId`)
);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entityType` enum('path','course','product','article','resource') NOT NULL,
	`entityKey` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `purchase_records` ADD CONSTRAINT `purchase_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;