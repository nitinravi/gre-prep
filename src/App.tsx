import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TestProvider } from './context/TestContext';
import { HistoryProvider } from './context/HistoryContext';
import TestContainer from './components/test/TestContainer';

function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <TestProvider>
          <div className="min-h-screen bg-gray-50">
            <TestContainer />
          </div>
        </TestProvider>
      </HistoryProvider>
    </ThemeProvider>
  );
}

export default App;