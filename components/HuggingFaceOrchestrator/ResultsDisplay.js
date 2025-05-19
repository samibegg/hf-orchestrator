// components/HuggingFaceOrchestrator/ResultsDisplay.js
import { Label } from './shared/FormElements';

const ResultsDisplay = ({ results, error, isLoading }) => {
  if (isLoading && !results && !error) {
    return (
      <div className="mt-6 p-4 bg-gray-750 rounded-md border border-gray-600">
        <Label>Status</Label>
        <p className="text-yellow-400">Processing your request...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-900 bg-opacity-30 rounded-md border border-red-700">
        <Label className="text-red-400">Error</Label>
        <pre className="text-red-300 text-sm whitespace-pre-wrap">{typeof error === 'object' ? JSON.stringify(error, null, 2) : error}</pre>
      </div>
    );
  }

  if (!results) {
    return null; // Don't show anything if no results, error, or loading for results yet
  }

  return (
    <div className="mt-6 p-4 bg-gray-750 rounded-md border border-gray-600">
      <Label>Results</Label>
      <pre className="text-gray-200 text-sm whitespace-pre-wrap">
        {typeof results === 'object' ? JSON.stringify(results, null, 2) : results}
      </pre>
    </div>
  );
};

export default ResultsDisplay;
