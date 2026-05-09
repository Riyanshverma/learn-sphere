import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddClassSubjectSchema, type AddClassSubjectType, SearchSchema, type SearchType } from "@/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useState, useEffect } from "react"
import type { AllClassesDetailsResponse, SearchedTeachersResponse } from "@/types"
import { Search } from "lucide-react"
import { SearchedTeachersInfo } from "@/features/admin"

interface AddClassSubjectDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  classDetails: AllClassesDetailsResponse
}

export const AddClassSubjectDialog = ({ dialogOpen, setDialogOpen, classDetails }: AddClassSubjectDialogProps) => {
  const [searchedTeachers, setSearchedTeachers] = useState<SearchedTeachersResponse[] | null>(null)

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    watch: watchSearch,
    formState: { isSubmitting: isSearching },
  } = useForm<SearchType>({
    resolver: zodResolver(SearchSchema),
  })

  const { 
    register: registerSubject, 
    handleSubmit: handleSubmitSubject, 
    formState: { errors: errorsSubject, isSubmitting: isSubjectSubmitting }, 
    setValue: setValueSubject, 
    reset: resetSubject 
  } = useForm<AddClassSubjectType>({
    resolver: zodResolver(AddClassSubjectSchema),
  })

  const search = watchSearch("search")

  const onSearch = async (data: SearchType) => {
    try {
      const result = await adminService.getSearchTeachers(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      
      setSearchedTeachers(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  const handleSelectTeacher = (teacher: SearchedTeachersResponse) => {    
    setSearchedTeachers(null)
    setValueSubject("class_id", classDetails.class_id)
    setValueSubject("class_standard", classDetails.class_standard)
    setValueSubject("class_section", classDetails.class_section)
    setValueSubject("subject_teacher", teacher.employee_id)
    setValueSubject("academic_year", classDetails.academic_year)
    setValueSubject("teacher_full_name", teacher.full_name)
    setValueSubject("teacher_email", teacher.email)
    setValueSubject("teacher_phone", `+${teacher.phone_number}`)
    setValueSubject("teacher_qualification", teacher.qualification)
    setValueSubject("teacher_specialization", teacher.specialization)
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (search) {
        handleSubmitSearch(onSearch)()
      } else {
        setSearchedTeachers(null)
      }
    }, 300)

    return () => clearTimeout(timerId)
  }, [search])

  const onSubmitSubject = async (data: AddClassSubjectType) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === "syllabus") {
          formData.append(key, data.syllabus[0])
        } else {
          formData.append(key, String(data[key as keyof AddClassSubjectType]))
        }
      })

      const result = await adminService.addClassSubject(formData)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      toast.success(result.message)
      setDialogOpen(false)
      resetSubject()
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-xl bg-background backdrop-blur-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal">Add Class Subject</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Assign a new subject and teacher to this class.
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
                    placeholder="Search Teacher by Name/Phone..."
                    className="h-10 rounded-lg text-base font-light pr-10"
                    autoComplete="off"
                    {...registerSearch("search")}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <SearchedTeachersInfo
                  teachers={searchedTeachers}
                  onSelect={handleSelectTeacher}
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

          <form onSubmit={handleSubmitSubject(onSubmitSubject)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_full_name" className="text-base text-muted-foreground font-light">Teacher Name</Label>
                <Input id="teacher_full_name" disabled placeholder="Select a teacher" className="h-10 rounded-lg text-base font-light bg-muted/20" {...registerSubject("teacher_full_name")} />
              </div>
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_email" className="text-base text-muted-foreground font-light">Teacher Email</Label>
                <Input id="teacher_email" disabled placeholder="Select a teacher" className="h-10 rounded-lg text-base font-light bg-muted/20" {...registerSubject("teacher_email")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_qualification" className="text-base text-muted-foreground font-light">Qualification</Label>
                <Input id="teacher_qualification" disabled placeholder="Select a teacher" className="h-10 rounded-lg text-base font-light bg-muted/20 capitalize" {...registerSubject("teacher_qualification")} />
              </div>
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_specialization" className="text-base text-muted-foreground font-light">Specialization</Label>
                <Input id="teacher_specialization" disabled placeholder="Select a teacher" className="h-10 rounded-lg text-base font-light bg-muted/20 capitalize" {...registerSubject("teacher_specialization")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="teacher_phone" className="text-base text-muted-foreground font-light">Teacher Phone</Label>
                <Input id="teacher_phone" disabled placeholder="Select a teacher" className="h-10 rounded-lg text-base font-light bg-muted/20" {...registerSubject("teacher_phone")} />
              </div>
              <div className="space-y-2 font-sans">
                <Label htmlFor="subject_name" className="text-base text-muted-foreground font-light">Subject Name</Label>
                <Input id="subject_name" placeholder="e.g. Mathematics" className="h-10 rounded-lg text-base font-light" {...registerSubject("subject_name")} />
                {errorsSubject.subject_name && <p className="text-sm text-destructive font-light">{errorsSubject.subject_name.message}</p>}
              </div>
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="syllabus" className="text-base text-muted-foreground font-light">Syllabus (PDF/Image)</Label>
              <Input id="syllabus" type="file" accept=".pdf,image/*" className="h-10 rounded-lg text-base font-light file:text-muted-foreground file:font-light file:cursor-pointer cursor-pointer" {...registerSubject("syllabus")} />
              {errorsSubject.syllabus && <p className="text-sm text-destructive font-light">{errorsSubject.syllabus.message as string}</p>}
            </div>

            <div className="flex justify-center pt-2">
              <Button type="submit" className="text-base font-sans h-10 rounded-full px-8" disabled={isSubjectSubmitting}>
                {isSubjectSubmitting ? "Adding Subject..." : "Add Subject"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
