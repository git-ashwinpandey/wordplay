import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  playerName: string
  joinCode: string
  playerID: number
  setPlayerName: (name: string) => void
  setJoinCode: (code: string) => void
  setPlayerID: (id: number) => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      joinCode: '',
      playerID: -1,
      setPlayerName: (name) => set({ playerName: name }),
      setJoinCode: (code) => set({ joinCode: code }),
      setPlayerID: (id) => set({ playerID: id }),
    }),
    {
      name: 'game-storage', // unique name for the storage key
      storage: createJSONStorage(() => localStorage), // use localStorage as the storage backend
    }
  )
)

export default useGameStore
