import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { StudentWithNewParentSchema, type StudentWithNewParentType } from "@/validation"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useNavigate } from "react-router-dom"

export const AddStudentWithNewParent = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentWithNewParentType>({
    resolver: zodResolver(StudentWithNewParentSchema),
  })

  const onSubmit = async (data: StudentWithNewParentType) => {
     try {
      const result = await adminService.addNewstudent(data);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Parent Personal Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="space-y-2 font-sans">
              <Label htmlFor="full_name" className="text-base text-muted-foreground font-light">Full Name</Label>
              <Input id="full_name" placeholder="John Doe" className="h-10 rounded-lg text-base font-light" {...register("full_name")} />
              {errors.full_name && <p className="text-sm text-destructive font-light">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="email" className="text-base text-muted-foreground font-light">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="h-10 rounded-lg text-base font-light" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive font-light">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="password" className="text-base text-muted-foreground font-light">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" className="h-10 rounded-lg text-base font-light" {...register("password")} />
                <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive font-light">{errors.password.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="phone" className="text-base text-muted-foreground font-light">Phone Number</Label>
              <Input id="phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive font-light">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="date_of_birth" className="text-base text-muted-foreground font-light">Date of Birth</Label>
              <Controller
                control={control}
                name="date_of_birth"
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
              {errors.date_of_birth && <p className="text-sm text-destructive font-light">{errors.date_of_birth.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="gender" className="text-base text-muted-foreground font-light">Gender</Label>
              <Controller
                control={control}
                name="gender"
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
              {errors.gender && <p className="text-sm text-destructive font-light">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="blood_group" className="text-base text-muted-foreground font-light">Blood Group</Label>
              <Controller
                control={control}
                name="blood_group"
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
              {errors.blood_group && <p className="text-sm text-destructive font-light">{errors.blood_group.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Emergency Contact</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2 font-sans">
              <Label htmlFor="emergency_contact_name" className="text-base text-muted-foreground font-light">Contact Name</Label>
              <Input id="emergency_contact_name" placeholder="Jane Doe" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_name")} />
              {errors.emergency_contact_name && <p className="text-sm text-destructive font-light">{errors.emergency_contact_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="emergency_contact_relation" className="text-base text-muted-foreground font-light">Relation</Label>
              <Input id="emergency_contact_relation" placeholder="e.g. Spouse, Parent" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_relation")} />
              {errors.emergency_contact_relation && <p className="text-sm text-destructive font-light">{errors.emergency_contact_relation.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="emergency_contact_phone" className="text-base text-muted-foreground font-light">Contact Phone</Label>
              <Input id="emergency_contact_phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_phone")} />
              {errors.emergency_contact_phone && <p className="text-sm text-destructive font-light">{errors.emergency_contact_phone.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Address Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="address" className="text-base text-muted-foreground font-light">Street Address</Label>
              <Input id="address" placeholder="123 Main St, Apartment 4B" className="h-10 rounded-lg text-base font-light" {...register("address")} />
              {errors.address && <p className="text-sm text-destructive font-light">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="city" className="text-base text-muted-foreground font-light">City</Label>
              <Input id="city" placeholder="Mumbai" className="h-10 rounded-lg text-base font-light" {...register("city")} />
              {errors.city && <p className="text-sm text-destructive font-light">{errors.city.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="state" className="text-base text-muted-foreground font-light">State</Label>
              <Input id="state" placeholder="Maharashtra" className="h-10 rounded-lg text-base font-light" {...register("state")} />
              {errors.state && <p className="text-sm text-destructive font-light">{errors.state.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="pincode" className="text-base text-muted-foreground font-light">Pincode</Label>
              <Input id="pincode" type="tel" maxLength={6} placeholder="400001" className="h-10 rounded-lg text-base font-light" {...register("pincode")} />
              {errors.pincode && <p className="text-sm text-destructive font-light">{errors.pincode.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Parent Specific Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2 font-sans">
              <Label htmlFor="occupation" className="text-base text-muted-foreground font-light">Occupation</Label>
              <Input id="occupation" placeholder="Software Engineer" className="h-10 rounded-lg text-base font-light" {...register("occupation")} />
              {errors.occupation && <p className="text-sm text-destructive font-light">{errors.occupation.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="annual_income" className="text-base text-muted-foreground font-light">Annual Income (₹)</Label>
              <Input id="annual_income" type="number" placeholder="1000000" className="h-10 rounded-lg text-base font-light" {...register("annual_income", { valueAsNumber: true })} />
              {errors.annual_income && <p className="text-sm text-destructive font-light">{errors.annual_income.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="student_relation" className="text-base text-muted-foreground font-light">Relation to Student</Label>
              <Input id="student_relation" placeholder="Father" className="h-10 rounded-lg text-base font-light" {...register("student_relation")} />
              {errors.student_relation && <p className="text-sm text-destructive font-light">{errors.student_relation.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Student Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="student_full_name" className="text-base text-muted-foreground font-light">Full Name</Label>
              <Input id="student_full_name" placeholder="Alice Doe" className="h-10 rounded-lg text-base font-light" {...register("student_full_name")} />
              {errors.student_full_name && <p className="text-sm text-destructive font-light">{errors.student_full_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans ">
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
            {isSubmitting ? "Creating Profiles..." : "Add Student & Parent"}
          </Button>
        </div>
      </form>
    </div>
  )
}
