import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { TeacherInvitationsResponse } from "@/types"
import { getInvitationStatusColor } from "@/utils"

interface TeacherInvitationDetailsDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  invitation: TeacherInvitationsResponse | null
}

export const TeacherInvitationDetailsDialog = ({ dialogOpen, setDialogOpen, invitation }: TeacherInvitationDetailsDialogProps) => {
  
  if (!invitation) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="dark sm:max-w-5xl bg-background backdrop-blur-xl rounded-3xl space-y-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-heading font-normal capitalize">
              {invitation.full_name}
            </DialogTitle>
            <Badge className={`${getInvitationStatusColor(invitation.status)} font-sans font-light text-sm`} variant="outline">
              {invitation.status}
            </Badge>
          </div>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Detailed information provided during the onboarding process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 font-sans font-light text-base">
          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Personal Information</h3>
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
                <p className="text-base">{invitation.phone?.slice(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-base">{new Date(invitation.date_of_birth as Date).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Residential Address</p>
                <p className="text-base">{invitation.address}</p>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Name</p>
                <p className="text-base capitalize">{invitation.emergency_contact?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Relation</p>
                <p className="text-base capitalize">{invitation.emergency_contact?.relation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Phone</p>
                <p className="text-base">{invitation.emergency_contact?.phone.slice(3)}</p>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1 ">
                <p className="text-sm text-muted-foreground">Qualifications</p>
                <p className="text-base capitalize">{invitation.qualification}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-base">{invitation.experience_years} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="text-base capitalize">{invitation.specialization}</p>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Identity Proof</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Aadhar Card</p>
                  <p className="text-base tracking-widest">{invitation.identity_proof?.aadhar_card.number}</p>
                </div>
                  <a href={invitation.identity_proof?.aadhar_card.url} target="_blank" rel="noreferrer" className="h-10 px-4 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/80 transition-colors">View</a>
              </div>
              <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">PAN Card</p>
                  <p className="text-base uppercase tracking-widest">{invitation.identity_proof?.pan_card.number}</p>
                </div>
                  <a href={invitation.identity_proof?.pan_card.url} target="_blank" rel="noreferrer" className="h-10 px-4 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/80 transition-colors">View</a>
              </div>
              <Separator className="col-span-3"/>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-heading font-normal text-foreground">Bank Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="text-base capitalize">{invitation.bank_details?.bank_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Holder</p>
                <p className="text-base capitalize">{invitation.bank_details?.account_holder_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="text-base tracking-widest">{invitation.bank_details?.account_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IFSC Code</p>
                <p className="text-base uppercase tracking-widest">{invitation.bank_details?.ifsc_code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="text-base capitalize">{invitation.bank_details?.account_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="text-base capitalize">{invitation.bank_details?.branch_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">UPI ID</p>
                <p className="text-base">{invitation.bank_details?.upi_id}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-3">
                <a href={invitation.bank_details?.cancelled_cheque_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-base">
                  View Cancelled Cheque
                </a>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
