import { toast } from "sonner"
import type { TeacherInvitationsResponse } from "@/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { capitalizeWords, getInvitationStatusColor } from "@/utils"

export const TeacherInvitations = ({ teacherInvitations }: { teacherInvitations: TeacherInvitationsResponse[] }) => {
  
  const handleChangeInvitationClick = async () => {
    try {

    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  

  return (
    <div className="grid grid-cols-1 gap-4">
      {teacherInvitations.map((invitation) => (
        <Card key={invitation.user_id} className="w-full">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-heading font-normal">
                  {capitalizeWords(invitation.full_name)}
                </CardTitle>
                <Badge className={`${getInvitationStatusColor(invitation.status)} font-sans font-light text-sm`} variant="outline">
                  {capitalizeWords(invitation.status)}
                </Badge>
                <Badge variant="secondary" className="font-sans font-light capitalize text-sm">
                  {invitation.role}
                </Badge>
              </div>
              <CardDescription className="font-sans font-light text-base">
                Sent at {new Date(invitation.created_at).toLocaleString("en-GB", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                })}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-base font-sans font-light">
              <span className="text-muted-foreground">Email: </span>
              {invitation.email}
            </div>
            <div className="flex items-center gap-4 font-sans">
              <Button 
                variant="default"
                className="rounded-3xl px-4 font-light cursor-pointer hover:bg-primary/80"
                disabled={invitation.status !== "accepted"}
              >
                Allow
              </Button>
              <Button 
                variant="outline" 
                className="rounded-3xl px-4 font-light"
                disabled={invitation.status !== "accepted"}
              >
                Show Details
              </Button>
              <Button 
                variant="destructive" 
                className="rounded-3xl px-4 font-light"
                disabled={invitation.status !== "accepted"}
              >
                Revoke
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}