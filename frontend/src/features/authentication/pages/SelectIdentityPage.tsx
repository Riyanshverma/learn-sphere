import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Header, Footer } from "@/features/landing"
import Aurora from "@/components/Aurora"
import { SelectIdentity } from ".."
import type { UserLoginResponse } from "@/types"

export const SelectIdentityPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const identities = location.state?.identities as UserLoginResponse[]

  useEffect(() => {
    if (!identities) {        
      navigate('/login', { replace: true })
    }
  }, [identities])

  if(!identities) return null

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Header onLoginPage={true} />
      
      <main className="relative flex-1 flex flex-col items-center justify-center pt-32 overflow-hidden">
        {/* Antigravity background matching Hero */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora
            colorStops={["#7cff67", "#B497CF", "#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
        </div>

        <div className="relative z-10 w-full space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-6xl font-heading font-normal text-foreground">
              Select your <span className="text-primary">identity</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-sans font-light mx-auto leading-relaxed">
              Choose the account you want to use.
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto w-full rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/20 px-6 py-8">
            <SelectIdentity identities={identities} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
