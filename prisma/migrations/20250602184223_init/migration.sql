-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "users" (
    "nickname" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pictureFileId" TEXT,
    "passwordHash" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "users_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canAdd" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Topic_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topicId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Reply_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Reply" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReplyView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replyUpdatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" INTEGER NOT NULL,
    CONSTRAINT "ReplyView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReplyView_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userFromId" TEXT NOT NULL,
    "userToId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "Message_userFromId_fkey" FOREIGN KEY ("userFromId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_userToId_fkey" FOREIGN KEY ("userToId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReplyView_userId_replyId_replyUpdatedAt_key" ON "ReplyView"("userId", "replyId", "replyUpdatedAt");
