import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchSchema, type SearchType, UpdateClassTeacherSchema, type UpdateClassTeacherType } from "@/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useState, useEffect } from "react"
import type { AllClassesDetailsResponse, SearchedTeachersResponse } from "@/types"
import { Search } from "lucide-react"
import { SearchedTeachersInfo } from "@/features/admin"

interface UpdateClassTeacherDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  classDetails: AllClassesDetailsResponse
}

export const UpdateClassTeacherDialog = ({ dialogOpen, setDialogOpen, classDetails }: UpdateClassTeacherDialogProps) => {
  const [searchedTeachersForClassTeacher, setSearchedTeachersForClassTeacher] = useState<SearchedTeachersResponse[] | null>(null)

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    watch: watchSearch,
    formState: { isSubmitting: isSearching },
  } = useForm<SearchType>({
    resolver: zodResolver(SearchSchema),
  })

  const { 
    register: registerUpdate, 
    handleSubmit: handleSubmitUpdate, 
    formState: { isSubmitting: isUpdating }, 
    setValue: setValueUpdate, 
    reset: resetUpdate 
  } = useForm<UpdateClassTeacherType>({
    resolver: zodResolver(UpdateClassTeacherSchema),
  })

  const search = watchSearch("search")

  const onSearch = async (data: SearchType) => {
    try {
      const result = await adminService.getSearchTeachersForClassTeacher(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      setSearchedTeachersForClassTeacher(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  const handleSelectTeacherForClassTeacher = (teacher: SearchedTeachersResponse) => {
    setSearchedTeachersForClassTeacher(null)
    setValueUpdate("class_id", classDetails.class_id)
    setValueUpdate("class_teacher", teacher.employee_id)
    setValueUpdate("teacher_email", teacher.email)
    setValueUpdate("teacher_full_name", teacher.full_name)
    setValueUpdate("teacher_phone", `+${teacher.phone}`)
    setValueUpdate("teacher_qualification", teacher.qualification)
    setValueUpdate("teacher_specialization", teacher.specialization)
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (search) {
        handleSubmitSearch(onSearch)()
      } else {
        setSearchedTeachersForClassTeacher(null)
      }
    }, 300)

    return () => clearTimeout(timerId)
  }, [search])

  const onSubmitUpdate = async (data: UpdateClassTeacherType) => {
    try {
      const result = await adminService.updateClassTeacher(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      toast.success(result.message)
      setDialogOpen(false)
      resetUpdate()
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-xl bg-background backdrop-blur-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal">Update Class Teacher</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Update the class teacher for this class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmitSearch(onSearch)} className="flex items-end gap-2">
            <div className="space-y-2 font-sans flex-1">
              <Label htmlFor="search" className="text-base text-muted-foreground font-light">Search Teacher</Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Search Teacher by Name"
                    className="h-10 rounded-lg text-base font-light pr-10"
                    autoComplete="off"
                    {...registerSearch("search")}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <SearchedTeachersInfo
                  teachers={searchedTeachersForClassTeacher}
                  onSelect={handleSelectTeacherForClassTeacher}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="h-10 px-8 rounded-lg font-sans font-light text-base"
            >
              {isSearching ? "..." : "Search"}
            </Button>
          </form>

          <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_full_name" className="text-base text-muted-foreground font-light">Teacher Name</Label>
                <Input id="teacher_full_name" disabled placeholder="Select Teacher" className="h-10 rounded-lg text-base font-light bg-muted/20 capitalize" {...registerUpdate("teacher_full_name")} />
              </div>
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_email" className="text-base text-muted-foreground font-light">Teacher Email</Label>
                <Input id="teacher_email" disabled placeholder="Select Teacher" className="h-10 rounded-lg text-base font-light bg-muted/20" {...registerUpdate("teacher_email")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_qualification" className="text-base text-muted-foreground font-light">Qualification</Label>
                <Input id="teacher_qualification" disabled placeholder="Select Teacher" className="h-10 rounded-lg text-base font-light bg-muted/20 capitalize" {...registerUpdate("teacher_qualification")} />
              </div>
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_specialization" className="text-base text-muted-foreground font-light">Specialization</Label>
                <Input id="teacher_specialization" disabled placeholder="Select Teacher" className="h-10 rounded-lg text-base font-light bg-muted/20 capitalize" {...registerUpdate("teacher_specialization")} />
              </div>
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="teacher_phone" className="text-base text-muted-foreground font-light">Teacher Phone</Label>
              <Input id="teacher_phone" disabled placeholder="Select Teacher" className="h-10 rounded-lg text-base font-light bg-muted/20" {...registerUpdate("teacher_phone")} />
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="text-base font-normal font-sans h-10 rounded-full px-8" disabled={isUpdating}>
                {isUpdating ? "Updating Class Teacher..." : "Update Class Teacher"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}