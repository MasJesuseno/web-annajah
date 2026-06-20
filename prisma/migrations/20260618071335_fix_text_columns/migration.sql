-- AlterTable
-- AlterTable
ALTER TABLE `Alumni` MODIFY `testimonial` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Contact` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Page` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` TEXT NOT NULL,
    MODIFY `excerpt` TEXT NULL;

-- AlterTable
ALTER TABLE `Setting` MODIFY `value` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `SiteProfile` MODIFY `description` TEXT NULL,
    MODIFY `vision` TEXT NULL,
    MODIFY `mission` TEXT NULL,
    MODIFY `about` TEXT NULL,
    MODIFY `history` TEXT NULL;
