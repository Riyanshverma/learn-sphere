import { Badge } from "@/components/ui/badge"

const dummyClasses = [
  { id: 1, name: "Grade 10 - A", teacher: "Dr. Sarah Wilson", students: 32, status: "In Session" },
  { id: 2, name: "Grade 11 - B", teacher: "Mr. Robert Chen", students: 28, status: "In Session" },
  { id: 3, name: "Grade 9 - C", teacher: "Ms. Emily Davis", students: 30, status: "Lunch Break" },
  { id: 4, name: "Grade 12 - A", teacher: "Prof. James Miller", students: 25, status: "In Session" },
]

export const SchoolClasses = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyClasses.map((cls) => (
          <div key={cls.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{cls.name}</h3>
              <p className="text-muted-foreground text-sm font-sans">Teacher: {cls.teacher} • {cls.students} Students</p>
            </div>
            <Badge variant={cls.status === "In Session" ? "default" : "secondary"} className="rounded-none px-4 py-1">
              {cls.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
