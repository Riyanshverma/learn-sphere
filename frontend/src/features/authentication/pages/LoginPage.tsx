import { Footer } from "../components/Footer"
import Aurora from "@/components/Aurora"
import { LoginForm } from ".."

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-foreground text-foreground overflow-hidden">
      <main className="relative flex flex-1 flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Aurora
            colorStops={["#7cff67", "#B497CF", "#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
        </div>

        <div className="relative z-10 w-full max-w-xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-heading text-white">
              Welcome back
            </h1>
            <p className="text-xl text-white/50 font-sans">
              Log in to your account
            </p>
          </div>
          <div className="rounded-2xl bg-white border-2 border-primary px-6 py-4">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}