import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmployeesPayrollsByCashDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: "cash" | "online" | null) => void
}

export const EmployeesPayrollsByCashDialog = ({ dialogOpen, setDialogOpen }: EmployeesPayrollsByCashDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(null)}>
      <DialogContent className="max-w-2xl font-sans">
        <DialogHeader>
          {/* <DialogTitle className="text-2xl font-heading">Pay Cash - {payroll?.full_name}</DialogTitle> */}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground text-base font-light">
            This dialog will handle the cash payment process for the employee. 
            Confirm the amount and update the payroll status once the cash is handed over.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
