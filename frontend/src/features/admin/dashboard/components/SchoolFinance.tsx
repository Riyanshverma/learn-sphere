import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SchoolFinanceSubHeader, SchoolStudentsFees, SchoolEmployeesPayrolls } from "@/features/admin"

export const SchoolFinance = () => {
  const location = useLocation()
  const [activeFinanceTab, setActiveFinanceTab] = useState("school-employees-payrolls")

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveFinanceTab(location.state.subTab)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const renderFinanceContent = () => {
    switch (activeFinanceTab) {
      case "school-students-fees":
        return <SchoolStudentsFees />
      case "school-employees-payrolls":
        return <SchoolEmployeesPayrolls />
      default:
        return <SchoolStudentsFees />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading">Finance Overview</h1>
        <SchoolFinanceSubHeader 
          activeTab={activeFinanceTab} 
          setActiveTab={setActiveFinanceTab} 
        />
      </div>

      <div className="w-full">
        {renderFinanceContent()}
      </div>
    </div>
  )
}
