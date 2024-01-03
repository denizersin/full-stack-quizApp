-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_id_email_idx`(`id`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('FILL_IN_THE_BLANK', 'MULTIPLE_CHOICE') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `successRate` DOUBLE NOT NULL DEFAULT 0,
    `takenCount` INTEGER NOT NULL DEFAULT 0,
    `questionCount` INTEGER NOT NULL,

    INDEX `Quiz_userId_title_type_idx`(`userId`, `title`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FillInTheBlankQuiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quizId` INTEGER NOT NULL,

    UNIQUE INDEX `FillInTheBlankQuiz_quizId_key`(`quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MultipleChoiceQuiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quizId` INTEGER NOT NULL,

    UNIQUE INDEX `MultipleChoiceQuiz_quizId_key`(`quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FillInTheBlankQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `answer` VARCHAR(191) NOT NULL,
    `fillOptionId` INTEGER NOT NULL,

    UNIQUE INDEX `FillInTheBlankQuestion_fillOptionId_key`(`fillOptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MultipleChoiceQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `multipleChoiceQuizId` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,

    INDEX `MultipleChoiceQuestion_multipleChoiceQuizId_idx`(`multipleChoiceQuizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MultiOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `multipleChoiceQuestionId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `opt_index` INTEGER NOT NULL,
    `isCorrect` BOOLEAN NOT NULL DEFAULT false,

    INDEX `MultiOption_multipleChoiceQuestionId_idx`(`multipleChoiceQuestionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FillOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `fillOptionId` INTEGER NOT NULL,

    INDEX `FillOption_fillOptionId_idx`(`fillOptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QuizSet_userId_title_idx`(`userId`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_QuizToQuizSet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_QuizToQuizSet_AB_unique`(`A`, `B`),
    INDEX `_QuizToQuizSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FillInTheBlankQuiz` ADD CONSTRAINT `FillInTheBlankQuiz_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MultipleChoiceQuiz` ADD CONSTRAINT `MultipleChoiceQuiz_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FillInTheBlankQuestion` ADD CONSTRAINT `FillInTheBlankQuestion_id_fkey` FOREIGN KEY (`id`) REFERENCES `FillInTheBlankQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FillInTheBlankQuestion` ADD CONSTRAINT `FillInTheBlankQuestion_fillOptionId_fkey` FOREIGN KEY (`fillOptionId`) REFERENCES `FillOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MultipleChoiceQuestion` ADD CONSTRAINT `MultipleChoiceQuestion_multipleChoiceQuizId_fkey` FOREIGN KEY (`multipleChoiceQuizId`) REFERENCES `MultipleChoiceQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MultiOption` ADD CONSTRAINT `MultiOption_multipleChoiceQuestionId_fkey` FOREIGN KEY (`multipleChoiceQuestionId`) REFERENCES `MultipleChoiceQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizSet` ADD CONSTRAINT `QuizSet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuizToQuizSet` ADD CONSTRAINT `_QuizToQuizSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuizToQuizSet` ADD CONSTRAINT `_QuizToQuizSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `QuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
