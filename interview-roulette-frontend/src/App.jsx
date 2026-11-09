
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Completion from './pages/Completion';
import History from './pages/History';
import UploadQuestions from './pages/UploadQuestions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/completion" element={<Completion />} />
        <Route path="/history" element={<History />} />
        <Route path="/upload-questions" element={<UploadQuestions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
