import { 
  Command, 
  CommandGroup, 
  CommandItem, 
  CommandList
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import type { SearchedStaffsResponse } from "@/types"
import { capitalizeWords } from "@/utils"

interface SearchedStaffsInfoProps {
  staffs: SearchedStaffsResponse[] | null
  onSelect: (staff: SearchedStaffsResponse) => void
}

export const SearchedStaffInfo = ({ staffs, onSelect }: SearchedStaffsInfoProps) => {
  if (!staffs || staffs.length === 0) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-full z-10 rounded-lg border border-foreground text-foreground">
      <Command className="rounded-lg" shouldFilter={false}>
        <CommandList className="max-h-72 overflow-y-auto font-sans">
          <CommandGroup>
            {staffs.map((staff) => (
              <CommandItem
                key={staff.employee_id}
                onSelect={() => onSelect(staff)}
                className="flex flex-col items-start justify-between cursor-pointer gap-1 hover:bg-primary/10"
              >
                <div className="flex flex-col w-full gap-1.5">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-light text-foreground text-sm">
                      {capitalizeWords(staff.full_name)} (+{staff.phone_number}) | EMP{staff.employee_code}
                    </span>
                    <Badge variant="outline" className="font-sans font-light capitalize h-5 text-sm">
                      {staff.designation}
                    </Badge>
                  </div>
                  {[
                    { label: "Email", value: staff.email, transform: "none" },
                    { label: "Leaves", value: `${staff.leaves.leaves_taken} / ${staff.leaves.total_leaves_per_year}`, transform: "none" }
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
