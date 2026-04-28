// Pages:
import AdminDashboard from "./dashboard/pages/AdminDashboard";

export { AdminDashboard }

// Dashboard Components:
import { AdminDashboardHeader } from "./dashboard/components/AdminDashboardHeader";
import { AdminHome } from "./dashboard/components/AdminHome";
import { SchoolPeople } from "./dashboard/components/SchoolPeople";
import { Academics } from "./dashboard/components/Academics";
import { Finance } from "./dashboard/components/Finance";
import { AdminSettings } from "./dashboard/components/AdminSettings";

export { AdminDashboardHeader, AdminHome, SchoolPeople, Academics, Finance, AdminSettings }

// Sub Components:
import { SchoolPeopleSubHeader } from "./dashboard/components/school-people/SchoolPeopleSubHeader"
import { SchoolTeachers } from "./dashboard/components/school-people/SchoolTeachers"
import { SchoolStudents } from "./dashboard/components/school-people/SchoolStudents"
import { SchoolStaff } from "./dashboard/components/school-people/SchoolStaff"

export { SchoolPeopleSubHeader, SchoolTeachers, SchoolStudents, SchoolStaff }