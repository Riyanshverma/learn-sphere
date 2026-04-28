import { Badge } from "@/components/ui/badge"

const dummyExams = [
  { id: 1, name: "Mid-Term Mathematics", date: "2026-05-10", type: "Main Exam", status: "Scheduled" },
  { id: 2, name: "Physics Unit Test", date: "2026-05-15", type: "Unit Test", status: "Scheduled" },
  { id: 3, name: "English Proficiency", date: "2026-04-28", type: "Assessment", status: "In Progress" },
  { id: 4, name: "Computer Science Quiz", date: "2026-04-25", type: "Quiz", status: "Completed" },
]

export const SchoolExamsAndResults = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyExams.map((exam) => (
          <div key={exam.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{exam.name}</h3>
              <p className="text-muted-foreground text-sm font-sans">{exam.type} • {exam.date}</p>
            </div>
            <Badge variant={exam.status === "Scheduled" ? "default" : exam.status === "In Progress" ? "secondary" : "outline"} className="rounded-none px-4 py-1">
              {exam.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
