import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

export const Header = () => {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-between px-6 py-3 bg-background/40 backdrop-blur-md border border-white/60 rounded-full w-full max-w-5xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="font-heading font-normal text-xl">
              LearnSphere
            </span>
          </Link>
        </div>
        <div className="flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink href="#problem" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent">
                  The Problem
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#how-it-works" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent">
                  How it Works
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#features" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent">
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA */}
        <div className="flex items-center">
          <Button asChild className="rounded-full bg-primary text-base text-foreground px-8 h-10">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
