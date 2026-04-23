import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Antigravity from "@/components/Antigravity"

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative container mx-auto px-6 pt-40 text-center w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Antigravity background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Antigravity />
      </div>
      
      {/* Content in front */}
      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
        <h1 className="text-8xl font-heading font-normal text-foreground">
          Manage Your School<br />
          with <span className="text-primary">LearnSphere</span>
        </h1>

        <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-sans font-light">
          Digitize manual workflows with automated scheduling, unified student records, and dedicated portals for every role.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center font-sans">
          <Button
            className="rounded-full text-lg h-14 px-8 hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Get Started <MoveRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
