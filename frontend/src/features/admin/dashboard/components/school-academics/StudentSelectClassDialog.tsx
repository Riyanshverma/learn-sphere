import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectStudentClassSchema, type SelectStudentClassType } from "@/validation"
import { adminService } from "@/services"
import { toast } from "sonner"
import { useEffect } from "react"
import type { ParentInvitationsResponse } from "@/types"

interface StudentSelectClassDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  invitation: ParentInvitationsResponse | null
  fetchParentInvitations: () => Promise<void>
}

export const StudentSelectClassDialog = ({ dialogOpen, setDialogOpen, invitation, fetchParentInvitations }: StudentSelectClassDialogProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SelectStudentClassType>({
    resolver: zodResolver(SelectStudentClassSchema),
  })

  useEffect(() => {
    if (invitation && dialogOpen) {
      reset({
        invitation_id: invitation.invitation_id,
        student_id: invitation.student_id,
        new_status: "allowed",
      })
    }
  }, [invitation, dialogOpen])

  const onSubmit = async (data: SelectStudentClassType) => {
    try {
      const id = toast.loading("Assigning student class...")
      const result = await adminService.updateStudentClassAndInvitationStatus(data)
      if (!result.success) {
        toast.dismiss(id)
        throw new Error(result.error, { cause: result.code })
      }

      setDialogOpen(false)
      await fetchParentInvitations()
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  if (!invitation) return null

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-lg bg-background backdrop-blur-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal">Select Student Class</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Assign a class to <span className="text-foreground font-normal capitalize">{invitation.student_full_name}</span> to complete the enrollment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="gap-4 font-sans flex items-center">
            <Label htmlFor="class" className="text-base text-muted-foreground font-light">Class</Label>
            <Controller
              control={control}
              name="class"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="font-sans">
                    <SelectItem value="1A" className="text-base font-light">1A</SelectItem>
                    <SelectItem value="2A" className="text-base font-light">2A</SelectItem>
                    <SelectItem value="3A" className="text-base font-light">3A</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.class && <p className="text-sm text-destructive font-light">{errors.class.message}</p>}
            <Button type="submit" className="h-9 rounded-lg px-8 font-sans font-light text-base ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
