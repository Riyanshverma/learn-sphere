import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { CreateAdminResponse, AllClassesDetailsResponse } from "@/types"

type adminState = {
  admin: CreateAdminResponse | null
  allClassesDetails: AllClassesDetailsResponse[] | null
}

type adminActions = {
  setAdmin: (admin: CreateAdminResponse) => void
  updateLeavesTaken: (days: number) => void
  setAllClassesDetails: (allClassesDetails: AllClassesDetailsResponse[]) => void
  reset: () => void
}

const adminStore = (set: any): adminState & adminActions => ({
  admin: null,
  allClassesDetails: null,

  setAdmin: (admin) => set({ admin }),
  updateLeavesTaken: (days) => set((state: adminState) => {
    if (!state.admin) return state;
    return {
      admin: {
        ...state.admin,
        leaves: {
          ...state.admin.leaves,
          leaves_taken: state.admin.leaves.leaves_taken + days
        }
      }
    };
  }),
  setAllClassesDetails: (allClassesDetails) => set({ allClassesDetails }),

  reset: () => set({ admin: null, allClassesDetails: null }),
})

export const useAdminStore = create<adminState & adminActions>()(devtools(persist(adminStore, { name: "adminStore" })))