import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"
import { Users, FileText, DoorOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const LeaveApplicationsSubHeader = ({ activeTab, setActiveTab }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 rounded-full shadow-sm">
      {([{ name: "Employees Leaves", key: "employees-leaves", icon: Users }, { name: "My Leaves", key: "my-leaves", icon: FileText }] as const).map((tab) => {
        return (
          <Button
            key={tab.key}
            variant="ghost"
            className={`flex items-center gap-2 px-4 h-10 text-sm font-sans font-normal rounded-full ${activeTab === tab.key ? "bg-foreground text-background hover:bg-foreground" : "text-muted-foreground border border-foreground/20 hover:bg-foreground/10"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>

          
        )
      })}
      <Button
        variant="ghost"
        className="flex items-center bg-foreground gap-2 px-4 h-10 text-sm font-sans font-normal transition-all text-background border border-foreground/20 hover:bg-foreground"
        onClick={() => navigate('/admin/dashboard', { state: { tab: 'home' } })}
      >
        <DoorOpen className="h-4 w-4" />
        Back
      </Button>
    </div>
  )
}
