import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { CreateAdminResponse } from "@/types"

type adminState = {
  admin: CreateAdminResponse | null
}

type adminActions = {
  setAdmin: (admin: CreateAdminResponse) => void
  reset: () => void
}

const adminStore = (set: any): adminState & adminActions => ({
  admin: null,
  
  setAdmin: (admin) => set({ admin }),

  reset: () => set({ admin: null }),
})

export const useAdminStore = create<adminState & adminActions>()(devtools(persist(adminStore, { name: "adminStore" })))