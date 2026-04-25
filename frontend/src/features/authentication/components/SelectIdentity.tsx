import { type userLoginResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const SelectIdentity = ({ identities }: { identities: userLoginResponse[] }) => {
  const handleSelect = (identity: userLoginResponse) => {
    // TODO: Implement selection logic (set active identity/role)
    console.log("Selected identity:", identity)
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
              <span className={`text-5xl font-heading font-normal text-foreground uppercase tracking-widest animate-in fade-in zoom-in duration-1000`}>
                {identity.role}
              </span>
            </CardHeader>

            <CardFooter className="bg-muted/5">
              <Button
                className="w-full bg-primary/20 hover:bg-primary text-primary text-lg font-heading tracking-widest hover:text-foreground transition-all duration-300 rounded-lg h-12"
                onClick={() => handleSelect(identity)}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
