import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function createGame(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== 'POST') {
        try {
            const { joinCode, numPlayers, numRounds, playerName } = await request.body
            const newGame = await prisma.game.create({
                data: {
                    join_code: joinCode,
                    num_players: numPlayers,
                    num_rounds: numRounds,
                    current_round: 0,
                    status: 'WAITING',
                }
            })

            const player = await prisma.player.create({
                data: {
                  game_id: newGame.game_id,
                  player_name: playerName,
                  score: 0,
                  is_host: true,
                  status: 'WAITING',
                },
              })

              return NextResponse.json({ newGame, player })
        } catch (error) {
            console.error('Error creating game:', error)
            return NextResponse.json(
              { error: 'Failed to create game' },
              { status: 500 }
            )
          }
    }
}