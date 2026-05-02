import { Briefcase, GraduationCap, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTeacherInvitation } from "./AddTeacherInvitation"

export const SchoolEnrollments = () => {
  const navigate = useNavigate()
  const [addTeacherInvitationFormOpen, setAddTeacherInvitationFormOpen] = useState(false)

  const handleAddClick = (type: "staff" | "teacher" | "student") => {
    if (type === "staff") {
      navigate("/admin/add-school-staff")
    } else if (type === "teacher") {
      setAddTeacherInvitationFormOpen(true)
    } else if (type === "student") {

    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([{ label: "Add Staff", icon: Briefcase, type: "staff" }, { label: "Add Teacher", icon: GraduationCap, type: "teacher" }, { label: "Add Student", icon: UserPlus, type: "student" }, ] as const).map((action) => (
          <Button
            key={action.type}
            onClick={() => handleAddClick(action.type)}
            className="h-auto px-4 py-6 rounded-3xl border border-primary/10 bg-primary/20 flex items-center justify-center gap-4 transition-all hover:bg-primary/60 cursor-pointer group"
          >
            <action.icon className="h-7 w-7 text-primary" />
            <span className="text-xl font-heading text-foreground font-normal">{action.label}</span>
          </Button>
        ))}
      </div>
      
      {addTeacherInvitationFormOpen && (
        <AddTeacherInvitation />
      )}
    </div>
  )
}
