import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchSchema, type SearchType, ApplyLeaveForStaffSchema, type ApplyLeaveForStaffType } from "@/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useState, useEffect } from "react"
import type { SearchedStaffsResponse } from "@/types"
import { Search, CalendarIcon } from "lucide-react"
import { SearchedStaffInfo } from "@/features/admin"
import { cn } from "@/lib/utils"

interface ApplyLeaveForStaffDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  fetchEmployeesLeaveApplications: () => void
}

export const ApplyLeaveForStaffDialog = ({ dialogOpen, setDialogOpen, fetchEmployeesLeaveApplications }: ApplyLeaveForStaffDialogProps) => {
  const [searchedStaffs, setSearchedStaffs] = useState<SearchedStaffsResponse[] | null>(null)

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    watch: watchSearch,
    formState: { isSubmitting: isSearching },
  } = useForm<SearchType>({
    resolver: zodResolver(SearchSchema),
  })

  const {
    register: registerLeave,
    handleSubmit: handleSubmitLeave,
    control: controlLeave,
    watch: watchLeave,
    setValue: setValueLeave,
    reset: resetLeave,
    formState: { errors: errorsLeave, isSubmitting: isSubmittingLeave }
  } = useForm<ApplyLeaveForStaffType>({
    resolver: zodResolver(ApplyLeaveForStaffSchema),
  })

  const search = watchSearch("search")
  const fromDate = watchLeave("leave_from_date")
  const toDate = watchLeave("leave_to_date")

  useEffect(() => {
    if (fromDate && toDate) {
      setValueLeave("leave_days", Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1))
    }
  }, [fromDate, toDate])

  const onSearch = async (data: SearchType) => {
    try {
      const result = await adminService.getSearchStaffs(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      
      setSearchedStaffs(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  const handleSelectStaff = (staff: SearchedStaffsResponse) => {    
    setSearchedStaffs(null)
    setValueLeave("applicant_id", staff.employee_id)
    setValueLeave("staff_full_name", staff.full_name)
    setValueLeave("staff_email", staff.email)
    setValueLeave("staff_phone", `+${staff.phone}`)
    setValueLeave("staff_leaves_taken", staff.leaves.leaves_taken)
  }

  const onSubmitLeave = async (data: ApplyLeaveForStaffType) => {
    try {      
      const id = toast.loading("Submitting leave application...")
      const result = await adminService.applyForLeaveApplication(data)
      if (!result.success) {
        toast.dismiss(id)
        throw new Error(result.error, { cause: result.code })
      }

      resetLeave()
      setDialogOpen(false)
      fetchEmployeesLeaveApplications()
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (search) {
        handleSubmitSearch(onSearch)()
      } else {
        setSearchedStaffs(null)
      }
    }, 300)

    return () => clearTimeout(timerId)
  }, [search])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-xl bg-background backdrop-blur-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal">Apply Leave for Staff</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Search for a staff member and apply for leave on their behalf.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmitSearch(onSearch)} className="flex items-end gap-2">
            <div className="space-y-2 font-sans flex-1">
              <Label htmlFor="search" className="text-base text-muted-foreground font-light">Search Staff</Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Search Staff by Name/Phone..."
                    className="h-10 rounded-lg text-base font-light pr-10"
                    autoComplete="off"
                    {...registerSearch("search")}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <SearchedStaffInfo
                  staffs={searchedStaffs}
                  onSelect={handleSelectStaff}
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

          <form onSubmit={handleSubmitLeave(onSubmitLeave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">Staff Name</Label>
                <Input {...registerLeave("staff_full_name")} disabled placeholder="Select Staff" className="h-10 rounded-lg text-base font-light capitalize" />
              </div>
              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">Email Address</Label>
                <Input {...registerLeave("staff_email")} disabled placeholder="Select Staff" className="h-10 rounded-lg text-base font-light" />
              </div>
              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">Phone Number</Label>
                <Input {...registerLeave("staff_phone")} disabled placeholder="Select Staff" className="h-10 rounded-lg text-base font-light" />
              </div>
              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">Leaves Taken</Label>
                <Input {...registerLeave("staff_leaves_taken")} disabled placeholder="Select Staff" className="h-10 rounded-lg text-base font-light" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 font-sans">
                <Label htmlFor="leave_type" className="text-base text-muted-foreground font-light">Leave Type</Label>
                <Controller
                  control={controlLeave}
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
                        <SelectItem value="other" className="text-base font-light">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errorsLeave.leave_type && <p className="text-sm text-destructive font-light">{errorsLeave.leave_type.message}</p>}
              </div>

              <div className="space-y-2 font-sans col-span-2">
                <Label htmlFor="leave_reason" className="text-base text-muted-foreground font-light">Reason for Leave</Label>
                <Textarea 
                  {...registerLeave("leave_reason")}
                  rows={1}
                  placeholder="Brief reason..."
                  className="min-h-10 rounded-lg text-base font-light resize-none"
                />
                {errorsLeave.leave_reason && <p className="text-sm text-destructive font-light">{errorsLeave.leave_reason.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">From Date</Label>
                <Controller
                  control={controlLeave}
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
                        <Calendar 
                          mode="single" 
                          selected={field.value as Date | undefined} 
                          onSelect={field.onChange} 
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                          captionLayout="dropdown" 
                          className="font-sans"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errorsLeave.leave_from_date && <p className="text-sm text-destructive font-light">{errorsLeave.leave_from_date.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">To Date</Label>
                <Controller
                  control={controlLeave}
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
                        <Calendar 
                          mode="single" 
                          selected={field.value as Date | undefined} 
                          onSelect={field.onChange} 
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                          captionLayout="dropdown" 
                          className="font-sans"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errorsLeave.leave_to_date && <p className="text-sm text-destructive font-light">{errorsLeave.leave_to_date.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label className="text-base text-muted-foreground font-light">Leave Days</Label>
                <Input 
                  {...registerLeave("leave_days")}
                  disabled
                  placeholder="0"
                  className="h-10 rounded-lg text-base font-light" 
                />
                {errorsLeave.leave_days && <p className="text-sm text-destructive font-light">{errorsLeave.leave_days.message}</p>}
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isSubmittingLeave}
                className="text-base font-sans font-normal h-10 rounded-full px-8 hover:bg-primary/60"
              >
                {isSubmittingLeave ? "Submitting..." : "Apply Leave for Staff"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
