// components/HuggingFaceOrchestrator/InferencePane.js
import { Label, TextArea } from './shared/FormElements';

// Added selectedTask to props
const InferencePane = ({ inputText, setInputText, isQA, selectedTask }) => { 
  return (
    <div className="space-y-1">
      <div>
        <Label htmlFor="inference-input">{isQA ? "Question" : "Input Text"}</Label>
        <TextArea
          id="inference-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isQA ? "Enter your question..." : "Enter text for the model to process..."}
          // Now selectedTask is available and correctly used here
          rows={selectedTask === 'question-answering' ? 3 : 4} 
        />
      </div>
    </div>
  );
};

export default InferencePane;