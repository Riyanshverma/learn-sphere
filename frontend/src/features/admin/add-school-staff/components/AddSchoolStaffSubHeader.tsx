import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck } from "lucide-react"

interface AddSchoolStaffSubHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const AddSchoolStaffSubHeader = ({ activeTab, setActiveTab }: AddSchoolStaffSubHeaderProps) => {
  return (
    <div className="flex items-center gap-2 rounded-full">
      {([{ name: "New Staff", key: "new-staff", icon: UserPlus }, { name: "Existing User", key: "existing-user", icon: UserCheck }] as const).map((tab) => {
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
    </div>
  )
}
