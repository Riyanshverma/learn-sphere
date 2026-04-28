import { Badge } from "@/components/ui/badge"

const dummyStaff = [
  { id: 1, name: "Marcus Aurelius", role: "Administrator", dept: "Management", status: "Active" },
  { id: 2, name: "Linda Gray", role: "Librarian", dept: "Library", status: "Active" },
  { id: 3, name: "Sam Wilson", role: "Security Head", dept: "Security", status: "Active" },
  { id: 4, name: "Janet Foster", role: "Accountant", dept: "Finance", status: "On Leave" },
]

export const SchoolStaff = () => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyStaff.map((staff) => (
          <div key={staff.id} className="p-6 rounded-3xl border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-heading">{staff.name}</h3>
              <p className="text-muted-foreground text-sm font-sans">{staff.role} • {staff.dept}</p>
            </div>
            <Badge variant={staff.status === "Active" ? "default" : "secondary"} className="rounded-none px-4 py-1">
              {staff.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
