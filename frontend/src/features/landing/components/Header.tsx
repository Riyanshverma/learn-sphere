import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

export const Header = () => {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-3 bg-background/40 backdrop-blur-md border border-border/50 shadow-2xl rounded-full w-full max-w-5xl pointer-events-auto transition-all duration-300 hover:bg-background/60">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-heading group-hover:scale-105 transition-transform">
              L
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight hidden sm:inline-block">
              LearnSphere
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink href="#problem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
                  The Problem
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
                  How it Works∫
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Log in
          </Link>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-10 shadow-lg shadow-primary/20">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
        
      </div>
    </header>
  )
}
