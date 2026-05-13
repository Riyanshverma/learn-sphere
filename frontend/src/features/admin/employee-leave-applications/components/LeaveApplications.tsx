import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { LeaveApplicationsSubHeader, EmployeesLeaveApplications, MyLeaveApplications } from "@/features/admin"

export const LeaveApplications = () => {
  const location = useLocation()
  const [activeLeaveTab, setActiveLeaveTab] = useState("employees-leaves")

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveLeaveTab(location.state.subTab)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const renderContent = () => {
    switch (activeLeaveTab) {
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
          activeTab={activeLeaveTab} 
          setActiveTab={setActiveLeaveTab} 
        />
      </div>

      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  )
}
