import { type userLoginResponse } from "@/types"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, User, Users, GraduationCap, HardHat } from "lucide-react"


const roleConfig = {
  admin: { icon: ShieldCheck, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  teacher: { icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  staff: { icon: HardHat, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  parent: { icon: Users, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  student: { icon: User, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
}

export const SelectIdentity = ({ identities }: { identities: userLoginResponse[]}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {identities.map((identity) => {
        const config = roleConfig[identity.role as keyof typeof roleConfig] || roleConfig.student
        const Icon = config.icon

        return (
          <button
            key={identity.identity_id}
            className={`group relative flex items-center gap-4 p-4 rounded-2xl border ${config.border} ${config.bg} hover:bg-white/5 transition-all duration-300 text-left`}
          >
            <div className={`p-3 rounded-xl ${config.bg} ${config.color}`}>
              <Icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-heading capitalize text-foreground">
                  {identity.role}
                </h3>
                {identity.verified && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                {identity.active ? "Active account" : "Inactive account"}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                 →
               </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
