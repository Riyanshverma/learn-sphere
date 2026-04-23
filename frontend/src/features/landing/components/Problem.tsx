import { Card, CardContent } from "@/components/ui/card"
import { FileWarning, Clock, UsersRound } from "lucide-react"

export const Problem = () => {
  return (
    <section id="problem" className="py-20 px-6 relative z-10">
      <div className="container mx-auto max-w-7xl space-y-16">
        <div className="text-center space-y-8">
          <h2 className="text-6xl font-heading font-normal">
            The Old Way is <span className="text-destructive">Holding You Back</span>
          </h2>
          <p className="text-2xl text-foreground max-w-6xl mx-auto font-sans font-light">
            Since 1993, manual processes have been the norm. It's time to evolve beyond the limitations of paper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {([
            {
              icon: <FileWarning className="w-10 h-10 text-destructive" />,
              title: "Paper-based Chaos",
              description: "Relying on manual registers and physical files leads to lost records, data entry errors, storage overhead."
            },
            {
              icon: <Clock className="w-10 h-10 text-primary" />,
              title: "Wasted Administrative Time",
              description: "Teachers and staff spend countless hours manually calculating attendance, generating results."
            },
            {
              icon: <UsersRound className="w-10 h-10 text-foreground" />,
              title: "Disconnected Comms",
              description: "Parents remain in dark about their child's progress until the end due to fragmented communication channels."
            }
          ] as const).map((problem, index) => (
            <Card key={index} className="bg-card/40 overflow-hidden group">
              <CardContent className="px-6 py-4 space-y-4">
                <div>
                  {problem.icon}
                </div>
                <h3 className="text-2xl font-heading font-normal">{problem.title}</h3>
                <p className="text-muted-foreground font-sans text-base leading-relaxed font-light">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
