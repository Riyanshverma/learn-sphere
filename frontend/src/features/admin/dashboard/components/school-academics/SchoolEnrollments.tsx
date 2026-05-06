import { Briefcase, GraduationCap, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { adminService } from "@/services"
import type { TeacherInvitationsResponse } from "@/types"
import { TeacherInvitations, AddTeacherInvitation, AddStudentInvitation } from "@/features/admin"
import { Spinner } from "@/components/ui/spinner"

export const SchoolEnrollments = () => {
  const navigate = useNavigate()
  const [activeForm, setActiveForm] = useState<"teacher" | "student" | null>(null)
  const [teacherInvitations, setTeacherInvitations] = useState<TeacherInvitationsResponse[] | null>(null)
  const [parentInvitations, setParentInvitations] = useState<any[] | null>(null)

  const handleAddClick = (type: "staff" | "teacher" | "student") => {
    if (type === "staff") {
      navigate("/admin/add-school-staff")
    } else if (type === "teacher") {
      setActiveForm("teacher")
      setParentInvitations(null)
      fetchTeacherInvitations()
    } else if (type === "student") {
      setActiveForm("student")
      setTeacherInvitations(null)
      fetchParentInvitations()
    }
  }

  const fetchTeacherInvitations = async () => {
    try {
      const result = await adminService.getTeacherInvitations()
      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      setTeacherInvitations(result.data)
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause})
    }
  }

  const fetchParentInvitations = async () => {
    try {
      const result = await adminService.getParentInvitations()
      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      setParentInvitations(result.data)
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause})
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
      
      {activeForm === "teacher" && (
        <AddTeacherInvitation />
      )}

      {activeForm === "student" && (
        <AddStudentInvitation />
      )}

      {activeForm === "teacher" && (
        teacherInvitations === null ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : teacherInvitations.length === 0 ? (
          <div className="flex min-h-[50vh]">
            <p className="text-muted-foreground font-sans font-light text-xl">
              No teacher invitations currently exist.
            </p>
          </div>
        ) : (
          <TeacherInvitations teacherInvitations={teacherInvitations} fetchTeacherInvitations={fetchTeacherInvitations} />
        )
      )}

      {activeForm === "student" && (
        parentInvitations === null ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : parentInvitations.length === 0 ? (
          <div className="flex min-h-[50vh]">
            <p className="text-muted-foreground font-sans font-light text-xl">
              No parent invitations currently exist.
            </p>
          </div>
        ) : (
          <ParentInvitations parentInvitations={parentInvitations} fetchParentInvitations={fetchParentInvitations} />
        )
      )}
    </div>
  )
}
