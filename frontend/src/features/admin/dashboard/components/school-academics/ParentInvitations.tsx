import { toast } from "sonner"
import type { ParentInvitationsResponse } from "@/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInvitationStatusColor } from "@/utils"
import { adminService } from "@/services"
import { useState, useRef } from "react"
import { ParentInvitationDetailsDialog, StudentSelectClassDialog } from "@/features/admin"

export const ParentInvitations = ({ parentInvitations, fetchParentInvitations }: { parentInvitations: ParentInvitationsResponse[], fetchParentInvitations: () => Promise<void> }) => {
  const [parentInvitationDetailsDialogOpen, setParentInvitationDetailsDialogOpen] = useState<boolean>(false)
  const [selectStudentClassDialogOpen, setSelectStudentClassDialogOpen] = useState<boolean>(false)
  const selectedInvitation = useRef<ParentInvitationsResponse | null>(null)

  const handleInvitationRevokeClick = async (invitation: ParentInvitationsResponse) => {
    try {
      const id = toast.loading('Revoking parent invitation...')
      const result = await adminService.updateInvitationStatus(invitation.invitation_id, "revoked");
      if (!result.success) {
        toast.dismiss(id)
        throw new Error(result.error, { cause: result.code });
      }

      await fetchParentInvitations();
      toast.success(result.message, { id })
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  const handleSelectClassClick = (invitation: ParentInvitationsResponse) => {
    selectedInvitation.current = invitation
    setSelectStudentClassDialogOpen(true)
  }

  const handleShowDetailsClick = (invitation: ParentInvitationsResponse) => {
    selectedInvitation.current = invitation
    setParentInvitationDetailsDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
      {parentInvitations.map((invitation) => (
        <Card key={invitation.invitation_id} className="w-full">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-heading font-normal capitalize">
                  {invitation.full_name}
                </CardTitle>
                <Badge className={`${getInvitationStatusColor(invitation.status)} font-sans font-light text-sm capitalize`} variant="outline">
                  {invitation.status}
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
                onClick={() => handleSelectClassClick(invitation)}
                className="rounded-3xl px-4 font-light cursor-pointer hover:bg-primary/80"
                disabled={invitation.status !== "accepted"}
              >
                Select Class
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleShowDetailsClick(invitation)}
                className="rounded-3xl px-4 font-light"
                disabled={invitation.status !== "accepted"}
              >
                Show Details
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleInvitationRevokeClick(invitation)}
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
      <ParentInvitationDetailsDialog 
        dialogOpen={parentInvitationDetailsDialogOpen} 
        setDialogOpen={setParentInvitationDetailsDialogOpen} 
        invitation={selectedInvitation.current} 
      />
      <StudentSelectClassDialog 
        dialogOpen={selectStudentClassDialogOpen} 
        setDialogOpen={setSelectStudentClassDialogOpen} 
        invitation={selectedInvitation.current} 
        fetchParentInvitations={fetchParentInvitations}
      />
    </>
  )
}
