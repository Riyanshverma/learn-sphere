import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmployeesPayrollsByOnlineDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: "cash" | "online" | null) => void
}

export const EmployeesPayrollsByOnlineDialog = ({ dialogOpen, setDialogOpen }: EmployeesPayrollsByOnlineDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(null)}>
      <DialogContent className="max-w-2xl font-sans">
        <DialogHeader>
          {/* <DialogTitle className="text-2xl font-heading">Deposit Online - {payroll?.full_name}</DialogTitle> */}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground text-base font-light">
            This dialog will handle the online deposit process using RazorpayX. 
            Initiate the payout to the employee's linked bank account.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
