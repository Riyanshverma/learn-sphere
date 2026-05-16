import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DoorOpen, Plus, UserRoundPen } from "lucide-react"
import type { AllClassesDetailsResponse } from "@/types"
import { useState } from "react"
import { AddClassSubjectDialog, UpdateClassTeacherDialog } from "@/features/admin"
import { toast } from "sonner"

export const ClassDetails = ({ classDetails }: { classDetails: AllClassesDetailsResponse }) => {
  const navigate = useNavigate()
  const [addClassSubjectDialogOpen, setAddClassSubjectDialogOpen] = useState(false)
  const [updateClassTeacherDialogOpen, setUpdateClassTeacherDialogOpen] = useState(false)

  const fetchClassSubjectsAndStudents = async () => {
    try {
      // TODO: To be implemented when attandance will be implemented
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <>
      <div className="pt-32 pb-16 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl font-heading">Class {classDetails.class_standard} - {classDetails.class_section}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 h-10 text-sm font-sans font-normal rounded-full transition-all text-muted-foreground border border-foreground/20 hover:bg-foreground/10"
              onClick={() => setUpdateClassTeacherDialogOpen(true)}
            >
              <UserRoundPen className="h-4 w-4" />
              Update Class Teacher
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 h-10 text-sm font-sans font-normal rounded-full transition-all text-muted-foreground border border-foreground/20 hover:bg-foreground/10"
              onClick={() => setAddClassSubjectDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
            <Button
              variant="ghost"
              className="flex items-center bg-foreground gap-2 px-4 h-10 text-sm font-sans font-normal transition-all text-background border border-foreground/20 hover:bg-foreground"
              onClick={() => navigate('/admin/dashboard', { state: { tab: 'academics', subTab: 'school-classes' } })}
            >
              <DoorOpen className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          <div className="space-y-4">
            <div>
              <h3 className="text-muted-foreground text-sm uppercase tracking-wider font-light">Class Information</h3>
              <p className="text-2xl font-normal">Class {classDetails.class_standard} - {classDetails.class_section}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm uppercase tracking-wider font-light">Academic Year</h3>
              <p className="text-xl font-normal">{classDetails.academic_year}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-muted-foreground text-sm uppercase tracking-wider font-light">Class Teacher</h3>
              <p className="text-xl font-normal capitalize">{classDetails.teacher_name}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm uppercase tracking-wider font-light">Total Students</h3>
              <p className="text-xl font-normal">{classDetails.class_students} Students</p>
            </div>
          </div>
        </div>
      </div>
      <AddClassSubjectDialog 
        dialogOpen={addClassSubjectDialogOpen} 
        setDialogOpen={setAddClassSubjectDialogOpen} 
        classDetails={classDetails}
      />
      <UpdateClassTeacherDialog
        dialogOpen={updateClassTeacherDialogOpen}
        setDialogOpen={setUpdateClassTeacherDialogOpen}
        classDetails={classDetails}
      />
    </>
  )
}
