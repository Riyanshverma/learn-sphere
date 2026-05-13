import { useAdminStore } from "@/store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { getRoleColor } from "@/utils"
import { ExternalLink, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { adminService } from "@/services"
import { toast } from "sonner"
import { useEffect } from "react"

export const AdminSettings = () => {
  const admin = useAdminStore((state) => state.admin)
  const navigate = useNavigate()
  const setMyAttendance = useAdminStore((state) => state.setMyAttendance)
  const myAttendance = useAdminStore((state) => state.myAttendance)

  const fetchMyAttendance = async () => {
    try {
      const result = await adminService.getMyAttendance(admin?.employee_id as string)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      setMyAttendance(result.data)
      toast.success(result.message)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if(!myAttendance) {
      fetchMyAttendance()
    }
  }, [myAttendance])

  if (!admin) {
    return (
      <div className="pt-32 pb-16 w-full flex items-center justify-center min-h-[400px]">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  const DetailItem = ({ label, value, className = "", capitalize = false }: { label: string; value: string | number | undefined; className?: string; capitalize?: boolean }) => (
    <div className={`space-y-1 ${className}`}>
      <p className="text-base text-muted-foreground font-light">{label}</p>
      <p className={`text-base font-normal ${capitalize ? 'capitalize' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  )

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-4xl font-heading font-normal text-foreground">Administrator Profile</h1>
          <div className="flex items-center gap-2">
            <Badge className={`font-sans font-light capitalize text-lg px-4 py-3 ${getRoleColor(admin.role)}`}>
              {admin.role}
            </Badge>
            <Badge 
              variant="outline" 
              className={`font-sans font-light text-lg px-4 py-3 ${admin.verified ? 'bg-green-950 text-green-300 border-green-300' : 'bg-yellow-950 text-yellow-300 border-yellow-300'}`}
            >
              {admin.verified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {admin.verified ? 'Verified' : 'Unverified'}
            </Badge>
            <Badge 
              variant="outline" 
              className={`font-sans font-light text-lg px-4 py-3 ${admin.active ? 'bg-green-950 text-green-300 border-green-300' : 'bg-red-950 text-red-300 border-red-300'}`}
            >
              {admin.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 font-sans">
        {/* Personal Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Personal Information</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                <DetailItem label="Full Name" value={admin.full_name} capitalize />
                <DetailItem label="Email Address" value={admin.email} className="col-span-2" />
                <DetailItem label="Phone Number" value={admin.phone.slice(2)} />
                <DetailItem label="Date of Birth" value={new Date(admin.date_of_birth).toLocaleDateString('en-GB')} />
                <DetailItem label="Gender" value={admin.gender} capitalize />
                <DetailItem label="Blood Group" value={admin.blood_group} />
                <DetailItem label="Residential Address" value={admin.address} className="col-span-1 md:col-span-2" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Professional Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Professional Information</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <DetailItem label="Designation" value={admin.designation} capitalize />
                <DetailItem label="Employee Code" value={`EMP${admin.employee_code}`} />
                <DetailItem label="Joined Date" value={new Date(admin.joined_date).toLocaleDateString('en-GB')} />
                <DetailItem label="Qualification" value={admin.qualification} capitalize />
                <DetailItem label="Experience" value={`${admin.experience_years} Years`} />
                <DetailItem label="Monthly Salary" value={`₹${admin.monthly_salary.toLocaleString()}`} />
                <DetailItem label="Specialization" value={admin.specialization} capitalize className="col-span-2"/>
                <DetailItem label="Timings" value={`${admin.timings.days.join(", ")} | ${admin.timings.from} - ${admin.timings.to}`} className="col-span-2 capitalize" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Emergency Contact */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Emergency Contact</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <DetailItem label="Contact Person" value={admin.emergency_contact.name} capitalize />
                <DetailItem label="Relation" value={admin.emergency_contact.relation} capitalize />
                <DetailItem label="Contact Phone" value={admin.emergency_contact.phone.slice(3)} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* // TODO: To be implemented - Leaves & Attendance */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Leaves & Attendance</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <DetailItem label="Leaves Taken - " value={`${admin.leaves.leaves_taken} / ${admin.leaves.total_leaves_per_year} days`} capitalize className="flex gap-2"/>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate('/admin/leave-applications', { state: { subTab: 'my-leaves' } })}
                      className="rounded-full hover:bg-primary group"
                    >
                      <ArrowUpRight className="text-foreground group-hover:text-primary transition-colors" />
                    </Button>
                  </div>
                  <Progress 
                    value={(admin.leaves.leaves_taken / admin.leaves.total_leaves_per_year) * 100} 
                    indicatorClassName="bg-destructive"
                    className="h-2 bg-destructive/10"
                  />
                </div>

                <Separator orientation="vertical" className="bg-muted-foreground" />

                <div className="flex-1 w-full">
                  {myAttendance === null ? (
                    <div className="flex items-center justify-center">
                      <Spinner className="size-6 text-primary" />
                    </div>
                  ) : myAttendance.length === 0 ? (
                      <p className="text-muted-foreground font-sans font-light text-base">
                        No attendance data recorded yet.
                      </p>
                  ) : (() => {
                      const presentCount = myAttendance.filter(a => a.status === 'present').length;
                      const totalCount = myAttendance.length;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <DetailItem label="Attendance - " value={`${presentCount} / ${totalCount} days`} capitalize className="flex gap-2"/>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigate('/admin/my-attendance')}
                              className="rounded-full hover:bg-primary group"
                            >
                              <ArrowUpRight className="text-foreground group-hover:text-primary transition-colors" />
                            </Button>
                          </div>
                          <Progress 
                            value={(presentCount / totalCount) * 100} 
                            indicatorClassName="bg-primary"
                            className="h-2 bg-primary/10"
                          />
                        </div>
                      )
                    })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bank Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Bank Details</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <DetailItem label="Account Holder" value={admin.bank_details?.account_holder_name} capitalize />
                <DetailItem label="Bank Name" value={admin.bank_details?.bank_name} capitalize />
                <DetailItem label="Branch Name" value={admin.bank_details?.branch_name} capitalize />
                <DetailItem label="Account Number" value={admin.bank_details?.account_number} />
                <DetailItem label="IFSC Code" value={admin.bank_details?.ifsc_code} />
                <DetailItem label="Account Type" value={admin.bank_details?.account_type} capitalize />
                <DetailItem label="UPI ID" value={admin.bank_details?.upi_id} />
                <div className="space-y-1">
                  <p className="text-base text-muted-foreground font-light">Cancelled Cheque</p>
                    <a 
                      href={admin.bank_details.cancelled_cheque_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base text-primary group"
                    >
                      View Document
                      <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Identity Proof */}
        <section className="space-y-4">
          <h3 className="text-xl font-heading font-normal text-foreground">Identity Proof</h3>
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <DetailItem label="Aadhar Card Number" value={admin.identity_proof?.aadhar_card.number} />
                <div className="space-y-1">
                  <p className="text-base text-muted-foreground font-light">Aadhar Document</p>
                    <a 
                      href={admin.identity_proof.aadhar_card.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base text-primary group"
                    >
                      View Aadhar
                      <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
                <DetailItem label="PAN Card Number" value={admin.identity_proof?.pan_card.number} />
                <div className="space-y-1">
                  <p className="text-base text-muted-foreground font-light">PAN Document</p>
                    <a 
                      href={admin.identity_proof.pan_card.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base text-primary group"
                    >
                      View PAN
                      <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
