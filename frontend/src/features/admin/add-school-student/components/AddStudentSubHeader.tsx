import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, DoorOpen } from "lucide-react"
import type { HeaderProps } from "@/types"
import { useNavigate } from "react-router-dom"

export const AddStudentSubHeader = ({ activeTab, setActiveTab }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 rounded-full">
      {([{ name: "New Parent", key: "new-parent", icon: UserPlus }, { name: "Existing User", key: "existing-user", icon: UserCheck }] as const).map((tab) => {
        return (
          <Button
            key={tab.key}
            variant="ghost"
            className={`flex items-center gap-2 px-4 h-10 text-sm font-sans font-normal rounded-full transition-all ${activeTab === tab.key ? "bg-foreground text-background" : "text-muted-foreground border border-foreground/20 hover:bg-foreground/10"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        )
      })}
      <Button
        variant="ghost"
        className="flex items-center bg-foreground gap-2 px-4 h-10 text-sm font-sans font-normal transition-all text-background border border-foreground/20 hover:bg-foreground ml-4"
        onClick={() => navigate("/admin/dashboard", { state: { tab: "academics", subTab: "school-enrollments" } })}
      >
        <DoorOpen className="h-4 w-4" />
        Back
      </Button>
    </div>
  )
}
