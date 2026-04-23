import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export const CTA = () => {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none -z-10"></div>
      
      <div className="container mx-auto max-w-4xl text-center bg-card/60 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-12 md:p-20 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-heading font-medium tracking-tight">
            Ready to Transform Your <span className="text-primary italic">School?</span>
          </h2>
          <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
            Join The Learners Academy in digitizing operations, empowering teachers, and keeping parents connected.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 font-sans">
            <Button asChild className="rounded-full text-lg h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300">
              <Link to="/signup">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full text-lg h-14 px-10 bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300">
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
