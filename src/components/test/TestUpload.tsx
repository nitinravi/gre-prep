import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../../context/TestContext';

const TestUpload: React.FC = () => {
  const { setTestData } = useTest();
  const navigate = useNavigate();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setTestData(json);
        navigate('/test');
      } catch (error) {
        alert('Invalid JSON file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  }, [setTestData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upload Your Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose a JSON file containing your GRE practice test
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg 
                  className="w-12 h-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="mt-2 text-base text-gray-600">
                  Click to upload a file
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  JSON files only
                </span>
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".json"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUpload; 