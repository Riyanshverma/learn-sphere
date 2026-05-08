import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { CreateAdminResponse, AllClassesDetailsResponse } from "@/types"

type adminState = {
  admin: CreateAdminResponse | null
  allClassesDetails: AllClassesDetailsResponse[] | null
}

type adminActions = {
  setAdmin: (admin: CreateAdminResponse) => void
  setAllClassesDetails: (allClassesDetails: AllClassesDetailsResponse[]) => void
  reset: () => void
}

const adminStore = (set: any): adminState & adminActions => ({
  admin: null,
  allClassesDetails: null,

  setAdmin: (admin) => set({ admin }),
  setAllClassesDetails: (allClassesDetails) => set({ allClassesDetails }),

  reset: () => set({ admin: null, allClassesDetails: null }),
})

export const useAdminStore = create<adminState & adminActions>()(devtools(persist(adminStore, { name: "adminStore" })))