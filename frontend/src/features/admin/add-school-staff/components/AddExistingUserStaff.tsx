import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ExistingUserAsStaffSchema, type ExistingUserAsStaffType } from "@/validation"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useNavigate } from "react-router-dom"

export const AddExistingUserStaff = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExistingUserAsStaffType>({
    resolver: zodResolver(ExistingUserAsStaffSchema),
  })

  const selectedDays = watch("timings_days")

  const toggleDay = (day: string) => {
    const current = selectedDays || []
    if (current.includes(day as any)) {
      setValue("timings_days", current.filter((d) => d !== day) as any)
    } else {
      setValue("timings_days", [...current, day] as any)
    }
  }

  const onSubmit = async (data: ExistingUserAsStaffType) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof ExistingUserAsStaffType];

        if (key.endsWith("_photo")) {
          formData.append(key, (value as FileList)[0]);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const result = await adminService.addExistingUserAsSchoolStaff(formData);

      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      navigate('/admin/dashboard', { state: { tab: "people", subTab: "school-staff" } });
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause });
    }
  }

  return (
    <div className="px-4 py-6 rounded-3xl bg-card/80">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">User Identification</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 font-sans">
              <Label htmlFor="email" className="text-base text-muted-foreground font-light">Existing User Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" className="h-10 rounded-lg text-base font-light" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive font-light">{errors.email.message}</p>}
              <p className="text-sm font-light text-primary">This email must already exist.</p>
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="phone" className="text-base text-muted-foreground font-light">Phone Number</Label>
              <Input id="phone" type="tel" maxLength={13} placeholder="+919876543210" className="h-10 rounded-lg text-base font-light" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive font-light">{errors.phone.message}</p>}
              <p className="text-sm font-light text-primary">This phone must already exist.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Professional Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="qualifications" className="text-base text-muted-foreground font-light">Qualifications</Label>
              <Textarea id="qualifications" rows={1} placeholder="e.g. B.Ed, M.Sc Mathematics" className="min-h-10 rounded-lg text-base font-light resize-none" {...register("qualifications")} />
              {errors.qualifications && <p className="text-sm text-destructive font-light">{errors.qualifications.message}</p>}
            </div>

            <div className="space-y-2 font-sans col-span-2">
              <Label htmlFor="specialization" className="text-base text-muted-foreground font-light">Specialization</Label>
              <Textarea id="specialization" rows={1} placeholder="e.g. Advanced Calculus, Physics" className="min-h-10 rounded-lg text-base font-light resize-none" {...register("specialization")} />
              {errors.specialization && <p className="text-sm text-destructive font-light">{errors.specialization.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="experience_years" className="text-base text-muted-foreground font-light">Experience (Years)</Label>
              <Input id="experience_years" type="number" min={0} defaultValue={0} className="h-10 rounded-lg text-base font-light" {...register("experience_years")} />
              {errors.experience_years && <p className="text-sm text-destructive font-light">{errors.experience_years.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="monthly_salary" className="text-base text-muted-foreground font-light">Monthly Salary (₹)</Label>
              <Input id="monthly_salary" type="number" min={0} defaultValue={5000} className="h-10 rounded-lg text-base font-light" {...register("monthly_salary")} />
              {errors.monthly_salary && <p className="text-sm text-destructive font-light">{errors.monthly_salary.message}</p>}
            </div>
          </div>
        </section>

        {/* --- Work Timings --- */}
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Work Timings</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 md:col-span-2 font-sans">
              <Label className="text-base text-muted-foreground font-light">Available Days</Label>
              <div className="flex flex-wrap gap-2">
                {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn("h-9 rounded-lg border px-4 font-sans text-sm transition-colors", selectedDays?.includes(day) ? "border-primary bg-primary text-primary-foreground": "border-foreground/20 bg-background text-foreground hover:bg-muted")}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.timings_days && <p className="text-sm text-destructive">{errors.timings_days.message}</p>}
            </div>
            <div className="space-y-2 font-sans">
              <Label htmlFor="timings_from" className="text-base text-muted-foreground font-light">Time From</Label>
              <Input id="timings_from" type="time" step="60" defaultValue="08:00" className="h-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none rounded-lg text-base font-light " {...register("timings_from")} />
              {errors.timings_from && <p className="text-sm text-destructive font-light">{errors.timings_from.message}</p>}
            </div>
            <div className="space-y-2 font-sans">
              <Label htmlFor="timings_to" className="text-base text-muted-foreground font-light">Time To</Label>
              <Input id="timings_to" type="time" step="60" defaultValue="16:00" className="h-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none rounded-lg text-base font-light " {...register("timings_to")} />
              {errors.timings_to && <p className="text-sm text-destructive font-light">{errors.timings_to.message}</p>}
            </div>
          </div>
        </section>

        {/* --- Identity Documents --- */}
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Identity Documents</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 font-sans">
              <Label htmlFor="aadhar_card_number" className="text-base text-muted-foreground font-light">Aadhar Number</Label>
              <Input id="aadhar_card_number" type="tel" maxLength={12} placeholder="123456789012" className="h-10 rounded-lg text-base font-light" {...register("aadhar_card_number")} />
              {errors.aadhar_card_number && <p className="text-sm text-destructive font-light">{errors.aadhar_card_number.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="aadhar_card_photo" className="text-base text-muted-foreground font-light">Upload Aadhar Photo</Label>
              <Input id="aadhar_card_photo" type="file" accept="image/*,.pdf" className="h-10 rounded-lg text-base font-light file:text-muted-foreground file:font-light file:cursor-pointer cursor-pointer" {...register("aadhar_card_photo")} />
              {errors.aadhar_card_photo && <p className="text-sm text-destructive font-light">{errors.aadhar_card_photo.message as string}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="pan_card_number" className="text-base text-muted-foreground font-light">PAN Number</Label>
              <Input id="pan_card_number" placeholder="ABCDE1234F" className="h-10 rounded-lg uppercase text-base font-light" {...register("pan_card_number")} />
              {errors.pan_card_number && <p className="text-sm text-destructive font-light">{errors.pan_card_number.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="pan_card_photo" className="text-base text-muted-foreground font-light">Upload PAN Photo</Label>
              <Input id="pan_card_photo" type="file" accept="image/*,.pdf" className="h-10 rounded-lg text-base font-light file:text-muted-foreground file:font-light file:cursor-pointer cursor-pointer" {...register("pan_card_photo")} />
              {errors.pan_card_photo && <p className="text-sm text-destructive font-light">{errors.pan_card_photo.message as string}</p>}
            </div>
          </div>
        </section>

        {/* --- Bank Details --- */}
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-normal text-foreground">Bank Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_account_holder_name" className="text-base text-muted-foreground font-light">Account Holder Name</Label>
              <Input id="bank_account_holder_name" placeholder="John Doe" className="h-10 rounded-lg text-base font-light" {...register("bank_account_holder_name")} />
              {errors.bank_account_holder_name && <p className="text-sm text-destructive font-light">{errors.bank_account_holder_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_account_type" className="text-base text-muted-foreground font-light">Account Type</Label>
              <Controller
                control={control}
                name="bank_account_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-10 rounded-lg text-base font-light"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="font-sans">
                      <SelectItem value="savings" className="text-base font-light">Savings</SelectItem>
                      <SelectItem value="current" className="text-base font-light">Current</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bank_account_type && <p className="text-sm text-destructive font-light">{errors.bank_account_type.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_name" className="text-base text-muted-foreground font-light">Bank Name</Label>
              <Input id="bank_name" placeholder="State Bank of India" className="h-10 rounded-lg text-base font-light" {...register("bank_name")} />
              {errors.bank_name && <p className="text-sm text-destructive font-light">{errors.bank_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_branch_name" className="text-base text-muted-foreground font-light">Branch Name</Label>
              <Input id="bank_branch_name" placeholder="Main Branch, Mumbai" className="h-10 rounded-lg text-base font-light" {...register("bank_branch_name")} />
              {errors.bank_branch_name && <p className="text-sm text-destructive font-light">{errors.bank_branch_name.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_ifsc_code" className="text-base text-muted-foreground font-light">IFSC Code</Label>
              <Input id="bank_ifsc_code" placeholder="SBIN0001234" className="h-10 rounded-lg uppercase text-base font-light" {...register("bank_ifsc_code")} />
              {errors.bank_ifsc_code && <p className="text-sm text-destructive font-light">{errors.bank_ifsc_code.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_account_number" className="text-base text-muted-foreground font-light">Account Number</Label>
              <Input id="bank_account_number" type="tel" placeholder="000012345678" className="h-10 rounded-lg text-base font-light" {...register("bank_account_number")} />
              {errors.bank_account_number && <p className="text-sm text-destructive font-light">{errors.bank_account_number.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_upi_id" className="text-base text-muted-foreground font-light">UPI ID</Label>
              <Input id="bank_upi_id" placeholder="johndoe@okaxis" className="h-10 rounded-lg text-base font-light" {...register("bank_upi_id")} />
              {errors.bank_upi_id && <p className="text-sm text-destructive font-light">{errors.bank_upi_id.message}</p>}
            </div>

            <div className="space-y-2 font-sans">
              <Label htmlFor="bank_cancelled_cheque_photo" className="text-base text-muted-foreground font-light">Upload Cancelled Cheque</Label>
              <Input id="bank_cancelled_cheque_photo" type="file" accept="image/*,.pdf" className="h-10 rounded-lg text-base font-light file:text-muted-foreground file:font-light file:cursor-pointer cursor-pointer" {...register("bank_cancelled_cheque_photo")} />
              {errors.bank_cancelled_cheque_photo && <p className="text-sm text-destructive font-light">{errors.bank_cancelled_cheque_photo.message as string}</p>}
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Button type="submit" className="text-base font-sans h-10 rounded-full px-8" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Add User as Staff"}
          </Button>
        </div>
      </form>
    </div>
  )
}
