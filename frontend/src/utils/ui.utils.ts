export const capitalizeWords = (str: string) => str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")

export const colors: Record<string, string> = {
  green: "bg-green-100 text-green-800 border border-green-800 dark:bg-green-950 dark:text-green-300 dark:border-green-300",
  red: "bg-red-100 text-red-800 border border-red-800 dark:bg-red-950 dark:text-red-300 dark:border-red-300",
  blue: "bg-blue-100 text-blue-800 border border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-300",
  yellow: "bg-yellow-100 text-yellow-800 border border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-300",
  purple: "bg-purple-100 text-purple-800 border border-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-300",
  orange: "bg-orange-100 text-orange-800 border border-orange-800 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-300",
  teal: "bg-teal-100 text-teal-800 border border-teal-800 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-300",
  sky: "bg-sky-100 text-sky-800 border border-sky-800 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-300",
  gray: "bg-gray-100 text-gray-800 border border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-300",
  indigo: "bg-indigo-100 text-indigo-800 border border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-300",
} as const

export const getInvitationStatusColor = (status: string) => {
    switch(status) {
      case "pending": return colors.yellow;
      case "accepted": return colors.blue;
      case "allowed": return colors.green;
      case "revoked": return colors.red;
      case "expired": return colors.gray;
      default: return colors.gray;
    }
  }

export const getRoleColor = (role: string) => {
  switch (role) {
    case "admin": return colors.green;
    case "teacher": return colors.blue;
    case "staff": return colors.orange;
    case "parent": return colors.teal;
    default: return colors.gray;
  }
}