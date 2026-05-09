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
import { StudentSignupSupabaseSchema, StudentSignupResendSchema, type StudentSignupSupabaseType, type StudentSignupResendType } from "@/validation"
import { toast } from "sonner"
import { userAuthService } from "@/services";
import { useNavigate } from "react-router-dom";

export const StudentSignup = ({ access_token, invite }: { access_token: string, invite: string }) => {  
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentSignupSupabaseType | StudentSignupResendType>({
    resolver: zodResolver((invite === "supabase") ? StudentSignupSupabaseSchema : StudentSignupResendSchema),
  })

  const onSubmit = async (data: StudentSignupSupabaseType | StudentSignupResendType) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      });

      const result = (invite === "supabase") ? await userAuthService.studentSignupWithSupabase(formData, access_token) : await userAuthService.studentSignupWithResend(formData, access_token)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      navigate('/login', { replace: true })
      toast.success(result.message, { description: "Wait for admin to allow your login" })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {invite === "supabase" && (
        <>
          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Parent Personal Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
              <div className="space-y-2 font-sans">
                <Label htmlFor="password" className="text-base text-muted-foreground font-light">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" className="h-10 rounded-lg text-base font-light" {...register("password")} />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {(errors as any).password && <p className="text-sm text-destructive font-light">{(errors as any).password.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="phone" className="text-base text-muted-foreground font-light">Phone Number</Label>
                <Input id="phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("phone")} />
                {(errors as any).phone && <p className="text-sm text-destructive font-light">{(errors as any).phone.message}</p>}
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
                {(errors as any).date_of_birth && <p className="text-sm text-destructive font-light">{(errors as any).date_of_birth.message}</p>}
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
                {(errors as any).gender && <p className="text-sm text-destructive font-light">{(errors as any).gender.message}</p>}
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
                {(errors as any).blood_group && <p className="text-sm text-destructive font-light">{(errors as any).blood_group.message}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Emergency Contact</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2 font-sans">
                <Label htmlFor="emergency_contact_name" className="text-base text-muted-foreground font-light">Contact Name</Label>
                <Input id="emergency_contact_name" placeholder="Jane Doe" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_name")} />
                {(errors as any).emergency_contact_name && <p className="text-sm text-destructive font-light">{(errors as any).emergency_contact_name.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="emergency_contact_relation" className="text-base text-muted-foreground font-light">Relation</Label>
                <Input id="emergency_contact_relation" placeholder="e.g. Spouse, Parent" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_relation")} />
                {(errors as any).emergency_contact_relation && <p className="text-sm text-destructive font-light">{(errors as any).emergency_contact_relation.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="emergency_contact_phone" className="text-base text-muted-foreground font-light">Contact Phone</Label>
                <Input id="emergency_contact_phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("emergency_contact_phone")} />
                {(errors as any).emergency_contact_phone && <p className="text-sm text-destructive font-light">{(errors as any).emergency_contact_phone.message}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Address Details</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
              <div className="space-y-2 font-sans col-span-2">
                <Label htmlFor="address" className="text-base text-muted-foreground font-light">Street Address</Label>
                <Input id="address" placeholder="123 Main St, Apartment 4B" className="h-10 rounded-lg text-base font-light" {...register("address")} />
                {(errors as any).address && <p className="text-sm text-destructive font-light">{(errors as any).address.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="city" className="text-base text-muted-foreground font-light">City</Label>
                <Input id="city" placeholder="Mumbai" className="h-10 rounded-lg text-base font-light" {...register("city")} />
                {(errors as any).city && <p className="text-sm text-destructive font-light">{(errors as any).city.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="state" className="text-base text-muted-foreground font-light">State</Label>
                <Input id="state" placeholder="Maharashtra" className="h-10 rounded-lg text-base font-light" {...register("state")} />
                {(errors as any).state && <p className="text-sm text-destructive font-light">{(errors as any).state.message}</p>}
              </div>

              <div className="space-y-2 font-sans">
                <Label htmlFor="pincode" className="text-base text-muted-foreground font-light">Pincode</Label>
                <Input id="pincode" type="tel" maxLength={6} placeholder="400001" className="h-10 rounded-lg text-base font-light" {...register("pincode")} />
                {(errors as any).pincode && <p className="text-sm text-destructive font-light">{(errors as any).pincode.message}</p>}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Shared Parent Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-heading font-normal text-foreground">Parent / Guardian Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2 font-sans">
            <Label htmlFor="occupation" className="text-base text-muted-foreground font-light">Occupation</Label>
            <Input id="occupation" placeholder="e.g. Software Engineer" className="h-10 rounded-lg text-base font-light" {...register("occupation")} />
            {errors.occupation && <p className="text-sm text-destructive font-light">{errors.occupation.message as string}</p>}
          </div>

          <div className="space-y-2 font-sans">
            <Label htmlFor="annual_income" className="text-base text-muted-foreground font-light">Annual Income (₹)</Label>
            <Input id="annual_income" type="number" placeholder="500000" className="h-10 rounded-lg text-base font-light" {...register("annual_income")} />
            {errors.annual_income && <p className="text-sm text-destructive font-light">{errors.annual_income.message as string}</p>}
          </div>

          <div className="space-y-2 font-sans">
            <Label htmlFor="student_relation" className="text-base text-muted-foreground font-light">Relation to Student</Label>
            <Input id="student_relation" placeholder="e.g. Father, Mother, Guardian" className="h-10 rounded-lg text-base font-light" {...register("student_relation")} />
            {errors.student_relation && <p className="text-sm text-destructive font-light">{errors.student_relation.message as string}</p>}
          </div>
        </div>
      </section>

      {/* Student Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-heading font-normal text-foreground">Student Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="space-y-2 font-sans col-span-2">
            <Label htmlFor="student_full_name" className="text-base text-muted-foreground font-light">Student Full Name</Label>
            <Input id="student_full_name" placeholder="John Doe Jr." className="h-10 rounded-lg text-base font-light" {...register("student_full_name")} />
            {errors.student_full_name && <p className="text-sm text-destructive font-light">{errors.student_full_name.message as string}</p>}
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
                    <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("2000-01-01")} captionLayout="dropdown" className="font-sans"/>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.student_date_of_birth && <p className="text-sm text-destructive font-light">{errors.student_date_of_birth.message as string}</p>}
          </div>

          <div className="space-y-2 font-sans">
            <Label htmlFor="student_gender" className="text-base text-muted-foreground font-light">Gender</Label>
            <Controller
              control={control}
              name="student_gender"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="font-sans">
                    <SelectItem value="male" className="text-base font-light">Male</SelectItem>
                    <SelectItem value="female" className="text-base font-light">Female</SelectItem>
                    <SelectItem value="other" className="text-base font-light">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.student_gender && <p className="text-sm text-destructive font-light">{errors.student_gender.message as string}</p>}
          </div>

          <div className="space-y-2 font-sans">
            <Label htmlFor="student_blood_group" className="text-base text-muted-foreground font-light">Blood Group</Label>
            <Controller
              control={control}
              name="student_blood_group"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="font-sans">
                    {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const).map((bg) => (
                      <SelectItem key={bg} value={bg} className="text-base font-light">{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.student_blood_group && <p className="text-sm text-destructive font-light">{errors.student_blood_group.message as string}</p>}
          </div>
          
          <div className="space-y-2 font-sans col-span-5">
            <Label htmlFor="student_medical_notes" className="text-base text-muted-foreground font-light">Medical Notes (Optional)</Label>
            <Textarea id="student_medical_notes" rows={2} placeholder="e.g. Asthma, Peanut Allergy" className="min-h-10 rounded-lg text-base font-light resize-none" {...register("student_medical_notes")} />
            {errors.student_medical_notes && <p className="text-sm text-destructive font-light">{errors.student_medical_notes.message as string}</p>}
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-6">
        <Button type="submit" className="text-base font-sans h-10 rounded-full px-12" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete Student Signup"}
        </Button>
      </div>
    </form>
  )
}
