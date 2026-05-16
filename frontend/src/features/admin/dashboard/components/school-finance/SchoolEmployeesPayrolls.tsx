import { adminService } from "@/services"
import { useEffect, useState, useMemo, useRef } from "react"
import { toast } from "sonner"
import type { EmployeesPayrollsDetailsResponse } from "@/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { capitalizeWords, getPayrollStatusColor } from "@/utils"
import { EmployeesPayrollsByCashDialog, EmployeesPayrollsByOnlineDialog } from "@/features/admin"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

export const SchoolEmployeesPayrolls = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [limit, setLimit] = useState<string>("3")
  const [employeesPayrollsDetails, setEmployeesPayrollsDetails] = useState<EmployeesPayrollsDetailsResponse[] | null>(null);
  const [employeesPayrollsDialogOpen, setEmployeesPayrollsDialogOpen] = useState<"cash" | "online" | null>(null)
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "due">("all")
  const selectedEmployeePayrollDetailsRef = useRef<EmployeesPayrollsDetailsResponse | null>(null)

  const filteredPayrolls = useMemo(() => {
    if (!employeesPayrollsDetails) return null

    if (filter === "all") return employeesPayrollsDetails

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return employeesPayrollsDetails.filter((payroll) => {
      const dueDate = new Date(payroll.due_date)
      dueDate.setHours(0, 0, 0, 0)

      if (filter === "today") return dueDate.getTime() === today.getTime()
      if (filter === "upcoming") return dueDate.getTime() > today.getTime()
      if (filter === "due") return dueDate.getTime() < today.getTime()
      return true
    })
  }, [employeesPayrollsDetails, filter])

  const PayrollDetailItem = ({ label, value, className = "" }: { label: string; value: React.ReactNode, className?: string }) => (
    <div className={`flex items-center gap-2 font-sans font-light ${className}`}>
      <span className="text-muted-foreground text-base block">{label}:</span>
      <span className="text-foreground text-base">{value}</span>
    </div>
  )

  const fetchEmployeesPayrollsDetails = async () => {
    try {
      const result = await adminService.getEmployeesPayrollsDetails(pageNumber, limit)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      setEmployeesPayrollsDetails(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    fetchEmployeesPayrollsDetails();
  }, [pageNumber, limit]);

  return (
    <div className="space-y-6 relative">
      <div className="absolute -top-[64px] right-[348px] flex items-center">
          <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
            <SelectTrigger className="rounded-lg font-sans text-base font-light w-40">
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent align="end" className="font-sans">
              <SelectGroup>
                <SelectItem value="all" className="text-base font-light">All Payrolls</SelectItem>
                <SelectItem value="today" className="text-base font-light">Due Today</SelectItem>
                <SelectItem value="upcoming" className="text-base font-light">Upcoming</SelectItem>
                <SelectItem value="due" className="text-base font-light">Overdue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
      </div>

      {employeesPayrollsDetails === null ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : filteredPayrolls === null || filteredPayrolls.length === 0 ? (
        <div className="flex min-h-[50vh]">
          <p className="text-muted-foreground font-sans font-light text-xl">
            {employeesPayrollsDetails.length === 0 ? "No employee payrolls found." : "No payrolls match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPayrolls.map((payroll) => {
            return (
              <Card key={payroll.payroll_id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl font-heading font-normal capitalize">
                          {payroll.full_name}
                        </CardTitle>
                        <Badge variant="outline" className="font-sans font-light text-sm capitalize">
                          {payroll.designation.replace("_", " ")}
                        </Badge>
                        <span className="text-xl font-heading font-normal">EMP{payroll.employee_code}</span>
                      </div>
                      <Badge className={`font-sans font-light text-sm capitalize px-4 py-1 rounded-full ${getPayrollStatusColor(payroll.payroll_status)}`}>
                        {payroll.payroll_status}
                      </Badge>
                    </div>

                    <CardDescription className="font-sans font-light text-base flex items-center justify-between">
                      <span className="text-destructive font-light">
                        Due Date: {new Date(payroll.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>
                        Paid At: {payroll.paid_at ? new Date(payroll.paid_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PayrollDetailItem label="Phone Number" value={payroll.phone.slice(2)} />
                    <PayrollDetailItem label="Email" value={payroll.email} />
                    <PayrollDetailItem label="Qualifications" value={capitalizeWords(payroll.qualification)} />
                    <PayrollDetailItem label="Joined Date" value={new Date(payroll.joined_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
                    <PayrollDetailItem label="Monthly Salary" value={`₹${payroll.monthly_salary.toLocaleString()}`} />
                    <PayrollDetailItem label="Leaves Taken" value={`${payroll.leaves.leaves_taken} / ${payroll.leaves.total_leaves_per_month}`} />
                    <PayrollDetailItem label="Account Name" value={payroll.bank_details.account_holder_name} className="capitalize" />
                    <PayrollDetailItem label="Account Number" value={payroll.bank_details.account_number} />
                    <PayrollDetailItem label="IFSC Code" value={payroll.bank_details.ifsc_code} />
                    <PayrollDetailItem label="Bank & Branch" value={`${payroll.bank_details.bank_name} (${payroll.bank_details.branch_name})`} className="col-span-2 capitalize" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center gap-2">
                  <div className="text-2xl font-heading font-normal text-foreground">
                    Total: ₹{(payroll.base_salary - ((Math.max(0, payroll.leaves.leaves_taken - payroll.leaves.total_leaves_per_month)) * 500)).toLocaleString()}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      className="h-10 px-8 rounded-lg font-sans font-normal text-base hover:bg-primary/60"
                      disabled={payroll.payroll_status !== "pending" && payroll.payroll_status !== "failed"}
                      onClick={() => {
                        selectedEmployeePayrollDetailsRef.current = payroll;
                        setEmployeesPayrollsDialogOpen("cash");
                      }}
                    >
                      Pay Cash
                    </Button>
                    <Button 
                      className="h-10 px-8 rounded-lg font-sans font-normal text-base hover:bg-primary/60"
                      disabled={payroll.payroll_status !== "pending" && payroll.payroll_status !== "failed"}
                      onClick={() => {
                        selectedEmployeePayrollDetailsRef.current = payroll;
                        setEmployeesPayrollsDialogOpen("online");
                      }}
                    >
                      Deposit Online
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page" className="text-base font-sans font-light text-foreground">Rows per page</FieldLabel>
          <Select value={limit} onValueChange={(val) => { setLimit(val); setPageNumber(1); }}>
            <SelectTrigger className="h-10 rounded-lg font-sans text-base font-light w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="font-sans">
              <SelectGroup>
                <SelectItem value="1" className="text-base font-light">1</SelectItem>
                <SelectItem value="3" className="text-base font-light">3</SelectItem>
                <SelectItem value="5" className="text-base font-light">5</SelectItem>
                <SelectItem value="10" className="text-base font-light">10</SelectItem>
                <SelectItem value="15" className="text-base font-light">15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber > 1) {
                    setPageNumber(pageNumber - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`${pageNumber <= 1 ? "pointer-events-none opacity-50" : ""} text-base font-sans font-light`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (employeesPayrollsDetails && employeesPayrollsDetails.length === parseInt(limit)) {
                    setPageNumber(pageNumber + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`${(!employeesPayrollsDetails || employeesPayrollsDetails.length < parseInt(limit)) ? "pointer-events-none opacity-50" : ""} text-base font-sans font-light`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <EmployeesPayrollsByCashDialog 
        dialogOpen={employeesPayrollsDialogOpen === "cash"} 
        setDialogOpen={setEmployeesPayrollsDialogOpen} 
        employeepayrollDetails={selectedEmployeePayrollDetailsRef.current}
        fetchEmployeesPayrollsDetails={fetchEmployeesPayrollsDetails}
      />
      <EmployeesPayrollsByOnlineDialog 
        dialogOpen={employeesPayrollsDialogOpen === "online"} 
        setDialogOpen={setEmployeesPayrollsDialogOpen} 
        employeepayrollDetails={selectedEmployeePayrollDetailsRef.current}
        fetchEmployeesPayrollsDetails={fetchEmployeesPayrollsDetails}
      />
    </div>
  )
}
