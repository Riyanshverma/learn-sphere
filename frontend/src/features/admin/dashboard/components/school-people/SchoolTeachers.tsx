import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useEffect } from "react"
import { useAdminStore } from "@/store"

export const SchoolTeachers = () => {
  const allSchoolTeachers = useAdminStore((state) => state.allSchoolTeachers)
  const setAllSchoolTeachers = useAdminStore((state) => state.setAllSchoolTeachers)

  const fetchAllSchoolTeachers = async () => {
    try {
      const result = await adminService.getAllSchoolTeachers();
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      setAllSchoolTeachers(result.data)
      toast.success(result.message)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if (!allSchoolTeachers) {
      fetchAllSchoolTeachers();
    }
  }, [allSchoolTeachers])

  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allSchoolTeachers?.map((teacher) => (
          <div key={teacher.employee_id} className="p-6 rounded-3xl border border-foreground/10 bg-foreground/5 backdrop-blur-md flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-normal">{teacher.full_name}</h3>
                <p className="text-muted-foreground text-sm font-sans font-light capitalize">
                  {teacher.designation} • {teacher.specialization}
                </p>
                <p className="text-muted-foreground text-xs font-sans font-light">
                  {teacher.email}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full px-4 py-1 font-sans font-light bg-foreground/10 text-foreground border-none">
                EMP{teacher.employee_code}
              </Badge>
            </div>
            
            {(teacher.class || teacher.subjects.length > 0) && (
              <div className="pt-4 border-t border-foreground/10 space-y-3">
                {teacher.class && (
                  <div className="flex items-center justify-between text-sm font-sans">
                    <span className="text-muted-foreground font-light">Class Teacher</span>
                    <span className="font-medium">Class {teacher.class.class_standard}-{teacher.class.class_section}</span>
                  </div>
                )}
                {teacher.subjects.length > 0 && (
                  <div className="space-y-1.5 text-sm font-sans">
                    <span className="text-muted-foreground font-light block">Subjects Taught</span>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map(subject => (
                        <Badge key={subject.id} variant="outline" className="font-light rounded-lg text-xs bg-background/50">
                          {subject.name} (Class {subject.class_id ? "..." : "..."}) 
                          {/* NOTE: We might need to join class details in the RPC to show class name for subjects accurately, for now showing code */}
                          {subject.subject_code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {allSchoolTeachers?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border rounded-3xl bg-foreground/5">
            <p className="text-muted-foreground font-sans text-lg">No teachers found in the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
