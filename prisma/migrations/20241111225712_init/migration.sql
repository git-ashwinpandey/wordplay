-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('WAITING', 'READY', 'PLAYING', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "Game" (
    "game_id" SERIAL NOT NULL,
    "join_code" TEXT NOT NULL,
    "num_players" INTEGER NOT NULL DEFAULT 8,
    "min_players" INTEGER NOT NULL DEFAULT 2,
    "num_rounds" INTEGER NOT NULL,
    "current_round" INTEGER NOT NULL DEFAULT 0,
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winner_id" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Round" (
    "round_id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL,
    "letter" CHAR(1) NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "Round_pkey" PRIMARY KEY ("round_id")
);

-- CreateTable
CREATE TABLE "Player" (
    "player_id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "is_host" BOOLEAN NOT NULL DEFAULT false,
    "status" "PlayerStatus" NOT NULL DEFAULT 'WAITING',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "Response" (
    "response_id" SERIAL NOT NULL,
    "round_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "animal" TEXT NOT NULL,
    "thing" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "Response_pkey" PRIMARY KEY ("response_id")
);

-- CreateTable
CREATE TABLE "Score" (
    "score_id" SERIAL NOT NULL,
    "round_id" INTEGER NOT NULL,
    "grader_id" INTEGER NOT NULL,
    "graded_player_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("score_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_join_code_key" ON "Game"("join_code");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "Game"("status");

-- CreateIndex
CREATE INDEX "Game_last_activity_idx" ON "Game"("last_activity");

-- CreateIndex
CREATE INDEX "Game_winner_id_idx" ON "Game"("winner_id");

-- CreateIndex
CREATE INDEX "Round_game_id_idx" ON "Round"("game_id");

-- CreateIndex
CREATE INDEX "Round_status_idx" ON "Round"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Round_game_id_round_number_key" ON "Round"("game_id", "round_number");

-- CreateIndex
CREATE INDEX "Player_game_id_idx" ON "Player"("game_id");

-- CreateIndex
CREATE INDEX "Player_status_idx" ON "Player"("status");

-- CreateIndex
CREATE INDEX "Player_last_active_idx" ON "Player"("last_active");

-- CreateIndex
CREATE UNIQUE INDEX "Player_game_id_player_name_key" ON "Player"("game_id", "player_name");

-- CreateIndex
CREATE INDEX "Response_round_id_idx" ON "Response"("round_id");

-- CreateIndex
CREATE INDEX "Response_player_id_idx" ON "Response"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Response_round_id_player_id_key" ON "Response"("round_id", "player_id");

-- CreateIndex
CREATE INDEX "Score_round_id_idx" ON "Score"("round_id");

-- CreateIndex
CREATE INDEX "Score_grader_id_idx" ON "Score"("grader_id");

-- CreateIndex
CREATE INDEX "Score_graded_player_id_idx" ON "Score"("graded_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Score_round_id_grader_id_graded_player_id_category_key" ON "Score"("round_id", "grader_id", "graded_player_id", "category");
