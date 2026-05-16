import { User, Mail, Phone } from "lucide-react"
import { capitalizeWords } from "@/utils"
import type { SearchedTeachersResponse } from "@/types"

interface SearchedTeacherDetailsProps {
  teacher: SearchedTeachersResponse | null
}

export const SearchedTeacherDetails = ({ teacher }: SearchedTeacherDetailsProps) => {
  if (!teacher) return null

  return (
    <div className="space-y-4 border border-primary/20 bg-primary/5 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { icon: User, label: "Full Name", value: capitalizeWords(teacher.full_name) },
          { icon: Mail, label: "Email Address", value: teacher.email },
          { icon: Phone, label: "Phone Number", value: teacher.phone },
        ].map((field) => (
          <div key={field.label} className="space-y-1.5 font-sans">
            <div className="text-sm flex items-center gap-2 text-muted-foreground font-light">
              <field.icon className="size-4" />
              {field.label}
            </div>
            <p className="text-base font-normal text-foreground">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
