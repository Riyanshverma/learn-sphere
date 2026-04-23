import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Antigravity from "@/components/Antigravity"

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative container mx-auto px-6 pt-40 pb-32 text-center w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Antigravity background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60">
        <Antigravity />
      </div>
      
      {/* Content in front */}
      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
        <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm px-5 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/20 transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Revolutionizing School Administration
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
          Manage Your School<br />
          with <span className="text-primary font-bold">LearnSphere</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-sans font-light">
          Digitize manual workflows with automated scheduling, unified student records, and dedicated portals for every role.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 font-sans">
          <Button
            className="rounded-full text-lg h-14 px-10 shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/signup")}
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full text-lg h-14 px-10 bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300"
          >
            View a Demo
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground/50 hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-current to-transparent mx-auto"></div>
      </div>
    </section>
  )
}
