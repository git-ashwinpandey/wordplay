'use client'

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import cryptoRandomString from 'crypto-random-string';

type LobbyProps = {
    playerName: string,
    isHost: boolean
}

const page = ({ playerName } : LobbyProps) => {
    const [joinCode, setJoinCode] = useState<string>('');
    const [gameSettings, setGameSettings] = useState({
        numRounds: 3,
        minPlayers: 2,
        maxPlayers: 8
    })

    const [players, setPlayers] = useState([])

    useEffect(() => {
        const createGame = async () => {
            const newJoinCode = cryptoRandomString({ length: 10, type: 'url-safe' })
            setJoinCode(newJoinCode)

            const response = await fetch('/api/create-game', {
                method: 'POST',
                headers: {
                    'CONTENT-TYPE': 'application/json'
                },
                body: JSON.stringify({
                    joinCode: newJoinCode,
                    numPlayers: players.length,
                    numRounds: gameSettings.numRounds,
                    playerName: playerName
                })
            })

            if (!response.ok) {
                console.error('Failed to create game')
            }
        }

    }, []);

    return (
        <div className='min-h-screen pt-[10vh]'>
            <div className='flex flex-col gap-4 items-center justify-between w-full max-w-4xl mx-auto px-4'>
                {/* HEAD */}
                <div className="text-center w-full">
                    <h1 className="text-3xl font-bold mb-2">Waiting Room</h1>
                </div>


                {/* BODY */}
                <div className='flex flex-row gap-2'>
                    <div className='w-full'>Join Code: </div>
                    <p onClick={() => console.log('clicked')}>{joinCode}</p>
                </div>

            </div>
        </div>
    )
}

export default page