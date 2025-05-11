PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`application_id` integer NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`completed` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reminders`("id", "user_id", "application_id", "date", "description", "completed", "created_at") SELECT "id", "user_id", "application_id", "date", "description", "completed", "created_at" FROM `reminders`;--> statement-breakpoint
DROP TABLE `reminders`;--> statement-breakpoint
ALTER TABLE `__new_reminders` RENAME TO `reminders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;