import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  ensLabel?: string
}

interface AppState {
  // User data
  currentUser: User
  viewMode: "creditor" | "debtor"

  // Settings
  theme: "system" | "light" | "dark"
  currency: string
  language: string
  notifications: {
    sms: boolean
    whatsapp: boolean
    email: boolean
  }

  // Actions
  setViewMode: (mode: "creditor" | "debtor") => void
  updateUser: (updates: Partial<User>) => void
  updateSettings: (settings: Partial<Pick<AppState, "theme" | "currency" | "language" | "notifications">>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "/diverse-user-avatars.png",
        ensLabel: "manolo.confiado.eth",
      },
      viewMode: "creditor",
      theme: "system",
      currency: "USD",
      language: "English",
      notifications: {
        sms: true,
        whatsapp: false,
        email: true,
      },

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      updateUser: (updates) => {
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        }))
      },

      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }))
      },
    }),
    {
      name: "confiado-storage",
    },
  ),
)
