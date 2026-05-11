import { AdminDashboardHeader, LeaveApplications } from "@/features/admin"

export default function LeaveApplicationsPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader 
        activeTab="-" 
        setActiveTab={() => {}} 
        onLeaveApplicationsPage={true} 
      />
      <main className="w-full max-w-5xl mx-auto">
        <LeaveApplications />
      </main>
    </div>
  )
}
