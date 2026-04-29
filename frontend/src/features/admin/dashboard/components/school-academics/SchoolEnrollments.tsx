import { Briefcase, GraduationCap, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const SchoolEnrollments = () => {
  const navigate = useNavigate()

  const handleAddClick = (type: "staff" | "teacher" | "student") => {
    if (type === "staff") {
      navigate("/admin/add-school-staff")
    } else if (type === "teacher") {

    } else if (type === "student") {

    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([{ label: "Add Staff", icon: Briefcase, type: "staff" }, { label: "Add Teacher", icon: GraduationCap, type: "teacher" }, { label: "Add Student", icon: UserPlus, type: "student" }, ] as const).map((action) => (
          <div
            key={action.type}
            onClick={() => handleAddClick(action.type)}
            className="px-4 py-6 rounded-3xl border border-primary/10 bg-primary/20 flex items-center justify-center gap-4 transition-all hover:bg-primary/60 cursor-pointer group"
          >
            <action.icon className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-heading text-foreground font-normal">{action.label}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
