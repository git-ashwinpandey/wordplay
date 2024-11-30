import { PrismaClient, GameStatus as PrismaGameStatus } from '@prisma/client'
import { NextResponse } from 'next/server';
import { Prisma } from "@prisma/client";

enum GameStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('POST /api/games -- creating new game')
  try {
    const { joinCode, numPlayers, numRounds, playerName } = await request.json()

    const newGame = await prisma.game.create({
      data: {
        join_code: joinCode,
        num_players: 8,
        min_players: 2,
        num_rounds: numRounds,
        current_round: 0,
        status: PrismaGameStatus.WAITING as PrismaGameStatus | undefined,
        created_at: new Date(),
        last_activity: new Date()
      },
    })

    console.log(newGame)

    const player = await prisma.player.create({
      data: {
        game_id: newGame.game_id,
        player_name: playerName,
        score: 0,
        is_host: true,
        status: 'WAITING',
        joined_at: new Date(),
        last_active: new Date(),
      },
    })

    console.log(player)
    return NextResponse.json({ newGame, player })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }

}

export async function GET(request: Request) {
  console.log('GET /api/games');
  try {
    const games = await prisma.game.findMany();

    if (!games) {
      console.error('No games found or database returned null');
      return NextResponse.json(
        { error: 'No games found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ games: games }, { status: 200 });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games', details: (error as any).message || error },
      { status: 500 }
    );
  }
}
