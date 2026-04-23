export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full py-12 px-6 mt-12 bg-background z-10 border-t border-border/50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-heading text-xs">
            L
          </div>
          <span className="font-heading font-medium tracking-tight text-foreground">
            LearnSphere
          </span>
        </div>
        
        <div className="flex gap-8 text-sm font-sans text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>

        <div className="text-sm font-sans text-muted-foreground">
          &copy; {currentYear} LearnSphere. All rights reserved.
        </div>
      </div>
      
      {/* Decorative fading line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </footer>
  )
}
