import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, SelectIdentityPage, TeacherSignupPage, StudentSignupPage } from '@/features/authentication';
import { LandingPage } from '@/features/landing';
import { AdminDashboard, AddSchoolStaffPage, AddStudentPage } from '@/features/admin';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-identity" element={<SelectIdentityPage />} />
          <Route path="/teacher-signup" element={<TeacherSignupPage />} />
          <Route path="/student-signup" element={<StudentSignupPage />} />

          {/* Add more routes here as you build them */}

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add-school-staff" element={<AddSchoolStaffPage />} />
              <Route path="add-school-student" element={<AddStudentPage />} />
            </Routes>
          } />

        </Routes>
        <Toaster position="bottom-right" theme="dark" richColors={true} />
      </Router>
    </>
  )
}

export default App;