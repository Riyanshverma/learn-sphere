import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { UserOtpVerificationSchema, type UserOtpVerificationType, type UserLoginWithOtpType } from "@/validation"
import { userAuthService } from "@/services"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Info } from "lucide-react"

interface InputOtpDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  userLoginData: UserLoginWithOtpType | null
}

export const InputOtpDialog = ({ dialogOpen, setDialogOpen, userLoginData }: InputOtpDialogProps) => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserOtpVerificationType>({
    resolver: zodResolver(UserOtpVerificationSchema)
  })

  useEffect(() => {
    if (userLoginData && dialogOpen) {
      reset({
        email: userLoginData.email,
        phone: userLoginData.phone,
        otp: "00000000",
      })
    }
  }, [userLoginData, dialogOpen])

  const onSubmit = async (data: UserOtpVerificationType) => {
    try {
      const id = toast.loading('Verifying OTP...')
      const result = await userAuthService.verifyOtp(data)
      if (!result.success) {
        toast.dismiss(id)
        throw new Error(result.error, { cause: result.code })
      }

      navigate('/select-identity', { state: { identities: result.data } })
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-2xl bg-background/80 backdrop-blur-xl rounded-3xl space-y-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-normal">Verify OTP</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Enter the 6-digit code sent to your {userLoginData?.email ? "email" : "phone"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center">
          <div className="space-y-2 flex flex-col items-center w-full">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  maxLength={8}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="mr-4 font-sans font-light">
                    <InputOTPSlot index={0} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={1} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={2} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={3} className="h-12 w-12 text-lg border-foreground" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="ml-4 font-sans font-light">
                    <InputOTPSlot index={4} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={5} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={6} className="h-12 w-12 text-lg border-foreground" />
                    <InputOTPSlot index={7} className="h-12 w-12 text-lg border-foreground" />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            {errors.otp && (
              <p className="text-sm text-destructive font-sans">{errors.otp.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-destructive/10 p-4 font-sans text-sm text-destructive border border-destructive w-full">
            <Info className="h-4 w-4 shrink-0" />
            <p className="font-light">
              <span className="font-medium">Note:</span> If you have received the OTP through phone, leave the last two inputs as they are!!
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 h-10 font-sans text-base">
            {isSubmitting ? "Verifying..." : "Verify Identity"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
