// Pages:
import AdminDashboard from "./dashboard/pages/AdminDashboard";

export { AdminDashboard }

// Dashboard Components:
import { AdminDashboardHeader } from "./dashboard/components/AdminDashboardHeader";
import { AdminHome } from "./dashboard/components/AdminHome";
import { SchoolPeople } from "./dashboard/components/SchoolPeople";
import { SchoolAcademics } from "./dashboard/components/SchoolAcademics";
import { SchoolFinance } from "./dashboard/components/SchoolFinance";
import { AdminSettings } from "./dashboard/components/AdminSettings";

export { AdminDashboardHeader, AdminHome, SchoolPeople, SchoolAcademics, SchoolFinance, AdminSettings }

// Sub Components:
import { SchoolPeopleSubHeader } from "./dashboard/components/school-people/SchoolPeopleSubHeader"
import { SchoolTeachers } from "./dashboard/components/school-people/SchoolTeachers"
import { SchoolStudents } from "./dashboard/components/school-people/SchoolStudents"
import { SchoolStaff } from "./dashboard/components/school-people/SchoolStaff"
import { SchoolAcademicsSubHeader } from "./dashboard/components/school-academics/SchoolAcademicsSubHeader"
import { SchoolClasses } from "./dashboard/components/school-academics/SchoolClasses"
import { SchoolEnrollments } from "./dashboard/components/school-academics/SchoolEnrollments"
import { SchoolExamsAndResults } from "./dashboard/components/school-academics/SchoolExamsAndResults"

export { 
  SchoolPeopleSubHeader, 
  SchoolTeachers, 
  SchoolStudents, 
  SchoolStaff,
  SchoolAcademicsSubHeader,
  SchoolClasses,
  SchoolEnrollments,
  SchoolExamsAndResults
}