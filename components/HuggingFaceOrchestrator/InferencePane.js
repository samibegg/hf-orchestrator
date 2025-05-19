// components/HuggingFaceOrchestrator/InferencePane.js
import { Label, TextArea, Button } from './shared/FormElements';

const InferencePane = ({ inputText, setInputText, handleRunInference, isLoading }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="inference-input">Input Text</Label>
        <TextArea
          id="inference-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text for the model to process..."
        />
      </div>
      <Button onClick={handleRunInference} disabled={isLoading || !inputText.trim()}>
        {isLoading ? 'Processing...' : 'Run Inference'}
      </Button>
    </div>
  );
};

export default InferencePane;
