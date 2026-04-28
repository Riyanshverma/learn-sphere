import { useState } from "react"
import { SchoolPeopleSubHeader, SchoolTeachers, SchoolStudents, SchoolStaff } from "@/features/admin"

export const SchoolPeople = () => {
  const [activePeopleTab, setActivePeopleTab] = useState("school-teachers")

  const renderPeopleContent = () => {
    switch (activePeopleTab) {
      case "school-teachers":
        return <SchoolTeachers />
      case "school-students":
        return <SchoolStudents />
      case "school-staff":
        return <SchoolStaff />
      default:
        return <SchoolTeachers />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading">School Directory</h1>
        <SchoolPeopleSubHeader 
          activeTab={activePeopleTab} 
          setActiveTab={setActivePeopleTab} 
        />
      </div>

      <div className="w-full">
        {renderPeopleContent()}
      </div>
    </div>
  )
}
