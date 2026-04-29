import { useState } from "react"
import { AddSchoolStaffSubHeader, AddNewSchoolStaff, AddExistingUserStaff } from "@/features/admin"

export const AddSchoolStaff = () => {
  const [activeTab, setActiveTab] = useState("new-staff")

  const renderContent = () => {
    switch (activeTab) {
      case "new-staff":
        return <AddNewSchoolStaff />
      case "existing-user":
        return <AddExistingUserStaff />
      default:
        return <AddNewSchoolStaff />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading">Add School Staff</h1>
        <AddSchoolStaffSubHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  )
}
