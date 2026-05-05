import { useState, useEffect } from "react"
import { SchoolAcademicsSubHeader, SchoolClasses, SchoolEnrollments, SchoolExamsAndResults } from "@/features/admin"
import { useLocation } from "react-router-dom"

export const SchoolAcademics = () => {
  const location = useLocation()
  const [activeAcademicsTab, setActiveAcademicsTab] = useState("school-classes")

  useEffect(() => {
      if (location.state?.subTab) {
        setActiveAcademicsTab(location.state.subTab)
        window.history.replaceState({}, document.title)
      }
    }, [location.state])

  const renderAcademicsContent = () => {
    switch (activeAcademicsTab) {
      case "school-classes":
        return <SchoolClasses />
      case "school-enrollments":
        return <SchoolEnrollments />
      case "school-exams":
        return <SchoolExamsAndResults />
      default:
        return <SchoolClasses />
    }
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading">Academics Overview</h1>
        <SchoolAcademicsSubHeader 
          activeTab={activeAcademicsTab} 
          setActiveTab={setActiveAcademicsTab} 
        />
      </div>

      <div className="w-full">
        {renderAcademicsContent()}
      </div>
    </div>
  )
}
