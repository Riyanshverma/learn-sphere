import { AdminDashboardHeader, EmployeeAttendance } from "@/features/admin"

export default function EmployeeAttendancePage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader 
        activeTab="-" 
        setActiveTab={() => {}} 
        onEmployeeAttendancePage={true} 
      />
      <main className="w-full max-w-5xl mx-auto">
        <EmployeeAttendance />
      </main>
    </div>
  )
}
