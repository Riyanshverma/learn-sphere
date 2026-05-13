import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DoorOpen } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminStore } from "@/store"
import { adminService } from "@/services"
import { getAttendanceStatusColor } from "@/utils"

export const MyAttendance = () => {
  const navigate = useNavigate()
  const admin = useAdminStore((state) => state.admin)
  const myAttendance = useAdminStore((state) => state.myAttendance)
  const setMyAttendance = useAdminStore((state) => state.setMyAttendance)

  const fetchMyAttendance = async () => {
    try {
      const result = await adminService.getMyAttendance(admin?.employee_id as string)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      setMyAttendance(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if (!myAttendance) {
      fetchMyAttendance()
    }
  }, [myAttendance])

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading font-normal text-foreground">My Attendance</h1>
        <div className="flex items-center gap-2">
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

      {myAttendance === null ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : myAttendance.length === 0 ? (
        <div className="flex min-h-[50vh]">
          <p className="text-muted-foreground font-sans font-light text-xl">
            No attendance records found.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card/80 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-4 px-6 text-lg text-muted-foreground font-light font-sans">Date</TableHead>
                <TableHead className="py-4 px-6 text-lg text-muted-foreground font-light font-sans">Status</TableHead>
                <TableHead className="py-4 px-6 text-lg text-muted-foreground font-light font-sans">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((attendance) => (
                <TableRow key={attendance.attendance_id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4 px-6 text-base text-foreground font-light font-sans">
                    {new Date(attendance.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className={`capitalize rounded-full px-4 h-7 text-sm font-sans font-light ${getAttendanceStatusColor(attendance.status)}`}>
                      {attendance.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-base text-muted-foreground font-light font-sans">
                    {attendance.remarks || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
