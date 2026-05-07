import AdminDashboard from "./dashboard/pages/AdminDashboard";
import AddSchoolStaffPage from "./add-school-staff/pages/AddSchoolStaffPage";
import AddStudentPage from "./add-school-student/pages/AddStudentPage";

export { AdminDashboard, AddSchoolStaffPage, AddStudentPage }

// Components:
import { AdminDashboardHeader } from "./dashboard/components/AdminDashboardHeader";
import { AdminHome } from "./dashboard/components/AdminHome";
import { SchoolPeople } from "./dashboard/components/SchoolPeople";
import { SchoolAcademics } from "./dashboard/components/SchoolAcademics";
import { SchoolFinance } from "./dashboard/components/SchoolFinance";
import { AdminSettings } from "./dashboard/components/AdminSettings";
import { AddSchoolStaff } from "./add-school-staff/components/AddSchoolStaff";
import { AddStudent } from "./add-school-student/components/AddStudent";

export { AdminDashboardHeader, AdminHome, SchoolPeople, SchoolAcademics, SchoolFinance, AdminSettings, AddSchoolStaff, AddStudent }

// Sub Components:
import { SchoolPeopleSubHeader } from "./dashboard/components/school-people/SchoolPeopleSubHeader"
import { SchoolTeachers } from "./dashboard/components/school-people/SchoolTeachers"
import { SchoolStudents } from "./dashboard/components/school-people/SchoolStudents"
import { SchoolStaff } from "./dashboard/components/school-people/SchoolStaff"
import { SchoolAcademicsSubHeader } from "./dashboard/components/school-academics/SchoolAcademicsSubHeader"
import { SchoolClasses } from "./dashboard/components/school-academics/SchoolClasses"
import { SchoolEnrollments } from "./dashboard/components/school-academics/SchoolEnrollments"
import { SchoolExamsAndResults } from "./dashboard/components/school-academics/SchoolExamsAndResults"
import { AddSchoolStaffSubHeader } from "./add-school-staff/components/AddSchoolStaffSubHeader"
import { AddNewSchoolStaff } from "./add-school-staff/components/AddNewSchoolStaff"
import { AddStudentSubHeader } from "./add-school-student/components/AddStudentSubHeader"
import { AddStudentWithNewParent } from "./add-school-student/components/AddStudentWithNewParent"
import { AddStudentWithExistingUserParent } from "./add-school-student/components/AddStudentWithExistingUserParent"
import { AddExistingUserStaff } from "./add-school-staff/components/AddExistingUserStaff"
import { TeacherInvitations } from "./dashboard/components/school-academics/TeacherInvitations"
import { ParentInvitations } from "./dashboard/components/school-academics/ParentInvitations"
import { AddTeacherInvitation } from "./dashboard/components/school-academics/AddTeacherInvitation";
import { AddStudentInvitation } from "./dashboard/components/school-academics/AddStudentInvitation";
import { TeacherInvitationDetailsDialog } from "./dashboard/components/school-academics/TeacherInvitationDetailsDialog";
import { ParentInvitationDetailsDialog } from "./dashboard/components/school-academics/ParentInvitationDetailsDialog";
import { StudentSelectClassDialog } from "./dashboard/components/school-academics/StudentSelectClassDialog";

export { SchoolPeopleSubHeader, SchoolTeachers, SchoolStudents, SchoolStaff, SchoolAcademicsSubHeader, SchoolClasses, SchoolEnrollments, SchoolExamsAndResults, AddSchoolStaffSubHeader, AddNewSchoolStaff, AddExistingUserStaff, TeacherInvitations, ParentInvitations, AddStudentSubHeader, AddStudentWithNewParent, AddStudentWithExistingUserParent, AddTeacherInvitation, AddStudentInvitation, TeacherInvitationDetailsDialog, ParentInvitationDetailsDialog, StudentSelectClassDialog }