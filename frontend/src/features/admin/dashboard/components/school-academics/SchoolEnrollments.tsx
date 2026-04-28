import { Badge } from "@/components/ui/badge"

const dummyEnrollments = [
  { id: 1, student: "Ethan Hunt", grade: "10th", date: "2026-04-15", status: "Confirmed" },
  { id: 2, student: "Natasha Romanoff", grade: "11th", date: "2026-04-20", status: "Pending" },
  { id: 3, student: "Steve Rogers", grade: "9th", date: "2026-04-22", status: "Confirmed" },
  { id: 4, student: "Wanda Maximoff", grade: "12th", date: "2026-04-25", status: "Confirmed" },
]

export const SchoolEnrollments = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyEnrollments.map((enrollment) => (
          <div key={enrollment.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{enrollment.student}</h3>
              <p className="text-muted-foreground text-sm font-sans">Grade: {enrollment.grade} • Applied: {enrollment.date}</p>
            </div>
            <Badge variant={enrollment.status === "Confirmed" ? "default" : "secondary"} className="rounded-none px-4 py-1">
              {enrollment.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
