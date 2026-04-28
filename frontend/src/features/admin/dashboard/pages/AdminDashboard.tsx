import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { AdminDashboardHeader, AdminHome, SchoolPeople, SchoolAcademics, SchoolFinance, AdminSettings } from "@/features/admin"

export default function AdminDashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <AdminHome />
      case "people":
        return <SchoolPeople />
      case "academics":
        return <SchoolAcademics />
      case "finance":
        return <SchoolFinance />
      case "settings":
        return <AdminSettings />
      default:
        return <AdminHome />
    }
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="w-full max-w-5xl mx-auto">
        {renderContent()}
      </main>
    </div>
  )
}