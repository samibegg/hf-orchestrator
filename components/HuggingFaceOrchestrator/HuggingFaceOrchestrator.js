// components/HuggingFaceOrchestrator/HuggingFaceOrchestrator.js
import { useState } from 'react';
import TaskSelector from './TaskSelector';
import ModelSelector from './ModelSelector';
import InferencePane from './InferencePane'; 
import FineTuningPane from './FineTuningPane';
import ResultsDisplay from './ResultsDisplay';
import { Label, Select, Button, TextArea, Input } from './shared/FormElements';

// IMPORTANT: Replace with your actual backend API URL
const API_BASE_URL = 'https://orch-backend.forgemission.com'; // e.g., https://api.yourdomain.com

const HuggingFaceOrchestrator = () => {
  const [operationMode, setOperationMode] = useState('inference');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');

  const [inputText, setInputText] = useState('');
  const [contextText, setContextText] = useState('');
  const [generationArgs, setGenerationArgs] = useState({ max_length: 50, num_beams: 1 });

  const [fineTuneParams, setFineTuneParams] = useState({
    datasetPath: '',
    text_column: 'text',
    label_column: 'label',
    context_column: 'context',
    epochs: 3,
    batchSize: 8,
    learningRate: 2e-5,
    useLoRA: true,
    lora_config: {
      r: 8,
      alpha: 16,
      dropout: 0.05,
      target_modules: 'q_proj,v_proj',
    },
    max_seq_length: 384,
    num_labels: null,
  });

  const [quantizationOption, setQuantizationOption] = useState('none');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFinalModelName = () => {
    return selectedModel === 'custom' ? customModelName.trim() : selectedModel;
  };

  const handleApiCall = async (endpoint, payload) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    const modelToUse = getFinalModelName();
    if (!modelToUse || !selectedTask) {
      setError('Please select a task and model.');
      setIsLoading(false);
      return;
    }

    console.log(`Calling API endpoint: ${API_BASE_URL}${endpoint} with payload:`, payload);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.detail || `HTTP error! status: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      setResults(responseData);
      console.log('API Response:', responseData);

    } catch (err) {
      console.error('API Call Error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunInference = () => {
    if (!inputText.trim()) {
      setError('Input text (question for QA) cannot be empty for inference.');
      return;
    }
    if (selectedTask === 'question-answering' && !contextText.trim()) {
      setError('Context text cannot be empty for Question Answering.');
      return;
    }

    const payload = {
      task: selectedTask,
      model_name: getFinalModelName(),
      input_text: inputText,
      context: selectedTask === 'question-answering' ? contextText : undefined,
      quantization: quantizationOption,
      generation_args: selectedTask === 'text-generation' ? generationArgs : undefined,
    };
    handleApiCall('/api/v1/infer', payload);
  };

  const handleStartFineTuning = () => {
    if (!fineTuneParams.datasetPath.trim()) {
      setError('Dataset path cannot be empty for fine-tuning.');
      return;
    }
    const loraConfigPayload = fineTuneParams.useLoRA ? fineTuneParams.lora_config : null;
    const learningRateFloat = parseFloat(fineTuneParams.learningRate);
    if (isNaN(learningRateFloat)) {
        setError("Learning rate must be a valid number.");
        return;
    }
    const numLabelsInt = fineTuneParams.num_labels ? parseInt(fineTuneParams.num_labels, 10) : null;
    if (fineTuneParams.num_labels && (isNaN(numLabelsInt) || numLabelsInt <=0) ) {
        setError("Number of labels must be a positive integer if specified.");
        return;
    }

    const payload = {
      task: selectedTask,
      model_name: getFinalModelName(),
      fine_tune_params: {
        ...fineTuneParams,
        learningRate: learningRateFloat,
        num_labels: numLabelsInt,
        lora_config: loraConfigPayload,
        context_column: selectedTask === 'question-answering' ? fineTuneParams.context_column : undefined,
      },
    };
    handleApiCall('/api/v1/finetune', payload);
  };
  
  const currentModelName = getFinalModelName();

  const handleGenArgChange = (e) => {
    const { name, value } = e.target;
    setGenerationArgs(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-gray-800 text-gray-100 rounded-lg shadow-xl space-y-6">
      <h1 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">Hugging Face Model Orchestrator</h1>

      <div className="flex space-x-2 mb-6 p-1 bg-gray-700 rounded-lg">
        <Button
          onClick={() => { setOperationMode('inference'); setResults(null); setError(null);}}
          variant={operationMode === 'inference' ? 'primary' : 'secondary'}
          className="flex-1"
        >
          Direct Inference
        </Button>
        <Button
          onClick={() => { setOperationMode('finetune'); setResults(null); setError(null);}}
          variant={operationMode === 'finetune' ? 'primary' : 'secondary'}
          className="flex-1"
        >
          Fine-Tune Model
        </Button>
      </div>

      <div className="space-y-4 p-4 border border-gray-700 rounded-md">
        <h2 className="text-lg font-medium text-indigo-400">Common Configuration</h2>
        <TaskSelector selectedTask={selectedTask} setSelectedTask={(task) => {setSelectedTask(task); setSelectedModel(''); setCustomModelName(''); setResults(null); setError(null); setInputText(''); setContextText('');}} />
        {selectedTask && (
          <ModelSelector
            selectedTask={selectedTask}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            customModelName={customModelName}
            setCustomModelName={setCustomModelName}
          />
        )}
      </div>

      {(currentModelName) && (
        <div className="p-4 border border-gray-700 rounded-md">
          <Label htmlFor="quantization-option">Quantization Option</Label>
          <Select id="quantization-option" value={quantizationOption} onChange={(e) => setQuantizationOption(e.target.value)}>
            <option value="none">None</option>
            <option value="dynamic_int8_cpu">Dynamic INT8 (CPU PyTorch)</option>
          </Select>
          <p className="text-xs text-gray-400 mt-1">Note: Applied by backend during model loading/processing.</p>
        </div>
      )}

      {/* Mode-Specific Panes */}
      {currentModelName && selectedTask && operationMode === 'inference' && (
        <div className="p-4 border border-gray-700 rounded-md space-y-4">
            <h3 className="text-md font-medium text-indigo-300">Inference Input</h3>
            <InferencePane
              inputText={inputText} 
              setInputText={setInputText}
              isQA={selectedTask === 'question-answering'} 
              selectedTask={selectedTask} // Pass selectedTask as a prop
            />
            {selectedTask === 'question-answering' && (
              <div>
                <Label htmlFor="context-text">Context</Label>
                <TextArea
                  id="context-text"
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Enter the context for question answering..."
                  rows={6}
                />
              </div>
            )}
            {/* This is now the SINGLE "Run Inference" button for this mode */}
            <Button 
                onClick={handleRunInference} 
                disabled={isLoading || !inputText.trim() || (selectedTask === 'question-answering' && !contextText.trim())}
            >
                {isLoading ? 'Processing...' : 'Run Inference'}
            </Button>
        </div>
      )}
      
      {currentModelName && selectedTask === 'text-generation' && operationMode === 'inference' && (
        <div className="p-4 border border-gray-700 rounded-md mt-4 space-y-3">
            <h3 className="text-md font-medium text-indigo-300">Generation Arguments</h3>
            <div>
                <Label htmlFor="max_length">Max Length</Label>
                <Input
                    type="number" 
                    id="max_length" 
                    name="max_length" 
                    value={generationArgs.max_length} 
                    onChange={handleGenArgChange}
                />
            </div>
          </div>
      )}

      {currentModelName && selectedTask && operationMode === 'finetune' && (
        <FineTuningPane
          fineTuneParams={fineTuneParams}
          setFineTuneParams={setFineTuneParams}
          handleStartFineTuning={handleStartFineTuning}
          isLoading={isLoading}
          selectedTask={selectedTask}
        />
      )}

      <ResultsDisplay results={results} error={error} isLoading={isLoading && (!results && !error)} />
    </div>
  );
};

export default HuggingFaceOrchestrator;