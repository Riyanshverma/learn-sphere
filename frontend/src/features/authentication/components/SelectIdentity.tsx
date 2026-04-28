import type { UserLoginResponse, CreateAdminResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { userAuthService } from "@/services"
import { useAdminStore } from "@/store"

export const SelectIdentity = ({ identities }: { identities: UserLoginResponse[] }) => {
  const setAdmin = useAdminStore((state) => state.setAdmin)
  const navigate = useNavigate()

  const handleIdentitySelect = async (identity: UserLoginResponse) => {
    try {
      const result = await userAuthService.getIdentityDetails(identity.identity_id, identity.role)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      if(result.data.role === 'admin') {
        setAdmin(result.data as CreateAdminResponse)
      } else if(result.data.role === 'teacher') {
        // TODO: Set the store for teacher...
      } else if(result.data.role === 'staff') {
        // TODO: Set the store for staff...
      }

      toast.success(result.message)
      navigate(`/${identity.role}/dashboard`)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {identities.map((identity) => (
          <Card key={identity.identity_id} className="relative mx-auto w-full overflow-hidden bg-background/20 backdrop-blur-xl border-foreground/10">
            <CardHeader className="relative aspect-video w-full bg-primary flex items-center justify-center p-6 rounded-none overflow-hidden">
              <div className="absolute top-2 right-2 flex flex-row gap-2 z-20">
                {identity.verified && (
                  <Badge className="text-foreground rounded-none font-sans text-base font-light bg-background">
                    Verified
                  </Badge>
                )}
                {identity.active && (
                  <Badge className="text-foreground rounded-none font-sans text-base font-light bg-background">
                    Active
                  </Badge>
                )}
              </div>
              <span className={`text-5xl font-heading font-normal text-background uppercase tracking-widest`}>
                {identity.role}
              </span>
            </CardHeader>

            <CardFooter className="bg-muted/5">
              <Button
                className="w-full bg-primary/20 hover:bg-primary text-primary text-lg font-heading tracking-widest hover:text-foreground rounded-lg h-12"
                onClick={() => handleIdentitySelect(identity)}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
