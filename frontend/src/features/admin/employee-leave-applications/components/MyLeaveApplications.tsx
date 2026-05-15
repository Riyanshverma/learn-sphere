import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/store"
import { CalendarPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { ApplyForLeaveDialog } from "@/features/admin"
import { toast } from "sonner"
import { adminService } from "@/services"
import type { MyLeaveApplicationsResponse } from "@/types"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLeaveStatusColor, getLeaveTypeColor } from "@/utils"

export const MyLeaveApplications = () => {
  const admin = useAdminStore((state) => state.admin)
  const updateLeavesTaken = useAdminStore((state) => state.updateLeavesTaken)
  const [applyForLeaveDialogOpen, setApplyForLeaveDialogOpen ] = useState(false)
  const [myLeaveApplications, setMyLeaveApplications] = useState<MyLeaveApplicationsResponse[] | null>(null)


  const fetchMyLeaveApplications = async () => {
    try {
      const result = await adminService.getMyLeaveApplications(admin?.employee_id as string);
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      setMyLeaveApplications(result.data);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  const handleCancelLeaveApplicationClick = async (leave_application_id: string, days: number) => {
    try {      
      const id = toast.loading("Cancelling leave application...")
      const result = await adminService.cancelLeaveApplication(leave_application_id);
      if (!result.success) {
        toast.dismiss(id);
        throw new Error(result.error, { cause: result.code })
      }

      updateLeavesTaken(-days)
      fetchMyLeaveApplications()
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if(admin?.employee_id) {
      fetchMyLeaveApplications()
    }
  }, [admin])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {([{ label: "Total Leave", value: admin?.leaves.total_leaves_per_month || 0, color: "text-blue-600" }, { label: "Leaves Taken", value: admin?.leaves.leaves_taken || 0, color: "text-red-600" }, { label: "Leaves Left", value: (admin?.leaves.total_leaves_per_month || 0) - (admin?.leaves.leaves_taken || 0), color: "text-green-600" }] as const).map((stat) => (
            <div key={stat.label} className="px-6 py-2 rounded-full border bg-card/80 flex flex-col justify-center">
              <h3 className="text-xl font-heading text-muted-foreground font-normal flex items-center justify-between">
                {stat.label}
                <span className={`text-3xl font-light ${stat.color}`}>{stat.value}</span>
              </h3>
            </div>
          ))}
        </div>

        <Button 
          className="text-base font-sans font-light h-10 rounded-lg px-8 cursor-pointer hover:bg-primary/60"
          onClick={() => setApplyForLeaveDialogOpen(true)}
        >
          <CalendarPlus className="h-5 w-5 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {myLeaveApplications === null ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : myLeaveApplications.length === 0 ? (
        <div className="flex min-h-[50vh]">
          <p className="text-muted-foreground font-sans font-light text-xl">
            No leave applications currently exist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myLeaveApplications.map((app) => {
            const days = Math.max(1, Math.ceil(((new Date(app.leave_to_date)).getTime() - (new Date(app.leave_from_date)).getTime()) / (1000 * 60 * 60 * 24)) + 1)
            return (
              <Card key={app.leave_application_id} className="w-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl font-heading font-normal capitalize">
                          {app.leave_reason}
                        </CardTitle>
                        <Badge className={`${getLeaveTypeColor(app.leave_type)} font-sans font-light text-sm capitalize`} variant="outline">
                          {app.leave_type} Leave
                        </Badge>
                        <span className="text-xl font-heading font-normal">
                          {days} Day(s)
                        </span>
                      </div>
                      <Badge className={`${getLeaveStatusColor(app.leave_status)} font-sans font-light text-sm capitalize px-4 py-1 rounded-full`} variant="outline">
                        {app.leave_status}
                      </Badge>
                    </div>

                    <CardDescription className="font-sans font-light text-base flex items-center justify-between">
                      <div>
                        {new Date(app.leave_from_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {" - "}
                        {new Date(app.leave_to_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      Applied On: {new Date(app.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-8 text-base font-sans font-light w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-light">Review Comment: </span>
                      <span className="text-foreground/80">{app.review_comment || "N/A"}</span>
                    </div>
                    <div className="text-base font-sans font-light">
                      <span className="text-muted-foreground font-light">Reviewed At: </span>
                      <span className="text-foreground/80">
                        {app.reviewed_at ? new Date(app.reviewed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                      </span>
                    </div>
                    <Button 
                    variant="destructive" 
                    className="rounded-3xl px-4 font-light font-sans"
                    disabled={app.leave_status !== "pending"}
                    onClick={() => handleCancelLeaveApplicationClick(app.leave_application_id, days)}
                  >
                    Cancel Application
                  </Button>
                  </div>
                </CardContent>

              </Card>
            )
          })}
        </div>
      )}

      <ApplyForLeaveDialog 
        dialogOpen={applyForLeaveDialogOpen}
        setDialogOpen={setApplyForLeaveDialogOpen}
      />
    </div>
  )
}