import { LoginFormWithPassword, LoginWithOtp } from ".."
import { Header, Footer } from "@/features/landing"
import Aurora from "@/components/Aurora"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export const LoginPage = () => {
  const [loginType, setLoginType] = useState<('otp' | 'password')>('password')

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Header onLoginPage={true} />
      
      <main className="relative flex-1 flex flex-col items-center justify-center pt-32 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora
            colorStops={["#7cff67", "#B497CF", "#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl px-6 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-heading font-normal text-foreground">
              Welcome <span className="text-primary">back</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-sans font-light max-w-lg mx-auto leading-relaxed">
              Log in to your account and continue managing your school with ease.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-background/20 backdrop-blur-md border border-foreground/10 rounded-full p-2 flex gap-4">
              <Button
                variant={loginType === 'password' ? 'default' : 'ghost'}
                className={`rounded-full px-4 h-10 text-sm font-sans font-normal ${loginType === 'password' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setLoginType('password')}
              >
                Password
              </Button>
              <Button
                variant={loginType === 'otp' ? 'default' : 'ghost'}
                className={`rounded-full font-sans font-normal px-4 h-10 text-sm ${loginType === 'otp' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setLoginType('otp')}
              >
                OTP
              </Button>
            </div>
          </div>
          
          <div className="rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/20 px-6 py-4 min-h-[290px] flex items-center">
            {loginType === 'password' ? <LoginFormWithPassword /> : <LoginWithOtp />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}