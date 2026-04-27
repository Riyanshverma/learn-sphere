import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { UserLoginSchema, type UserLoginType } from "@/validation"
import { userAuthService } from "@/services"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginType>({
    resolver: zodResolver(UserLoginSchema),
  })

  const onSubmit = async (data: UserLoginType) => {
    try {
      const result = await userAuthService.login(data as UserLoginType)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      toast.success(result.message)
      navigate('/select-identity', { state: { identities: result.data } })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-6">
          <div className="flex-1 space-y-2">
            <Label htmlFor="email" className="text-base font-normal font-heading">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="h-10 rounded-lg font-sans"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive font-sans">{errors.email.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base font-normal font-heading">
                Password
              </Label>
              <a href="#" className="text-base font-normal font-heading">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="h-10 rounded-lg font-sans"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive font-sans">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="text-base font-sans h-10 rounded-full px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  )
}
