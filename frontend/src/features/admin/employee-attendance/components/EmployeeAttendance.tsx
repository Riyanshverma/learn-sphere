import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, DoorOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { adminService } from "@/services"
import type { EmployeesAttendanceResponse } from "@/types"

export const EmployeeAttendance = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [employeesAttendance, setEmployeesAttendance] = useState<EmployeesAttendanceResponse[] | null>(null)

  const fetchEmployeesAttendance = async () => {
    try {
      const id = toast.loading('Fetching attendance...');
      const result = await adminService.getEmployeesAttendance(currentDate);
      if (!result.success) {
        toast.dismiss(id);
        throw new Error(result.error, { cause: result.code })
      }
      
      setEmployeesAttendance(result.data)
      toast.success(result.message, { id });
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    fetchEmployeesAttendance()
  }, [currentDate])

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading font-normal text-foreground">Employee Attendance</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border rounded-full px-2 py-1 gap-2">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent hover:bg-foreground hover:text-background"
              onClick={() => handleDateChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-sans px-2 min-w-[100px] text-center">
              {currentDate.toDateString() === new Date().toDateString() ? 'Today' : currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent hover:bg-foreground hover:text-background"
              onClick={() => handleDateChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="flex items-center bg-foreground gap-2 px-4 h-10 text-sm font-sans font-normal transition-all text-background border border-foreground/20 hover:bg-foreground"
            onClick={() => navigate('/admin/dashboard', { state: { tab: 'home' } })}
          >
            <DoorOpen className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="p-12 rounded-3xl border bg-card/80 flex items-center justify-center min-h-[400px]">
        <p className="text-xl text-muted-foreground font-light">
          Attendance records for {currentDate.toLocaleDateString()} will be displayed here.
        </p>
      </div>
    </div>
  )
}
