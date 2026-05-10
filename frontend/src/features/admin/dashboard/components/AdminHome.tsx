import { CalendarDays, FileText, LayoutDashboard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const AdminHome = () => {
  const navigate = useNavigate()

  return (
    <div className="pt-32 pb-16 w-full font-sans space-y-6">
      <h1 className="text-4xl font-heading">Quick Actions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([{ label: "Leave Applications", icon: FileText, route: "leave-applications" }, { label: "Employee Attendance", icon: CalendarDays, route: "employee-attendance" }, { label: "Dummy Action", icon: LayoutDashboard, route: "dashboard" }] as const).map((action) => (
          <Button
            key={action.label}
            onClick={() => navigate(`/admin/${action.route}`)}
            className="h-auto px-4 py-6 rounded-3xl bg-card flex items-center justify-center gap-4 transition-all hover:bg-primary/60 cursor-pointer group"
          >
            <action.icon className="text-foreground" />
            <span className="text-xl font-heading text-foreground font-normal">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
