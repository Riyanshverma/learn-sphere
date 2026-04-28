import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"
import { LayoutGrid, UserPlus, FileText } from "lucide-react"

export const SchoolAcademicsSubHeader = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <div className="flex items-center gap-2 rounded-full shadow-sm">
      {([{ name: "Classes", key: "school-classes", icon: LayoutGrid }, { name: "Enrollments", key: "school-enrollments", icon: UserPlus }, { name: "Exams", key: "school-exams", icon: FileText }] as const).map((tab) => {
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
