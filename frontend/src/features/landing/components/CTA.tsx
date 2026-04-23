import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { MoveRight } from "lucide-react"

export const CTA = () => {
  return (
    <section className="py-20 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10"></div>
      
      <div className="container mx-auto max-w-5xl text-center bg-card/80 rounded-[2rem] p-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <h2 className="text-6xl font-heading font-normal">
            Ready to Transform Your <span className="text-primary">School?</span>
          </h2>
          <p className="text-2xl text-foreground max-w-5xl mx-auto font-sans font-light">
            Join The Learners Academy in digitizing operations, empowering teachers, and keeping parents connected.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center font-sans">
            <Button asChild className="rounded-full text-lg h-14 px-8 bg-primary hover:scale-105 transition-all duration-300">
              <Link to="/signup">
                Get Started Now <MoveRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}