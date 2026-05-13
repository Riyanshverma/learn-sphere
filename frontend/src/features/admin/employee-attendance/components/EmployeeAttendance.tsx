import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, DoorOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adminService } from "@/services"
import type { EmployeesAttendanceResponse, attendance_status } from "@/types"
import { getRoleColor, getAttendanceStatusColor } from "@/utils"

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

  const handleUpdateStatus = async (attendance_id: string | null, employee_id: string, currentStatus: attendance_status | null, newStatus: attendance_status, remarks = null) => {
    if (currentStatus === newStatus) return;
    try {
      const result = await adminService.updateSingleEmployeeAttendance({
        attendance_id,
        employee_id,
        date: currentDate.toISOString().split('T')[0],
        status: newStatus,
        remarks
      });

      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      setEmployeesAttendance((prev) => prev?.map((emp) => emp.employee_id === employee_id ? { ...emp, status: newStatus } : emp) || null);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause });
    }
  }

  const handleUpdateRemarks = async (attendance_id: string | null, employee_id: string, status: attendance_status | null, remarks: string) => {
    try {
      const id = toast.loading('Updating remarks...');
      const result = await adminService.updateSingleEmployeeAttendance({
        attendance_id,
        employee_id,
        date: currentDate.toISOString().split('T')[0],
        status: status || 'pending',
        remarks
      });

      if (!result.success) {
        toast.dismiss(id);
        throw new Error(result.error, { cause: result.code });
      }

      setEmployeesAttendance((prev) => prev?.map((emp) => emp.employee_id === employee_id ? { ...emp, remarks } : emp) || null);
      toast.success(result.message, { id });
    } catch (error: any) {
      toast.error(error.message, { description: error.cause });
    }
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

      <div className="rounded-2xl border bg-card/80 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-2 w-[100px] text-lg text-muted-foreground font-light font-sans">Code</TableHead>
              <TableHead className="py-2 text-lg text-muted-foreground font-light font-sans">Employee</TableHead>
              <TableHead className="py-2 text-lg text-muted-foreground font-light font-sans">Status</TableHead>
              <TableHead className="py-2 w-[250px] text-lg text-muted-foreground font-light font-sans">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesAttendance?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-lg text-muted-foreground font-light font-sans">
                  No attendance records found for this date.
                </TableCell>
              </TableRow>
            )}
            {employeesAttendance?.map((employee) => (
              <TableRow key={employee.employee_id} className={`${employee.on_leave ? 'bg-red-700/80 hover:bg-red-700/60' : 'hover:bg-muted/30'} transition-colors`}>
                <TableCell className="text-base text-muted-foreground font-light font-sans pl-3 py-3">
                  #{employee.employee_code}
                </TableCell>
                <TableCell className="text-base text-foreground font-light font-sans py-3">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{employee.full_name}</span>
                    <Badge variant="outline" className={`capitalize ${getRoleColor(employee.designation)} bg-transparent font-light`}>
                      {employee.designation}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {(['present', 'absent', 'late', 'half_day', 'holiday'] as attendance_status[]).map(status => {
                      return (
                        <Button
                          key={status}
                          variant="outline"
                          className={`capitalize rounded-full px-4 h-7 text-base font-sans font-light ${employee.status === status ? getAttendanceStatusColor(status) : 'text-muted-foreground hover:text-foreground border-foreground/10'}`}
                          onClick={() => handleUpdateStatus(employee.attendance_id, employee.employee_id, employee.status, status)}
                        >
                          {status.replace('_', ' ')}
                        </Button>
                      )
                    })}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Input
                    defaultValue={employee.remarks || ''}
                    onBlur={(e) => {
                      if (e.target.value !== (employee.remarks || '')) {
                        handleUpdateRemarks(employee.attendance_id, employee.employee_id, employee.status, e.target.value)
                      }
                    }}
                    placeholder="Remarks"
                    className="h-10 rounded-lg text-base font-light font-sans"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

