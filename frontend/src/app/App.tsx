import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, SelectIdentityPage } from '@/features/authentication';
import { LandingPage } from '@/features/landing';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-identity" element={<SelectIdentityPage />} />
          {/* Add more routes here as you build them */}
        </Routes>
        <Toaster position="bottom-right" theme="dark" richColors={true} />
      </Router>
    </>
  )
}

export default App;