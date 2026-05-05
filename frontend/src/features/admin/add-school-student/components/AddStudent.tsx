import { useState } from "react"
import { AddStudentSubHeader, AddStudentWithNewParent, AddStudentWithExistingUserParent } from "@/features/admin"

export const AddStudent = () => {
  const [activeTab, setActiveTab] = useState("new-parent")

  const renderContent = () => {
    switch (activeTab) {
      case "new-parent":
        return <AddStudentWithNewParent />
      case "existing-user":
        return <AddStudentWithExistingUserParent />
      default:
        return <AddStudentWithNewParent />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading">Add School Student</h1>
        <AddStudentSubHeader 
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
