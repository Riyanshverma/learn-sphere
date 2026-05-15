import { 
  Command, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"
import type { SearchedTeachersResponse } from "@/types"
import { capitalizeWords } from "@/utils"

interface SearchedTeacherInfoProps {
  teachers: SearchedTeachersResponse[] | null
  onSelect: (teacher: SearchedTeachersResponse) => void
}

export const SearchedTeachersInfo = ({ teachers, onSelect }: SearchedTeacherInfoProps) => {
  if (!teachers || teachers.length === 0) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-full z-10 rounded-lg border border-foreground text-foreground">
      <Command className="rounded-lg" shouldFilter={false}>
        <CommandList className="max-h-72 overflow-y-auto font-sans">
          <CommandGroup>
            {teachers.map((teacher) => (
              <CommandItem
                key={teacher.employee_id}
                onSelect={() => onSelect(teacher)}
                className="flex flex-col items-start justify-between cursor-pointer gap-1 hover:bg-primary/10"
              >
                <div className="flex flex-col w-full gap-1.5">
                  <span className="font-light text-foreground text-sm">
                    {capitalizeWords(teacher.full_name)} (+{teacher.phone}) | EMP{teacher.employee_code}
                  </span>
                  {[
                    { label: "Email", value: teacher.email, transform: "none" },
                    { label: "Qualification", value: teacher.qualification, transform: "capitalize" },
                    { label: "Specialization", value: teacher.specialization, transform: "capitalize" }
                  ].map((field) => (
                    <div key={field.label} className="flex items-center justify-between w-full text-xs font-light">
                      <span className="text-muted-foreground">{field.label}</span>
                      <span className={`text-foreground text-right ${field.transform}`}>{field.value}</span>
                    </div>
                  ))}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
