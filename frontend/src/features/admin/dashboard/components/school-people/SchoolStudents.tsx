import { Badge } from "@/components/ui/badge"

const dummyStudents = [
  { id: 1, name: "Alice Thompson", grade: "10th A", rollNo: "101", status: "Active" },
  { id: 2, name: "Ben Johnson", grade: "9th B", rollNo: "042", status: "Active" },
  { id: 3, name: "Chloe Smith", grade: "12th C", rollNo: "215", status: "Inactive" },
  { id: 4, name: "Daniel Lee", grade: "11th A", rollNo: "156", status: "Active" },
]

export const SchoolStudents = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyStudents.map((student) => (
          <div key={student.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{student.name}</h3>
              <p className="text-muted-foreground text-sm font-sans">Grade {student.grade} • Roll No: {student.rollNo}</p>
            </div>
            <Badge variant={student.status === "Active" ? "default" : "destructive"} className="rounded-none px-4 py-1">
              {student.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
