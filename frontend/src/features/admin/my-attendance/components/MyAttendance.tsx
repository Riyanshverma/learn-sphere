import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { DoorOpen, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useAdminStore } from "@/store"
import { adminService } from "@/services"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export const MyAttendance = () => {
  const navigate = useNavigate()
  const admin = useAdminStore((state) => state.admin)
  const myAttendance = useAdminStore((state) => state.myAttendance)
  const setMyAttendance = useAdminStore((state) => state.setMyAttendance)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const fetchMyAttendance = async () => {
    try {
      const result = await adminService.getMyAttendance(admin?.employee_id as string)
      if (!result.success) {
        throw new Error(result.error, { cause: result.code })
      }
      setMyAttendance(result.data)
    } catch (error: any) {
      toast.error(error.message, { description: error.cause })
    }
  }

  useEffect(() => {
    if (!myAttendance) {
      fetchMyAttendance()
    }
  }, [myAttendance])

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + offset)
    setCurrentMonth(newDate)
  }

  const monthlyData = useMemo(() => {
    if (!myAttendance) return []
    return myAttendance.filter((a) => {
      const d = new Date(a.date)
      return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
    })
  }, [myAttendance, currentMonth])

  const stats = useMemo(() => {
    const present = monthlyData.filter(a => a.status === 'present').length
    const absent = monthlyData.filter(a => a.status === 'absent').length
    return { total: monthlyData.length, present, absent }
  }, [monthlyData])

  const overallStats = useMemo(() => {
    if (!myAttendance) return { total: 0, present: 0, absent: 0 }
    const present = myAttendance.filter((a) => a.status === 'present').length
    const absent = myAttendance.filter((a) => a.status === 'absent').length
    return { total: myAttendance.length, present, absent }
  }, [myAttendance])

  return (
    <div className="pt-32 pb-16 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-4xl font-heading font-normal text-foreground">My Attendance</h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border rounded-full px-2 py-1 gap-2">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent hover:bg-foreground hover:text-background"
              onClick={() => handleMonthChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-sans px-2 min-w-[100px] text-center">
              {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent hover:bg-foreground hover:text-background"
              onClick={() => handleMonthChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="flex items-center bg-foreground gap-2 px-4 h-10 text-sm font-sans font-normal transition-all text-background border border-foreground/20 hover:bg-foreground"
            onClick={() => navigate('/admin/dashboard', { state: { tab: 'home' } })}
          >
            <DoorOpen className="h-4 w-4" />
            Back
          </Button>
        </div>

      </div>

      {myAttendance === null ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : myAttendance.length === 0 ? (
        <div className="flex min-h-[50vh]">
            <p className="text-muted-foreground font-sans font-light text-xl">
            No attendance records found.
            </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats Pill Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Logged", value: overallStats.total, color: "text-blue-400", icon: CalendarDays },
              { label: "Total Present", value: overallStats.present, color: "text-primary", icon: CheckCircle2 },
              { label: "Total Absent", value: overallStats.absent, color: "text-destructive", icon: XCircle }
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-2 rounded-full border bg-card/80 flex flex-col justify-center">
                <h3 className="text-xl font-heading text-muted-foreground font-normal flex items-center justify-between">
                {stat.label}
                <span className={`text-3xl font-light ${stat.color}`}>{stat.value}</span>
              </h3>
              </div>
            ))}
          </div>

          {/* Charts & Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-normal text-foreground">Attendance Distribution</h3>
              <Card className="bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden rounded-3xl">
                <CardContent className="h-[426px]">
                  {stats.total > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Present', value: stats.present, color: 'var(--color-primary)' },
                            { name: 'Absent', value: stats.absent, color: 'var(--color-destructive)' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={110}
                          outerRadius={150}
                          paddingAngle={5}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1500}
                        >
                          {[
                            { name: 'Present', value: stats.present, color: 'var(--color-primary)' },
                            { name: 'Absent', value: stats.absent, color: 'var(--color-destructive)' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--primary)/0.1)', 
                            borderRadius: '12px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '16px',
                            fontWeight: 300
                          }}
                          itemStyle={{ 
                            color: 'hsl(var(--foreground))',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '16px',
                            fontWeight: 300
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          formatter={(value) => <span className="font-sans text-base font-light text-foreground flex">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                  <div className="text-muted-foreground font-sans font-light text-base">
                      No data for this month to visualize
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-normal text-foreground">Attendance Calendar</h3>
              <Card className="bg-card/40 backdrop-blur-sm border-primary/10 rounded-3xl overflow-hidden">
                <CardContent>
                  <Calendar
                    mode="single"
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    disableNavigation
                  className="font-sans w-full max-w-full flex justify-center [--cell-size:40px] [--cell-radius:20px]"
                    classNames={{
                      week: "flex w-full mt-4 justify-center gap-4",
                    }}
                    modifiers={{
                      present: monthlyData.filter(a => a.status === 'present').map(a => new Date(a.date)),
                      absent: monthlyData.filter(a => a.status === 'absent').map(a => new Date(a.date)),
                    }}
                    modifiersClassNames={{
                      present: "bg-primary text-primary-foreground hover:bg-primary/60",
                      absent: "bg-destructive text-destructive-foreground hover:bg-destructive/60",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
