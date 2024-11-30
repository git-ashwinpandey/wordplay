'use client'

import React, { useEffect, useState } from 'react'
import cryptoRandomString from 'crypto-random-string'
import useGameStore from '../../state/gameStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Users } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import router, { useRouter } from 'next/navigation'
import { set } from 'react-hook-form'

const page = () => {
	const [gameSettings, setGameSettings] = useState({
		numRounds: 3,
		minPlayers: 2,
		maxPlayers: 8,
	})

	interface Player {
	  id: string;
	  name: string;
	}
	
	const [players, setPlayers] = useState<Player[]>([])
	const { playerName, setPlayerName, joinCode, setPlayerID, playerID, setJoinCode } = useGameStore()
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState('')
	const [showCopiedAlert, setShowCopiedAlert] = useState(false)

    const router = useRouter()

	useEffect(() => {
		// Wait for Zustand to rehydrate the joinCode
		const rehydrateState = async () => {
            const storedData = localStorage.getItem('game-storage');
            if (storedData) {
                const state = JSON.parse(storedData).state || {};
                setJoinCode(state.joinCode || '');
                setPlayerID(state.playerID || -1);
                setPlayerName(state.playerName || '');
            }
            setIsLoaded(true);
        };
        if (!isLoaded) {
            rehydrateState();
        }
	}, [isLoaded])

	useEffect(() => {
		const createGame = async () => {
            try {
                const newJoinCode = cryptoRandomString({ length: 10, type: 'url-safe' });
                setJoinCode(newJoinCode);
    
                const response = await fetch('/api/games', {
                    method: 'POST',
                    headers: { 'CONTENT-TYPE': 'application/json' },
                    body: JSON.stringify({
                        joinCode: newJoinCode,
                        numPlayers: players.length,
                        numRounds: gameSettings.numRounds,
                        playerName: playerName,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to create game');
                }
    
                const { newGame, player } = await response.json();
                setPlayerID(player.player_id);
                console.log(newGame, player);
            } catch (err) {
                console.error('Error creating game:', err);
                setError('Failed to create game');
            }
        };
    
        if (isLoaded) {
            // Check initialization logic
            if (!playerName) {
                router.push('/create-game');
            } else if (!joinCode || playerID === -1) {
                createGame();
            }
        }
	}, [isLoaded, playerName, joinCode, playerID])

    useEffect(() => {
        // Initialize socket connection
        const socket = io('http://localhost:3000')
    
        // Set up socket event listeners
        socket.on('connect', () => {
          console.log('Connected to server')
        })
    
        socket.on('error', (message) => {
          setError(message)
        })
    
        socket.on('player-joined', ({ player }) => {
          setPlayers(prev => [...prev, player])
        })
    
        socket.on('lobby-disbanded', () => {
          router.push('/') // Navigate to home page
        })
    
        socket.on('game-started', ({ game, letter }) => {
          router.push(`/game/${game.game_id}`) // Navigate to game page
        })
    
        // Cleanup on unmount
        return () => {
          socket.disconnect()
        }
      }, [])

	const copyJoinCode = async () => {
		try {
			await navigator.clipboard.writeText(joinCode)
			setShowCopiedAlert(true)
			setTimeout(() => setShowCopiedAlert(false), 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
		}
	}

	return (
		<div className='min-h-screen pt-[10vh]'>
			<div className='flex flex-col gap-6 items-center justify-between w-full max-w-4xl mx-auto px-4'>
				{/* Error Alert */}
				{error && (
					<Alert
						variant='destructive'
						className='w-full'>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Header */}
				<div className='text-center w-full'>
					<h1 className='text-3xl font-bold mb-2'>Game Lobby</h1>
					<p className='text-gray-600'>
						Wait for players to join before starting
					</p>
				</div>

				{/* BODY */}
				<div className='flex flex-row gap-2'>
					<div className='w-full'>Join Code: </div>
					<p onClick={() => console.log('clicked')}>{joinCode}</p>
				</div>

				{/* JOIN CODE */}
				<Card className='w-full'>
					<CardHeader>
						<CardTitle className='text-xl'>Join Code</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex items-center gap-4'>
							<code className='bg-gray-100 px-4 py-2 rounded text-lg font-mono'>
								{joinCode}
							</code>
							<Button
								variant='outline'
								size='icon'
								onClick={copyJoinCode}
								title='Copy Join Code'>
								<Copy className='h-4 w-4' />
							</Button>
						</div>
					</CardContent>

					{showCopiedAlert && (
						<Alert className='mt-2'>
							<AlertDescription>
								Join code copied to clipboard!
							</AlertDescription>
						</Alert>
					)}
				</Card>
			</div>
		</div>
	)
}

export default page
