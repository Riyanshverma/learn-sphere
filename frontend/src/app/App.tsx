import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/features/authentication';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Add more routes here as you build them */}
        </Routes>
        <Toaster position="bottom-right" theme="dark" richColors={true} />
      </Router>
    </>
  )
}

export default App;