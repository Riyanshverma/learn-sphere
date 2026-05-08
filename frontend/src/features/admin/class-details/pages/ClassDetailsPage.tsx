import { AdminDashboardHeader, ClassDetails } from "@/features/admin"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import type { AllClassesDetailsResponse } from "@/types"

export default function ClassDetailsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const classDetails = location.state?.classDetails as AllClassesDetailsResponse

  useEffect(() => {
    if (!classDetails) {
      navigate('/admin/dashboard', { state: { tab: 'academics', subTab: 'school-classes' } })
    }
  }, [classDetails])

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader
        onClassDetailsPage={true}
        activeTab="-"
        setActiveTab={() => {}}
      />
      <main className="w-full max-w-5xl mx-auto">
        <ClassDetails classDetails={classDetails} />
      </main>
    </div>
  )
}
