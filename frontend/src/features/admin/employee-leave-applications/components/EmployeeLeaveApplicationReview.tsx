import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateEmployeeLeaveApplicationStatusSchema, type UpdateEmployeeLeaveApplicationStatusType } from "@/validation"
import { useAdminStore } from "@/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { adminService } from "@/services"
import type { EmployeeLeaveApplicationsResponse } from "@/types"

interface EmployeeLeaveApplicationReviewProps {
  application: EmployeeLeaveApplicationsResponse
  fetchEmployeesLeaveApplications: () => void
}

export const EmployeeLeaveApplicationReview = ({ application, fetchEmployeesLeaveApplications }: EmployeeLeaveApplicationReviewProps) => {
  const admin = useAdminStore(state => state.admin)
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<UpdateEmployeeLeaveApplicationStatusType>({
    resolver: zodResolver(UpdateEmployeeLeaveApplicationStatusSchema),
    defaultValues: {
      leave_application_id: application.leave_application_id,
      applicant_id: application.applicant_id,
      reviewed_by: admin!.employee_id,
    }
  })

  const onSubmit = async (data: UpdateEmployeeLeaveApplicationStatusType) => {
    try {
      const result = await adminService.updateEmployeeLeaveApplicationStatus(data)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      
      fetchEmployeesLeaveApplications()
      toast.success(result.message)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex items-center gap-4">
      <div className="flex-1">
        <Input 
          {...register("review_comment")}
          placeholder="Add review comment..." 
          className="h-10 rounded-lg font-sans font-light text-base"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button 
          type="submit" 
          variant="destructive" 
          disabled={isSubmitting}
          onClick={() => setValue("new_leave_status", "rejected")}
          className="h-10 px-8 rounded-lg font-sans font-normal text-base"
        >
          Reject
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          onClick={() => setValue("new_leave_status", "approved")}
          className="h-10 px-8 rounded-lg font-sans font-normal text-base hover:bg-primary/60"
        >
          Approve
        </Button>
      </div>
    </form>
  )
}
