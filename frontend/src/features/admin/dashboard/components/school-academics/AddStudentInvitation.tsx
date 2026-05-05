import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { InvitationSchema, type InvitationType } from "@/validation"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useNavigate } from "react-router-dom"

export const AddStudentInvitation = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationType>({
    resolver: zodResolver(InvitationSchema),
  })

  const onSubmit = async (data: InvitationType) => {
    try {
      const result: any = await adminService.sendStudentInvitation(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }

      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <div className="px-4 py-6 rounded-3xl bg-card/80 relative flex flex-col md:flex-row items-center gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-end gap-6 flex-1 w-full">
        <div className="space-y-2 font-sans flex-1 w-full">
          <Label htmlFor="full_name" className="text-base text-muted-foreground font-light">Parent's Full Name</Label>
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
            placeholder="parent@school.com" 
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

      <Separator orientation="vertical" className="hidden md:block bg-muted-foreground self-end" />

      <Button 
        onClick={() => navigate("/admin/add-school-student")}
        className="text-base font-sans font-light h-10 rounded-lg px-8 self-end"
      >
        Enter Manually
      </Button>
    </div>
  )
}
