DROP TABLE `notes`;
--> statement-breakpoint
CREATE TABLE `notes` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`user_id` text NOT NULL,
  FOREIGN KEY(user_id) REFERENCES user(id) ON UPDATE no action ON DELETE no action
);
