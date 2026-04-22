import { LoginForm } from "@/features/authentication"

export const LoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background text-foreground rounded-2xl shadow-2xl p-8 md:p-12 border border-border">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-heading mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-lg font-sans">Sign in to your account to continue</p>
        </div>
        {/* <LoginForm /> */}
      </div>
    </div>
  )
}
