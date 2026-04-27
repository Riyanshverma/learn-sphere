import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { LogOut, Settings } from "lucide-react"
import { useAdminStore } from "@/store"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { userAuthService } from "@/services"

export const AdminDashboardHeader = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const reset = useAdminStore((state) => state.reset)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const result = await userAuthService.logout()
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      toast.success(result.message)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    } finally {
      reset()
      navigate('/login')
    }
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-between px-6 py-3 bg-background/40 backdrop-blur-md border border-foreground/60 rounded-full w-full max-w-5xl pointer-events-auto">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-heading font-normal text-xl">
            LearnSphere
          </span>
        </div>

        <div className="flex justify-center flex-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              {([{ id: "home", label: "Home" }, { id: "people", label: "People" }, { id: "academics", label: "Academics" }, { id: "finance", label: "Finance" }] as const).map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink
                    href="#"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-base font-normal rounded-full cursor-pointer px-4 h-10 font-sans",
                      activeTab === item.id && "bg-foreground text-background"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab(item.id)
                    }}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        

        <div className="flex flex-1 items-center justify-end gap-4">
          <Button
            variant="outline"
            className="font-sans text-base font-normal flex items-center gap-2 rounded-full h-10 p-4 hover:bg-card/80"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="destructive"
            className="font-sans text-base font-normal flex items-center gap-2 rounded-full p-4 h-10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
