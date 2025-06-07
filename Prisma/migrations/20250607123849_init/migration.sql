-- CreateTable
CREATE TABLE "campaigns" (
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
    CONSTRAINT "users_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canAdd" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "topics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "topics_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "replies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topicId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "replies_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "replies_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "replies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "replyViews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replyUpdatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" INTEGER NOT NULL,
    CONSTRAINT "replyViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "replyViews_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "replies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userFromId" TEXT NOT NULL,
    "userToId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "messages_userFromId_fkey" FOREIGN KEY ("userFromId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_userToId_fkey" FOREIGN KEY ("userToId") REFERENCES "users" ("nickname") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "replyViews_userId_replyId_replyUpdatedAt_key" ON "replyViews"("userId", "replyId", "replyUpdatedAt");
