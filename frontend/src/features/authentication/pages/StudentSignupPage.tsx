import { StudentSignup } from ".."
import { Header, Footer } from "@/features/landing"
import Aurora from "@/components/Aurora"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const access_token = new URLSearchParams(window.location.hash.slice(1)).get("access_token")
const invite = new URLSearchParams(window.location.search).get("invite")

if (access_token || invite) {
  window.history.replaceState(null, "", window.location.pathname)
}

export const StudentSignupPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // if (!access_token || !invite) {
    //   toast.error('Invalid or expired invite link.')
    //   navigate('/login', { replace: true })
    //   return
    // }
  }, [])

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Header onLoginPage={true} />
      
      <main className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora
            colorStops={["#7cff67", "#B497CF", "#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-heading font-normal text-foreground">
              Complete Student <span className="text-primary">Profile</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-sans font-light max-w-2xl mx-auto leading-relaxed">
              Welcome to Learn Sphere! Please provide details to complete your student enrollment.
            </p>
          </div>
          
          <div className="rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/20 px-6 py-4 flex items-center">
            <StudentSignup access_token={access_token as string} invite={invite as string} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
