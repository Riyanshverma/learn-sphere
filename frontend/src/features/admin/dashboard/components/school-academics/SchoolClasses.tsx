import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { adminService } from "@/services"
import { useEffect } from "react"
import { useAdminStore } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const SchoolClasses = () => {
  const navigate = useNavigate()
  const allClassesDetails = useAdminStore((state) => state.allClassesDetails)
  const setAllClassesDetails = useAdminStore((state) => state.setAllClassesDetails)

  const featchAllClassesDetails = async () => {
    try {
      const result = await adminService.getAllClassesDetails()
      if (!result.success) {
        throw new Error(result.error, { cause: result.code });
      }
      
      setAllClassesDetails(result.data)
      toast.success(result.message)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if (!allClassesDetails) {
      featchAllClassesDetails()
    }
  }, [])

  if (!allClassesDetails) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allClassesDetails.map((cls) => (
          <Card key={cls.class_id} className="w-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl font-heading font-normal ">
                  Class {cls.class_standard} - {cls.class_section}
                </CardTitle>
                <CardDescription className="font-sans font-light text-base">
                  Academic Year: {cls.academic_year}
                </CardDescription>
              </div>
              <div className="text-base font-sans font-light text-muted-foreground">
                Students: {cls.class_students}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-base font-sans font-light capitalize">
                <span className="text-muted-foreground">Teacher: </span>
                {cls.teacher_name}
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/admin/class-details/${cls.class_standard}-${cls.class_section}`, { state: { classDetails: cls } })}
                className="rounded-3xl px-4 font-light font-sans bg-foreground text-background border border-foreground/20 hover:bg-foreground"
              >
                More Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
