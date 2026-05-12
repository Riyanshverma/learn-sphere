import { useState } from "react"
import { LeaveApplicationsSubHeader, EmployeesLeaveApplications, MyLeaveApplications } from "@/features/admin"

export const LeaveApplications = () => {
  const [activeTab, setActiveTab] = useState("my-leaves")

  const renderContent = () => {
    switch (activeTab) {
      case "employees-leaves":
        return <EmployeesLeaveApplications />
      case "my-leaves":
        return <MyLeaveApplications />
      default:
        return <EmployeesLeaveApplications />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading font-normal text-foreground">Leave Applications</h1>
        <LeaveApplicationsSubHeader 
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
