import { Badge } from "@/components/ui/badge"

const dummyTeachers = [
  { id: 1, name: "Dr. Sarah Wilson", specialization: "Mathematics", status: "Active", experience: "12 years" },
  { id: 2, name: "Prof. James Miller", specialization: "Physics", status: "On Leave", experience: "8 years" },
  { id: 3, name: "Ms. Emily Davis", specialization: "English Literature", status: "Active", experience: "5 years" },
  { id: 4, name: "Mr. Robert Chen", specialization: "Computer Science", status: "Active", experience: "10 years" },
]

export const SchoolTeachers = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyTeachers.map((teacher) => (
          <div key={teacher.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{teacher.name}</h3>
              <p className="text-muted-foreground text-sm font-sans">{teacher.specialization} • {teacher.experience}</p>
            </div>
            <Badge variant={teacher.status === "Active" ? "default" : "secondary"} className="rounded-none px-4 py-1">
              {teacher.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
