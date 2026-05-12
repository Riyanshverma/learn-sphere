import { useState, useEffect } from "react"
import { toast } from "sonner"
import { adminService } from "@/services"
import { Field, FieldLabel } from "@/components/ui/field"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { getLeaveStatusColor, getLeaveTypeColor, capitalizeWords } from "@/utils"
import type { EmployeeLeaveApplicationsResponse } from "@/types"

export const EmployeesLeaveApplications = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [limit, setLimit] = useState<string>("5")
  const [employeesLeaveApplications, setEmployeesLeaveApplications] = useState<EmployeeLeaveApplicationsResponse[] | null>(null)

  const fetchEmployeesLeaveApplications = async () => {
    try {
      const result = await adminService.getEmployeesLeaveApplications(pageNumber, limit)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }

      setEmployeesLeaveApplications(result.data as EmployeeLeaveApplicationsResponse[])
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    fetchEmployeesLeaveApplications()
  }, [pageNumber, limit])

  return (
    <div className="space-y-6">
      {employeesLeaveApplications === null ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : employeesLeaveApplications.length === 0 ? (
        <div className="flex min-h-[50vh]">
          <p className="text-muted-foreground font-sans font-light text-xl">
            No employee leave applications found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {employeesLeaveApplications.map((app) => {
            const days = Math.max(1, Math.ceil(((new Date(app.leave_to_date)).getTime() - (new Date(app.leave_from_date)).getTime()) / (1000 * 60 * 60 * 24)) + 1)
            return (
              <Card key={app.leave_application_id} className="w-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl font-heading font-normal capitalize">
                          {app.leave_reason}
                        </CardTitle>
                        <Badge className={`${getLeaveTypeColor(app.leave_type)} font-sans font-light text-sm capitalize`} variant="outline">
                          {app.leave_type} Leave
                        </Badge>
                        <span className="text-xl font-heading font-normal">
                          {days} Day(s)
                        </span>
                      </div>
                      <Badge className={`${getLeaveStatusColor(app.leave_status)} font-sans font-light text-sm capitalize px-4 py-1 rounded-full`} variant="outline">
                        {app.leave_status}
                      </Badge>
                    </div>

                    <CardDescription className="font-sans font-light text-base flex items-center justify-between">
                      <div>
                        {new Date(app.leave_from_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {" - "}
                        {new Date(app.leave_to_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      Applied On: {new Date(app.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Employee Name:</span>
                      <span className="text-foreground/80">{capitalizeWords(app.full_name)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Designation:</span>
                      <span className="text-foreground/80 capitalize">{app.designation.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Employee Code:</span>
                      <span className="text-foreground/80">#{app.employee_code}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Leaves Taken:</span>
                      <span className="text-foreground/80">{app.leaves.leaves_taken} / {app.leaves.total_leaves_per_year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Email:</span>
                      <span className="text-foreground/80">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-sans font-light">
                      <span className="text-muted-foreground font-light w-32">Phone Number:</span>
                      <span className="text-foreground/80">{app.phone_number.slice(2)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-8 text-base font-sans font-light w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-light">Review Comment: </span>
                      <span className="text-foreground/80">{app.review_comment || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-light">Reviewed At: </span>
                      <span className="text-foreground/80">
                        {app.reviewed_at ? new Date(app.reviewed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
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
                <SelectItem value="5" className="text-base font-light">5</SelectItem>
                <SelectItem value="10" className="text-base font-light">10</SelectItem>
                <SelectItem value="15" className="text-base font-light">15</SelectItem>
                <SelectItem value="20" className="text-base font-light">20</SelectItem>
                <SelectItem value="25" className="text-base font-light">25</SelectItem>
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
                  if (employeesLeaveApplications && employeesLeaveApplications.length === parseInt(limit)) {
                    setPageNumber(pageNumber + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`${(!employeesLeaveApplications || employeesLeaveApplications.length < parseInt(limit)) ? "pointer-events-none opacity-50" : ""} text-base font-sans font-light`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

