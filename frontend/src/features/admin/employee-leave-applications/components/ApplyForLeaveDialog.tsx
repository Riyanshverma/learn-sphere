import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminStore } from "@/store"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApplyForLeaveSchema, type ApplyForLeaveType } from "@/validation"
import { toast } from "sonner"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApplyForLeaveDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

export const ApplyForLeaveDialog = ({ dialogOpen, setDialogOpen }: ApplyForLeaveDialogProps) => {
  const admin = useAdminStore((state) => state.admin)
  
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ApplyForLeaveType>({
    resolver: zodResolver(ApplyForLeaveSchema),
    defaultValues:{
      leave_from_date: new Date(),
      leave_to_date: new Date(),
      applicant_id: admin?.employee_id,
    }
  })

  const onSubmit = async (data: ApplyForLeaveType) => {
    try {
      console.log("Submitting Leave Application:", data)
      // TODO: Integrate with backend service
      toast.success("Leave application submitted successfully!")
      setDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to submit leave application")
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-xl bg-background backdrop-blur-xl rounded-3xl border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal text-foreground">Apply for Leave</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Fill in the details below to submit your leave application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 font-sans">
              <Label htmlFor="leave_type" className="text-base text-muted-foreground font-light">Leave Type</Label>
              <Controller
                control={control}
                name="leave_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="font-sans">
                      <SelectItem value="sick" className="text-base font-light">Sick Leave</SelectItem>
                      <SelectItem value="casual" className="text-base font-light">Casual Leave</SelectItem>
                      <SelectItem value="maternity" className="text-base font-light">Maternity Leave</SelectItem>
                      <SelectItem value="paternity" className="text-base font-light">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid" className="text-base font-light">Unpaid Leave</SelectItem>
                      <SelectItem value="bereavement" className="text-base font-light">Bereavement Leave</SelectItem>
                      <SelectItem value="other" className="text-base font-light">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leave_type && <p className="text-sm text-destructive font-light">{errors.leave_type.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="leave_reason" className="text-base text-muted-foreground font-light">Reason for Leave</Label>
              <Controller
                control={control}
                name="leave_reason"
                render={({ field }) => (
                  <Textarea 
                    {...field}
                    rows={1}
                    placeholder="Brief reason..."
                    className="min-h-10 rounded-lg text-base font-light resize-none"
                  />
                )}
              />
              {errors.leave_reason && <p className="text-sm text-destructive font-light">{errors.leave_reason.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="leave_from_date" className="text-base text-muted-foreground font-light">From Date</Label>
              <Controller
                control={control}
                name="leave_from_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("h-10 w-full justify-start rounded-lg text-left font-light border-primary/10 bg-card/50", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (field.value as Date).toLocaleDateString() : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} captionLayout="dropdown" className="font-sans"/>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.leave_from_date && <p className="text-sm text-destructive font-light">{errors.leave_from_date.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="leave_to_date" className="text-base text-muted-foreground font-light">To Date</Label>
              <Controller
                control={control}
                name="leave_to_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("h-10 w-full justify-start rounded-lg text-left font-light border-primary/10 bg-card/50", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (field.value as Date).toLocaleDateString() : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} captionLayout="dropdown" className="font-sans"/>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.leave_to_date && <p className="text-sm text-destructive font-light">{errors.leave_to_date.message}</p>}
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="text-base font-sans h-10 rounded-full px-8 hover:bg-primary/60"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
