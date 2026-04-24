import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full py-12 px-6 bg-background z-10 border-t border-border/50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-heading font-normal text-xl">
            LearnSphere
          </span>
        </div>
        
        <div className="flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-8 font-sans cursor-pointer">
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-light text-muted-foreground hover:text-foreground hover:bg-transparent">
                  Privacy Policy
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-light text-muted-foreground hover:text-foreground hover:bg-transparent">
                  Terms of Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-light text-muted-foreground hover:text-foreground hover:bg-transparent">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="text-base font-sans font-light text-muted-foreground">
          &copy; {currentYear} LearnSphere. All rights reserved.
        </div>
      </div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px] bg-linear-to-r from-transparent via-primary to-transparent"></div>
    </footer>
  )
}
