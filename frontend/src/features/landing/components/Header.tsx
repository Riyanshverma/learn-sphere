import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { MoveLeft } from "lucide-react"

export const Header = ({ onLoginPage = false }: { onLoginPage?: boolean}) => {
  const navigate = useNavigate()

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-between px-6 py-3 bg-background/40 backdrop-blur-md border border-foreground/60 rounded-full w-full max-w-7xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="font-heading font-normal text-xl">
              LearnSphere
            </span>
          </Link>
        </div>

        {!onLoginPage && (
          <div className="flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                <NavigationMenuItem>
                  <NavigationMenuLink href="#problem" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent px-6">
                    The Problem
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#how-it-works" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent px-6">
                    How it Works
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#features" className="text-base font-normal text-muted-foreground hover:text-foreground hover:bg-transparent px-6">
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center">
          {onLoginPage ? (
            <Button 
              onClick={() => navigate(-1)}
              className="rounded-full px-8 h-10 bg-foreground text-base font-sans text-background hover:bg-muted-foreground flex items-center gap-2"
            >
              <MoveLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <Button asChild className="rounded-full bg-primary text-base text-foreground px-8 h-10">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}