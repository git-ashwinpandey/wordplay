import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  playerName: string
  joinCode: string
  setPlayerName: (name: string) => void
  setJoinCode: (code: string) => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      joinCode: '',
      setPlayerName: (name) => set({ playerName: name }),
      setJoinCode: (code) => set({ joinCode: code }),
    }),
    {
      name: 'game-storage', // unique name for the storage key
      storage: createJSONStorage(() => localStorage), // use localStorage as the storage backend
    }
  )
)

export default useGameStore
