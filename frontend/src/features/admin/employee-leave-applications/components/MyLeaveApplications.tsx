import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/store"
import { CalendarPlus } from "lucide-react"
import { useState } from "react"
import { ApplyForLeaveDialog } from "@/features/admin"

export const MyLeaveApplications = () => {
  const admin = useAdminStore((state) => state.admin)
  const [ applyForLeaveDialogOpen, setApplyForLeaveDialogOpen ] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {([{ label: "Total Leave", value: admin?.leaves.total_leaves_per_year || 0, color: "text-blue-600" }, { label: "Leaves Taken", value: admin?.leaves.leaves_taken || 0, color: "text-red-600" }, { label: "Leaves Left", value: (admin?.leaves.total_leaves_per_year || 0) - (admin?.leaves.leaves_taken || 0), color: "text-green-600" }] as const).map((stat) => (
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

      <div className="p-12 rounded-3xl border bg-card/80 flex items-center justify-center min-h-[300px] backdrop-blur-sm">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading text-foreground">My Leave History</h2>
          <p className="text-xl text-muted-foreground font-light max-w-md mx-auto">
            You haven't submitted any leave applications yet. Your history will appear here once you start applying.
          </p>
        </div>
      </div>

      <ApplyForLeaveDialog 
        dialogOpen={applyForLeaveDialogOpen}
        setDialogOpen={setApplyForLeaveDialogOpen}
      />
    </div>
  )
}

