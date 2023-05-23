-- CreateTable
CREATE TABLE "Game" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");
