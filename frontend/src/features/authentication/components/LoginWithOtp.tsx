import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserLoginWithOtpSchema, type UserLoginWithOtpType } from "@/validation"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { userAuthService } from "@/services"
import { useState, useRef } from "react"
import { InputOtpDialog } from ".."

export const LoginWithOtp = () => {
  const [inputOtpDialog, setInputOtpDialog] = useState<boolean>(false)
  const userLoginData = useRef<UserLoginWithOtpType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginWithOtpType>({
    resolver: zodResolver(UserLoginWithOtpSchema),
  })

  const onSubmit = async (data: UserLoginWithOtpType) => {
    try {
      const id = toast.loading('Sending OTP...')
      const result = await userAuthService.loginWithOtp(data)

      if (!result.success) {
        toast.dismiss(id)
        throw new Error(result.error, { cause: result.code })
      }
      userLoginData.current = data
      setInputOtpDialog(true)
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="email-otp" className="text-base font-normal font-heading">
                Email
              </Label>
              <Input
                id="email-otp"
                type="email"
                placeholder="m@example.com"
                className="h-10 rounded-lg font-sans"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-sans">{errors.email.message}</p>
              )}
            </div>

            <div className="flex items-center justify-center pt-8">
              <Separator orientation="vertical" className="md:block h-16 bg-foreground" />
            </div>

            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="phone-otp" className="text-base font-normal font-heading">
                Phone Number
              </Label>
              <Input
                id="phone-otp"
                type="tel"
                placeholder="+919876543210"
                maxLength={13}
                className="h-10 rounded-lg font-sans"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive font-sans">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="text-base font-sans h-10 rounded-full px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      </form>

      <InputOtpDialog 
        dialogOpen={inputOtpDialog} 
        setDialogOpen={setInputOtpDialog} 
        userLoginData={userLoginData.current} 
      />
    </div>
  )
}
