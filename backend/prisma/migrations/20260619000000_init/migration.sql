CREATE TABLE "Player" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayHistory" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "PlayHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RewardHistory" (
    "id" SERIAL NOT NULL,
    "checkpoint" INTEGER NOT NULL,
    "rewardName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "RewardHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RewardHistory_checkpoint_key" ON "RewardHistory"("checkpoint");
ALTER TABLE "PlayHistory" ADD CONSTRAINT "PlayHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardHistory" ADD CONSTRAINT "RewardHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
