import type { EmployeesPayrollsDetailsResponse } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { adminService } from "@/services"

interface EmployeesPayrollsByCashDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: "cash" | "online" | null) => void
  employeepayrollDetails: EmployeesPayrollsDetailsResponse | null
  fetchEmployeesPayrollsDetails: () => Promise<void>
}

export const EmployeesPayrollsByCashDialog = ({ dialogOpen, setDialogOpen, employeepayrollDetails, fetchEmployeesPayrollsDetails }: EmployeesPayrollsByCashDialogProps) => {
  if (!employeepayrollDetails) return null;

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  };

  const extraLeaves = Math.max(0, employeepayrollDetails.leaves.leaves_taken - employeepayrollDetails.leaves.total_leaves_per_month);
  const deductions = extraLeaves * 500;
  const netSalary = employeepayrollDetails.base_salary - deductions;

  const DialogDetailItem = ({ label, value, className = "" }: { label: string; value: React.ReactNode, className?: string }) => (
    <div className={`flex items-center gap-2 font-sans font-light ${className}`}>
      <span className="text-muted-foreground text-base block">{label}:</span>
      <span className="text-foreground text-base">{value}</span>
    </div>
  )

  const handleEmployeePayrollByCash = async () => {
    try {
      const id = toast.loading("Confirming transaction...")
      const result = await adminService.confirmEmployeePayrollByCash({ payroll_id: employeepayrollDetails.payroll_id, employee_id: employeepayrollDetails.employee_id, deductions, net_salary: netSalary });
      if (!result.success) {
        toast.dismiss(id);
        throw new Error(result.error, { cause: result.code })
      }

      setDialogOpen(null);
      await fetchEmployeesPayrollsDetails();
      toast.success(result.message, { id });
    } catch (error: any) {
      toast.error(error.message, { description: error.cause });
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(null)}>
      <DialogContent className="dark sm:max-w-3xl bg-background backdrop-blur-xl rounded-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-heading font-normal capitalize flex items-center gap-2">
              {employeepayrollDetails.full_name}
              <span className="text-muted-foreground text-xl">| EMP{employeepayrollDetails.employee_code}</span>
            </DialogTitle>
            <Badge className="font-sans font-light text-base capitalize px-4 py-1">
              Cash
            </Badge>
          </div>
          <DialogDescription className="font-sans text-muted-foreground font-light text-base">
            Confirm and record the manual cash payment to the employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 font-sans font-light text-base">
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DialogDetailItem label="Email" value={employeepayrollDetails.email} className="col-span-2"/>
              <DialogDetailItem label="Phone" value={employeepayrollDetails.phone.slice(2)} />
              <DialogDetailItem label="Salary For" value={<span className="capitalize">{getMonthName(employeepayrollDetails.payroll_month)}</span>} />
              <DialogDetailItem label="Due Date" value={<span className="text-destructive">{new Date(employeepayrollDetails.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>} className="col-span-2"/>
              <DialogDetailItem label="Leaves Taken" value={`${employeepayrollDetails.leaves.leaves_taken} day(s)`} />
            </div>
          </section>

          <Separator className="bg-muted-foreground"/>

          <section className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-base">Base Salary</span>
                <span className="text-foreground text-base">₹{employeepayrollDetails.base_salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-base">Deductions ({extraLeaves} extra leaves)</span>
                <span className="text-destructive text-base">
                  {deductions > 0 ? `-₹${deductions.toLocaleString()}` : "N/A"}
                </span>
              </div>

              <Separator/>

              <div className="flex justify-between items-center font-sans">
                <span className="text-foreground text-xl">Net Salary</span>
                <span className="text-foreground text-xl">₹{netSalary.toLocaleString()}</span>
              </div>
          </section>
        </div>

        <DialogFooter className="sm:justify-between items-center">
          <div className="text-xl font-heading font-normal text-foreground">
            Total: ₹{netSalary.toLocaleString()}
          </div>
          <Button
            onClick={handleEmployeePayrollByCash}
            className="h-10 px-8 rounded-lg font-sans font-normal text-base hover:bg-primary/60"
          >
            Pay Cash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
