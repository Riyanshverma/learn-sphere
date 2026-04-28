import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"
import { Presentation, GraduationCap, Users } from "lucide-react"

export const SchoolPeopleSubHeader = ({ activeTab, setActiveTab }: HeaderProps) => {

  return (
    <div className="flex items-center gap-2 rounded-full shadow-sm">
      {([{ name: "Teachers", key: "school-teachers", icon: Presentation }, { name: "Students", key: "school-students", icon: GraduationCap }, { name: "Staff", key: "school-staff", icon: Users }] as const).map((tab) => {
        return (
          <Button
            key={tab.key}
            variant="ghost"
            className={`flex items-center gap-2 px-4 h-10 text-sm font-sans font-normal rounded-full ${activeTab === tab.key ? "bg-foreground text-background" : "text-muted-foreground border border-foreground/20"}`}
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
