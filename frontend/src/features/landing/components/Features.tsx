import { Card, CardContent } from "@/components/ui/card"
import { Shield, BookOpen, UserCircle, Users } from "lucide-react"

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight">
            One Platform. <span className="text-primary">Four Portals.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Tailored experiences for every role in the school ecosystem, ensuring secure and relevant access to data.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Admin - Large Feature (Spans 2 cols, 2 rows) */}
          <Card className="md:col-span-2 md:row-span-2 bg-card/40 backdrop-blur-sm border-border/50 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <Shield className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-3xl font-heading font-medium mb-4">Admin Control Center</h3>
                <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-6">
                  Complete, unrestricted control over the platform. Manage enrollments, configure academic years, oversee leave applications, and analyze school-wide performance from a single dashboard.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> User & Enrollment Management</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Academic Structure Setup</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Exam & Result Oversight</li>
              </ul>
            </CardContent>
          </Card>

          {/* Teacher - Medium Feature (Spans 2 cols, 1 row) */}
          <Card className="md:col-span-2 md:row-span-1 bg-card/40 backdrop-blur-sm border-border/50 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-chart-2/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 flex items-start gap-6 relative z-10">
              <div className="shrink-0 mt-1">
                <BookOpen className="w-10 h-10 text-chart-2" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-medium mb-2">Teacher Workspace</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  Mark daily attendance, enter exam marks, publish results, and view assigned class rosters without the paperwork.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parent - Small Feature (Spans 1 col, 1 row) */}
          <Card className="md:col-span-1 md:row-span-1 bg-card/40 backdrop-blur-sm border-border/50 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tl from-chart-3/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
              <Users className="w-8 h-8 text-chart-3 mb-4" />
              <h3 className="text-xl font-heading font-medium mb-2">Parent Portal</h3>
              <p className="text-sm text-muted-foreground font-sans">
                Monitor child's attendance, view exam results, and join parent-teacher meetings.
              </p>
            </CardContent>
          </Card>

          {/* Staff - Small Feature (Spans 1 col, 1 row) */}
          <Card className="md:col-span-1 md:row-span-1 bg-card/40 backdrop-blur-sm border-border/50 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-bl from-chart-4/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
              <UserCircle className="w-8 h-8 text-chart-4 mb-4" />
              <h3 className="text-xl font-heading font-medium mb-2">Staff Self-Service</h3>
              <p className="text-sm text-muted-foreground font-sans">
                Track personal attendance and seamlessly apply for leaves.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
