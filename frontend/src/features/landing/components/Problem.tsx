import { Card, CardContent } from "@/components/ui/card"
import { FileWarning, Clock, UsersRound } from "lucide-react"

export const Problem = () => {
  const problems = [
    {
      icon: <FileWarning className="w-10 h-10 text-destructive mb-4" />,
      title: "Paper-based Chaos",
      description: "Relying on manual registers and physical files leads to lost records, data entry errors, and massive storage overhead."
    },
    {
      icon: <Clock className="w-10 h-10 text-primary mb-4" />,
      title: "Wasted Administrative Time",
      description: "Teachers and staff spend countless hours manually calculating attendance, generating results, and processing leave applications."
    },
    {
      icon: <UsersRound className="w-10 h-10 text-secondary-foreground mb-4" />,
      title: "Disconnected Communication",
      description: "Parents remain in the dark about their child's progress until the end of the term due to fragmented communication channels."
    }
  ]

  return (
    <section id="problem" className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight">
            The Old Way is <span className="text-destructive/80 italic">Holding You Back</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Since 1993, manual processes have been the norm. It's time to evolve beyond the limitations of paper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-colors duration-500 overflow-hidden group">
              <CardContent className="p-8">
                <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
                  {problem.icon}
                </div>
                <h3 className="text-2xl font-heading font-medium mb-3">{problem.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-destructive/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
    </section>
  )
}
