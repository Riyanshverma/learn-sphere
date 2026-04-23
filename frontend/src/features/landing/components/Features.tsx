import { Card, CardContent } from "@/components/ui/card"
import { Shield, BookOpen, UserCircle, Users } from "lucide-react"

export const Features = () => {
  return (
    <section id="features" className="py-20 px-6 relative z-10">
      <div className="container mx-auto max-w-7xl space-y-12">
        <div className="text-center space-y-8">
          <h2 className="text-6xl font-heading font-normal">
            One Platform. <span className="text-primary">Four Portals.</span>
          </h2>
          <p className="text-2xl text-foreground max-w-6xl mx-auto font-sans font-light">
            Tailored experiences for every role in the school ecosystem, ensuring secure and relevant access to data.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[550px]">
          
          {/* Admin - Large Feature (Spans 2 cols, 2 rows) */}
          <Card className="md:col-span-2 md:row-span-2 bg-card/80 group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="px-6 py-4 h-full flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                <Shield className="w-12 h-12 text-chart-2" />
                <h3 className="text-2xl font-heading font-normal">Admin Control Center</h3>
                <p className="text-lg text-muted-foreground font-sans leading-relaxed font-light">
                  Complete, unrestricted control over the platform. Manage enrollments, configure academic years, oversee leave applications, and analyze school-wide performance from a single dashboard.
                </p>
              </div>
              <ul className="space-y-2 text-lg text-muted-foreground font-sans font-light">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> User & Enrollment Management</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Academic Structure Setup</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Exam & Result Oversight</li>
              </ul>
            </CardContent>
          </Card>

          {/* Teacher - Medium Feature (Spans 2 cols, 1 row) */}
          <Card className="md:col-span-2 md:row-span-1 bg-card/80 group overflow-hidden relative">
             <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="px-6 py-4 flex flex-col items-start relative z-10">
              <div className="space-y-4">
                <BookOpen className="w-10 h-10 text-chart-2" />
                <h3 className="text-2xl font-heading font-normal">Teacher Workspace</h3>
                <p className="text-lg text-muted-foreground font-sans leading-relaxed font-light">
                  Mark daily attendance, enter exam marks, publish results, and view assigned class rosters without the paperwork.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parent - Small Feature (Spans 1 col, 1 row) */}
          <Card className="md:col-span-1 md:row-span-1 bg-card/80 group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-tl from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="px-6 py-4 h-full flex flex-col items-start relative z-10 space-y-4">
              <Users className="w-8 h-8 text-chart-2" />
              <h3 className="text-2xl font-heading font-normal">Parent Portal</h3>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed font-light">
                Monitor child's attendance, view exam results, and join parent-teacher meetings.
              </p>
            </CardContent>
          </Card>

          {/* Staff - Small Feature (Spans 1 col, 1 row) */}
          <Card className="md:col-span-1 md:row-span-1 bg-card/40 backdrop-blur-sm border-border/50 group overflow-hidden relative">
             <div className="absolute inset-0 bg-linear-to-bl from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="px-6 py-4 h-full flex flex-col items-start relative z-10 space-y-4">
              <UserCircle className="w-8 h-8 text-chart-2" />
              <h3 className="text-2xl font-heading font-normal">Staff Self-Service</h3>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed font-light">
                Track personal attendance and seamlessly apply for leaves.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
