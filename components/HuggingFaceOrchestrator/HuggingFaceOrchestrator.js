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
  const [operationMode, setOperationMode] = useState('inference'); // 'inference', 'finetune', or 'anomaly'
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');

  // Inference state
  const [inputText, setInputText] = useState('');
  const [contextText, setContextText] = useState('');
  const [generationArgs, setGenerationArgs] = useState({ max_length: 50, num_beams: 1 });

  // Fine-tuning state
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

  // Anomaly Detection State
  const [anomalyText, setAnomalyText] = useState('');
  const [anomalyParams, setAnomalyParams] = useState({
    embedding_model_name: 'sentence-transformers/all-MiniLM-L6-v2',
    autoencoder_model_path: './saved_autoencoder.pth', // Example path, user should provide
    autoencoder_embedding_dim: 384,
    autoencoder_encoding_dim: 64,
    threshold: 0.1,
  });


  const [quantizationOption, setQuantizationOption] = useState('none');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFinalModelName = () => { // Used for inference/fine-tuning
    return selectedModel === 'custom' ? customModelName.trim() : selectedModel;
  };

  const handleApiCall = async (endpoint, payload) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    // Model/task validation for inference and fine-tuning, not for anomaly detection directly here
    if (operationMode !== 'anomaly') {
        const modelToUse = getFinalModelName();
        if (!modelToUse || !selectedTask) {
          setError('Please select a task and model for inference/fine-tuning.');
          setIsLoading(false);
          return;
        }
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

  const handleDetectAnomaly = () => {
    if (!anomalyText.trim()) {
      setError('Text for anomaly detection cannot be empty.');
      return;
    }
    if (!anomalyParams.autoencoder_model_path.trim()) {
      setError('Autoencoder model path cannot be empty.');
      return;
    }
    const payload = {
      text: anomalyText,
      embedding_model_name: anomalyParams.embedding_model_name,
      autoencoder_model_path: anomalyParams.autoencoder_model_path,
      autoencoder_embedding_dim: parseInt(anomalyParams.autoencoder_embedding_dim, 10),
      autoencoder_encoding_dim: parseInt(anomalyParams.autoencoder_encoding_dim, 10),
      threshold: parseFloat(anomalyParams.threshold),
    };
    // Validate parsed numbers
    if (isNaN(payload.autoencoder_embedding_dim) || isNaN(payload.autoencoder_encoding_dim) || isNaN(payload.threshold)) {
        setError("Autoencoder dimensions and threshold must be valid numbers.");
        return;
    }
    handleApiCall('/api/v1/detect_anomaly', payload);
  };
  
  const currentModelName = getFinalModelName(); // Relevant for inference/fine-tuning modes

  const handleGenArgChange = (e) => {
    const { name, value } = e.target;
    setGenerationArgs(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleAnomalyParamChange = (e) => {
    const { name, value } = e.target;
    setAnomalyParams(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-gray-800 text-gray-100 rounded-lg shadow-xl space-y-6">
      <h1 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">Hugging Face Model Orchestrator</h1>

      {/* Operation Mode Toggle */}
      <div className="flex space-x-1 sm:space-x-2 mb-6 p-1 bg-gray-700 rounded-lg">
        <Button
          onClick={() => { setOperationMode('inference'); setResults(null); setError(null);}}
          variant={operationMode === 'inference' ? 'primary' : 'secondary'}
          className="flex-1 text-xs sm:text-sm"
        >
          Inference
        </Button>
        <Button
          onClick={() => { setOperationMode('finetune'); setResults(null); setError(null);}}
          variant={operationMode === 'finetune' ? 'primary' : 'secondary'}
          className="flex-1 text-xs sm:text-sm"
        >
          Fine-Tune
        </Button>
        <Button
          onClick={() => { setOperationMode('anomaly'); setResults(null); setError(null);}}
          variant={operationMode === 'anomaly' ? 'primary' : 'secondary'}
          className="flex-1 text-xs sm:text-sm"
        >
          Anomaly Detect
        </Button>
      </div>

      {/* Common Configuration for Inference/Fine-tuning */}
      {(operationMode === 'inference' || operationMode === 'finetune') && (
        <>
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

          {(currentModelName && operationMode === 'inference') && ( // Quantization only for inference for now
            <div className="p-4 border border-gray-700 rounded-md">
              <Label htmlFor="quantization-option">Quantization Option (Inference)</Label>
              <Select id="quantization-option" value={quantizationOption} onChange={(e) => setQuantizationOption(e.target.value)}>
                <option value="none">None</option>
                <option value="dynamic_int8_cpu">Dynamic INT8 (CPU PyTorch)</option>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Note: Applied by backend during model loading/processing.</p>
            </div>
          )}
        </>
      )}


      {/* Mode-Specific Panes */}
      {operationMode === 'inference' && currentModelName && selectedTask && (
        <div className="p-4 border border-gray-700 rounded-md space-y-4">
            <h3 className="text-md font-medium text-indigo-300">Inference Input</h3>
            <InferencePane
              inputText={inputText} 
              setInputText={setInputText}
              isQA={selectedTask === 'question-answering'} 
              selectedTask={selectedTask}
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
            <Button 
                onClick={handleRunInference} 
                disabled={isLoading || !inputText.trim() || (selectedTask === 'question-answering' && !contextText.trim())}
            >
                {isLoading ? 'Processing...' : 'Run Inference'}
            </Button>
        </div>
      )}
      
      {operationMode === 'inference' && currentModelName && selectedTask === 'text-generation' && (
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

      {operationMode === 'finetune' && currentModelName && selectedTask && (
        <FineTuningPane
          fineTuneParams={fineTuneParams}
          setFineTuneParams={setFineTuneParams}
          handleStartFineTuning={handleStartFineTuning}
          isLoading={isLoading}
          selectedTask={selectedTask}
        />
      )}

      {/* Anomaly Detection Pane */}
      {operationMode === 'anomaly' && (
        <div className="p-4 border border-gray-700 rounded-md space-y-4">
            <h2 className="text-lg font-medium text-indigo-400">Anomaly Detection</h2>
            <div>
                <Label htmlFor="anomaly-text">Text to Analyze</Label>
                <TextArea
                    id="anomaly-text"
                    value={anomalyText}
                    onChange={(e) => setAnomalyText(e.target.value)}
                    placeholder="Enter text to check for anomalies..."
                    rows={4}
                />
            </div>
            <div>
                <Label htmlFor="embedding_model_name">Embedding Model Name</Label>
                <Input
                    id="embedding_model_name"
                    name="embedding_model_name"
                    value={anomalyParams.embedding_model_name}
                    onChange={handleAnomalyParamChange}
                    placeholder="e.g., sentence-transformers/all-MiniLM-L6-v2"
                />
            </div>
            <div>
                <Label htmlFor="autoencoder_model_path">Autoencoder Model Path (.pth)</Label>
                <Input
                    id="autoencoder_model_path"
                    name="autoencoder_model_path"
                    value={anomalyParams.autoencoder_model_path}
                    onChange={handleAnomalyParamChange}
                    placeholder="e.g., ./saved_models/autoencoder.pth"
                />
                 <p className="text-xs text-gray-400 mt-1">Path relative to the backend server.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="autoencoder_embedding_dim">AE Embedding Dim</Label>
                    <Input
                        id="autoencoder_embedding_dim"
                        name="autoencoder_embedding_dim"
                        type="number"
                        value={anomalyParams.autoencoder_embedding_dim}
                        onChange={handleAnomalyParamChange}
                    />
                </div>
                <div>
                    <Label htmlFor="autoencoder_encoding_dim">AE Encoding Dim (Bottleneck)</Label>
                    <Input
                        id="autoencoder_encoding_dim"
                        name="autoencoder_encoding_dim"
                        type="number"
                        value={anomalyParams.autoencoder_encoding_dim}
                        onChange={handleAnomalyParamChange}
                    />
                </div>
                <div>
                    <Label htmlFor="threshold">Anomaly Threshold</Label>
                    <Input
                        id="threshold"
                        name="threshold"
                        type="text" // Use text to allow float input easily, parse later
                        value={anomalyParams.threshold}
                        onChange={handleAnomalyParamChange}
                        placeholder="e.g., 0.1"
                    />
                </div>
            </div>
            <Button onClick={handleDetectAnomaly} disabled={isLoading || !anomalyText.trim() || !anomalyParams.autoencoder_model_path.trim()}>
                {isLoading ? 'Detecting...' : 'Detect Anomaly'}
            </Button>
        </div>
      )}


      <ResultsDisplay results={results} error={error} isLoading={isLoading && (!results && !error)} />
    </div>
  );
};

export default HuggingFaceOrchestrator;
