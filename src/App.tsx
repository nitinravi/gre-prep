import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import LandingPage from './components/LandingPage';
import TestUpload from './components/test/TestUpload';
import TestScreen from './components/test/TestScreen';
import ResultSummary from './components/test/ResultSummary';

const App: React.FC = () => {
  return (
    <Router>
      <TestProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<TestUpload />} />
          <Route path="/test" element={<TestScreen />} />
          <Route path="/results" element={<ResultSummary />} />
        </Routes>
      </TestProvider>
    </Router>
  );
};

export default App;