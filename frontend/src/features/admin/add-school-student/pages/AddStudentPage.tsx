import { AdminDashboardHeader, AddStudent } from "@/features/admin"

export default function AddStudentPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminDashboardHeader
        onAddSchoolStaffPage={true}
        activeTab="-"
        setActiveTab={() => {}}
      />
      <main className="w-full max-w-5xl mx-auto">
        <AddStudent />
      </main>
    </div>
  )
}
