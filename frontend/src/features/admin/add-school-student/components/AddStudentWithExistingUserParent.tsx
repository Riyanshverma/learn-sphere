import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { StudentWithExistingUserParentSchema, type StudentWithExistingUserParentType } from "@/validation"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useNavigate } from "react-router-dom"

export const AddStudentWithExistingUserParent = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentWithExistingUserParentType>({
    resolver: zodResolver(StudentWithExistingUserParentSchema),
  })

  const onSubmit = async (data: StudentWithExistingUserParentType) => {
     try {
       const result = await adminService.addStudentWithExistingUserParent(data);
       if (!result.success) {
         throw new Error(result.error, { cause: result.code });
       }

       navigate('/admin/dashboard', { state: { tab: "people", subTab: "school-students" } });
       toast.success(result.message);
     } catch (error: any) {
       toast.error(error.message, { description: error.cause });
     }
  }

  return (
    <div className="px-4 py-6 rounded-3xl bg-card/80">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Parent Verification</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 font-sans">
              <Label htmlFor="email" className="text-base text-muted-foreground font-light">Parent Email</Label>
              <Input id="email" type="email" placeholder="parent@example.com" className="h-10 rounded-lg text-base font-light" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive font-light">{errors.email.message}</p>}
              <p className="text-sm font-light text-primary">This email must already exist.</p>
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="phone" className="text-base text-muted-foreground font-light">Parent Phone Number</Label>
              <Input id="phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive font-light">{errors.phone.message}</p>}
              <p className="text-sm font-light text-primary">This phone must already exist.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Parent Specific Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2 font-sans">
              <Label htmlFor="occupation" className="text-base text-muted-foreground font-light">Occupation</Label>
              <Input id="occupation" placeholder="Doctor" className="h-10 rounded-lg text-base font-light" {...register("occupation")} />
              {errors.occupation && <p className="text-sm text-destructive font-light">{errors.occupation.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="annual_income" className="text-base text-muted-foreground font-light">Annual Income (₹)</Label>
              <Input id="annual_income" type="number" placeholder="1500000" className="h-10 rounded-lg text-base font-light" {...register("annual_income", { valueAsNumber: true })} />
              {errors.annual_income && <p className="text-sm text-destructive font-light">{errors.annual_income.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="student_relation" className="text-base text-muted-foreground font-light">Relation to Student</Label>
              <Input id="student_relation" placeholder="Mother" className="h-10 rounded-lg text-base font-light" {...register("student_relation")} />
              {errors.student_relation && <p className="text-sm text-destructive font-light">{errors.student_relation.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Student Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="student_full_name" className="text-base text-muted-foreground font-light">Full Name</Label>
              <Input id="student_full_name" placeholder="Bob Smith" className="h-10 rounded-lg text-base font-light" {...register("student_full_name")} />
              {errors.student_full_name && <p className="text-sm text-destructive font-light">{errors.student_full_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="student_date_of_birth" className="text-base text-muted-foreground font-light">Date of Birth</Label>
              <Controller
                control={control}
                name="student_date_of_birth"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("h-10 w-full justify-start rounded-lg text-left font-light", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (field.value as Date).toLocaleDateString() : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} captionLayout="dropdown" className="font-sans"/>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.student_date_of_birth && <p className="text-sm text-destructive font-light">{errors.student_date_of_birth.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="student_gender" className="text-base text-muted-foreground font-light">Gender</Label>
              <Controller
                control={control}
                name="student_gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="font-sans">
                      <SelectItem value="male" className="text-base font-light">Male</SelectItem>
                      <SelectItem value="female" className="text-base font-light">Female</SelectItem>
                      <SelectItem value="other" className="text-base font-light">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.student_gender && <p className="text-sm text-destructive font-light">{errors.student_gender.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="student_blood_group" className="text-base text-muted-foreground font-light">Blood Group</Label>
              <Controller
                control={control}
                name="student_blood_group"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="font-sans">
                      {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const).map((bg) => (
                        <SelectItem key={bg} value={bg} className="text-base font-light">{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.student_blood_group && <p className="text-sm text-destructive font-light">{errors.student_blood_group.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
               <Label htmlFor="class" className="text-base text-muted-foreground font-light">Class</Label>
               <Controller
                 control={control}
                 name="class"
                 render={({ field }) => (
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light"><SelectValue placeholder="Select Class" /></SelectTrigger>
                     <SelectContent className="font-sans">
                       <SelectItem value="1A" className="text-base font-light">1A</SelectItem>
                       <SelectItem value="2A" className="text-base font-light">2A</SelectItem>
                       <SelectItem value="3A" className="text-base font-light">3A</SelectItem>
                     </SelectContent>
                   </Select>
                 )}
               />
               {errors.class && <p className="text-sm text-destructive font-light">{errors.class.message}</p>}
            </div>

            <div className="space-y-2 font-sans col-span-full">
              <Label htmlFor="student_medical_notes" className="text-base text-muted-foreground font-light">Medical Notes (Optional)</Label>
              <Textarea id="student_medical_notes" placeholder="Any allergies or medical conditions..." className="min-h-20 rounded-lg text-base font-light resize-none" {...register("student_medical_notes")} />
              {errors.student_medical_notes && <p className="text-sm text-destructive font-light">{errors.student_medical_notes.message}</p>}
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Button type="submit" className="text-base font-sans h-10 rounded-full px-8" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Add Student Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}
