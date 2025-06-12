import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const verbalSampleJson = {
    "section": "Verbal Reasoning",
    "total_questions": 2,
    "questions": [
      {
        "id": 1,
        "type": "Text Completion",
        "question": "Despite its reputation for ______, the company's latest report was remarkably straightforward and free of any misleading statements.",
        "options": ["candor", "opacity", "obfuscation", "clarity", "transparency"],
        "correct_answers": ["opacity", "obfuscation"]
      },
      {
        "id": 2,
        "type": "Reading Comprehension",
        "passage": "The advent of social media has transformed how we communicate...",
        "question": "According to the passage, what is the primary effect of social media on communication?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answers": ["Option A"]
      }
    ]
  };

  const quantSampleJson = {
    "section": "Quantitative Reasoning",
    "total_questions": 3,
    "questions": [
      {
        "id": 1,
        "type": "Quantitative Comparison",
        "question": "Quantity A: √50\nQuantity B: 7",
        "options": ["A", "B", "C", "D"],
        "correct_answers": ["B"]
      },
      {
        "id": 2,
        "type": "Multiple Choice — Multiple Answers",
        "question": "Which of the following integers are factors of 60?\nSelect all that apply.",
        "options": ["4", "5", "6", "10", "15"],
        "correct_answers": ["5", "6", "10", "15"]
      },
      {
        "id": 3,
        "type": "Numeric Entry",
        "question": "If a triangle has angles in the ratio 3:4:5, what is the measure of the largest angle (in degrees)?",
        "options": [],
        "correct_answers": ["75"]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GRE Practice Test Platform
          </h1>
          <p className="text-xl text-gray-600">
            Create and take custom GRE practice tests with AI-generated questions
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="prose max-w-none">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Prepare Your Test JSON:</strong> Create a JSON file following the format shown below for either Verbal or Quantitative sections.
              </li>
              <li>
                <strong>Upload Your Test:</strong> Use the upload button to load your test JSON file.
              </li>
              <li>
                <strong>Take the Test:</strong> Answer questions at your own pace with a timer to simulate real test conditions.
              </li>
              <li>
                <strong>Review Results:</strong> Get detailed feedback on your performance with correct answers and explanations.
              </li>
            </ol>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verbal Section Format</h2>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Supported question types:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Text Completion (single/multiple blanks)</li>
                <li>Sentence Equivalence</li>
                <li>Reading Comprehension</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(verbalSampleJson, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quantitative Section Format</h2>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Supported question types:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Quantitative Comparison</li>
                <li>Multiple Choice — Single Answer</li>
                <li>Multiple Choice — Multiple Answers</li>
                <li>Numeric Entry</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(quantSampleJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Using AI to Generate Questions</h2>
          <div className="prose max-w-none">
            <p>You can use AI to help generate test questions. Here's how:</p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Use ChatGPT or similar AI:</strong> Ask it to generate GRE-style questions in the specific format shown above.
              </li>
              <li>
                <strong>Provide Clear Instructions:</strong> Specify:
                <ul className="list-disc pl-6">
                  <li>The section type (Verbal/Quantitative)</li>
                  <li>The question type you want</li>
                  <li>Number of questions needed</li>
                  <li>The JSON format to follow</li>
                </ul>
              </li>
              <li>
                <strong>Example Prompt:</strong>
                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  "Generate 3 GRE Verbal Reasoning Text Completion questions in JSON format. Each question should have 5 options and 1-2 correct answers. Follow this structure: {'{'}id, type, question, options: [], correct_answers: []{'}'}"
                </div>
              </li>
              <li>
                <strong>Validate the JSON:</strong> Before uploading, ensure the generated JSON is valid and follows the required format.
              </li>
            </ol>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/upload" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Creating Your Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 