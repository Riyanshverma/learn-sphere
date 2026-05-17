import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { CreateAdminResponse, AllClassesDetailsResponse, MyAttendanceResponse, AllSchoolTeachersResponse } from "@/types"

type adminState = {
  admin: CreateAdminResponse | null
  allClassesDetails: AllClassesDetailsResponse[] | null
  myAttendance: MyAttendanceResponse[] | null
  allSchoolTeachers: AllSchoolTeachersResponse[] | null
}

type adminActions = {
  setAdmin: (admin: CreateAdminResponse) => void
  updateLeavesTaken: (days: number) => void
  setAllClassesDetails: (allClassesDetails: AllClassesDetailsResponse[]) => void
  setMyAttendance: (myAttendance: MyAttendanceResponse[]) => void
  setAllSchoolTeachers: (teachers: AllSchoolTeachersResponse[] | null) => void
  reset: () => void
}

const adminStore = (set: any): adminState & adminActions => ({
  admin: null,
  allClassesDetails: null,
  myAttendance: null,
  allSchoolTeachers: null,

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
  setMyAttendance: (myAttendance) => set({ myAttendance }),
  setAllSchoolTeachers: (allSchoolTeachers) => set({ allSchoolTeachers }),

  reset: () => set({ admin: null, allClassesDetails: null, myAttendance: null, allSchoolTeachers: null }),
})

export const useAdminStore = create<adminState & adminActions>()(devtools(persist(adminStore, { name: "adminStore" })))