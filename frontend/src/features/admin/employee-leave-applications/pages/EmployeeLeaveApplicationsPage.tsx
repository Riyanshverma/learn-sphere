import { AdminDashboardHeader, EmployeeLeaveApplication } from "@/features/admin"

export default function EmployeeLeaveApplicationsPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader 
        activeTab="-" 
        setActiveTab={() => {}} 
        onLeaveApplicationsPage={true} 
      />
      <main className="w-full max-w-5xl mx-auto">
        <EmployeeLeaveApplication />
      </main>
    </div>
  )
}
