import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"
import { CreditCard, Banknote } from "lucide-react"

export const SchoolFinanceSubHeader = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <div className="flex items-center gap-2 rounded-full shadow-sm">
      {([{ name: "Students Fees", key: "school-students-fees", icon: CreditCard }, { name: "Employees Payrolls", key: "school-employees-payrolls", icon: Banknote }] as const).map((tab) => {
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
    </div>
  )
}
