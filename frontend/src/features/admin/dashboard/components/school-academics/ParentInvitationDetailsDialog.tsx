import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ParentInvitationsResponse } from "@/types"
import { getInvitationStatusColor } from "@/utils"

interface ParentInvitationDetailsDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  invitation: ParentInvitationsResponse | null
}

export const ParentInvitationDetailsDialog = ({ dialogOpen, setDialogOpen, invitation }: ParentInvitationDetailsDialogProps) => {
  
  if (!invitation) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-5xl bg-background backdrop-blur-xl rounded-3xl space-y-2 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-heading font-normal capitalize">
              {invitation.full_name}
            </DialogTitle>
            <Badge className={`${getInvitationStatusColor(invitation.status)} font-sans font-light text-sm capitalize`} variant="outline">
              {invitation.status}
            </Badge>
          </div>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Detailed information provided during the student enrollment process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 font-sans font-light text-base">
          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Parent Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-base capitalize">{invitation.full_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="text-base">{invitation.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-base">{invitation.phone ? invitation.phone.slice(2) : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-base">{invitation.date_of_birth ? new Date(invitation.date_of_birth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="text-base capitalize">{invitation.occupation || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Annual Income</p>
                <p className="text-base">₹{invitation.annual_income?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Residential Address</p>
                <p className="text-base">{invitation.address || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Relation to Student</p>
                <p className="text-base capitalize">{invitation.student_relation || 'N/A'}</p>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Name</p>
                <p className="text-base capitalize">{invitation.emergency_contact?.name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Relation</p>
                <p className="text-base capitalize">{invitation.emergency_contact?.relation || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Phone</p>
                <p className="text-base">{invitation.emergency_contact?.phone ? invitation.emergency_contact.phone.slice(3) : 'N/A'}</p>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Student Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="text-base capitalize">{invitation.student_full_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-base">{invitation.student_date_of_birth ? new Date(invitation.student_date_of_birth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-base capitalize">{invitation.student_gender || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="text-base">{invitation.student_blood_group || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Admission Number</p>
                <p className="text-base">{invitation.admission_number || 'Pending'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Admission Date</p>
                <p className="text-base">{invitation.admission_date ? new Date(invitation.admission_date).toLocaleDateString() : 'Pending'}</p>
              </div>
              <div className="space-y-1 col-span-1 sm:col-span-3">
                <p className="text-sm text-muted-foreground">Medical Notes</p>
                <p className="text-base">{invitation.medical_notes || 'No medical notes provided.'}</p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
