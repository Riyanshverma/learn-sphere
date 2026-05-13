import { AdminDashboardHeader } from "@/features/admin"
import { MyAttendance } from "../components/MyAttendance"

export default function MyAttendancePage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader
        onMyAttendancePage={true}
        activeTab="-"
        setActiveTab={() => {}}
      />
      <main className="w-full max-w-5xl mx-auto">
        <MyAttendance />
      </main>
    </div>
  )
}
