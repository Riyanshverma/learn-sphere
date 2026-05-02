import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddTeacherInvitationSchema, type AddTeacherInvitationType } from "@/validation"
import { toast } from "sonner"
import { adminService } from "@/services"

export const AddTeacherInvitation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddTeacherInvitationType>({
    resolver: zodResolver(AddTeacherInvitationSchema),
  })

  const onSubmit = async (data: AddTeacherInvitationType) => {
    try {
      const result: any = await adminService.sendTeacherInvitation(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <div className="px-4 py-6 rounded-3xl bg-card/80 relative">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-end gap-6">
        <div className="space-y-2 font-sans flex-1 w-full">
          <Label htmlFor="full_name" className="text-base text-muted-foreground font-light">Teacher's Full Name</Label>
          <Input 
            id="full_name" 
            placeholder="e.g. Robert Wilson" 
            className="h-10 rounded-lg text-base font-light" 
            {...register("full_name")} 
          />
          {errors.full_name && <p className="text-sm text-destructive font-light">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-2 font-sans flex-1 w-full">
          <Label htmlFor="email" className="text-base text-muted-foreground font-light">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="teacher@school.com" 
            className="h-10 rounded-lg text-base font-light" 
            {...register("email")} 
          />
          {errors.email && <p className="text-sm text-destructive font-light">{errors.email.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="text-base font-sans font-light h-10 rounded-lg px-8"
        >
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </Button>
      </form>
    </div>
  )
}
