// components/HuggingFaceOrchestrator/HuggingFaceOrchestrator.js
import { useState } from 'react';
import TaskSelector from './TaskSelector';
import ModelSelector from './ModelSelector';
import InferencePane from './InferencePane';
import FineTuningPane from './FineTuningPane';
import ResultsDisplay from './ResultsDisplay';
import { Label, Select, Checkbox, Button } from './shared/FormElements'; // Checkbox and Button added

const HuggingFaceOrchestrator = () => {
  const [operationMode, setOperationMode] = useState('inference'); // 'inference' or 'finetune'
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedModel, setSelectedModel] = useState(''); // Can be a suggested ID or 'custom'
  const [customModelName, setCustomModelName] = useState(''); // Actual name if selectedModel is 'custom'

  // Inference state
  const [inputText, setInputText] = useState('');

  // Fine-tuning state
  const [fineTuneParams, setFineTuneParams] = useState({
    datasetPath: '',
    epochs: 3,
    batchSize: 8,
    learningRate: '2e-5',
    useLoRA: true,
    loraConfig: {
      r: 8,
      alpha: 16,
      dropout: '0.05',
      targetModules: 'q_proj,v_proj', // Example, should be adjusted per model
    }
  });

  // Quantization state
  const [quantizationOption, setQuantizationOption] = useState('none'); // 'none', 'dynamic_int8', 'static_int8' (example)

  // Results and loading state
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFinalModelName = () => {
    return selectedModel === 'custom' ? customModelName : selectedModel;
  };

  // --- API Call Placeholders ---
  const handleRunInference = async () => {
    const modelToUse = getFinalModelName();
    if (!modelToUse || !selectedTask || !inputText) {
      setError('Please select a task, model, and provide input text.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    console.log('Running inference with:', { task: selectedTask, model: modelToUse, text: inputText, quantization: quantizationOption });
    // Replace with actual API call
    try {
      // const response = await fetch('/api/hf-inference', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ task: selectedTask, model: modelToUse, inputText, quantization: quantizationOption }),
      // });
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // const data = await response.json();
      // setResults(data);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResults({ prediction: `Mocked sentiment for "${inputText}" is POSITIVE (Model: ${modelToUse}, Task: ${selectedTask}, Q: ${quantizationOption})` });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFineTuning = async () => {
    const modelToUse = getFinalModelName();
    if (!modelToUse || !selectedTask || !fineTuneParams.datasetPath) {
      setError('Please select a task, model, and provide a dataset path for fine-tuning.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null); // Clear previous results, show logs/status here
    console.log('Starting fine-tuning with:', { task: selectedTask, model: modelToUse, params: fineTuneParams, quantization: quantizationOption });
    // Replace with actual API call
    try {
      // const response = await fetch('/api/hf-finetune', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ task: selectedTask, model: modelToUse, fineTuneParams, quantization: quantizationOption }), // Quantization might be post-finetuning
      // });
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // const data = await response.json(); // Expect job ID or status
      // setResults(data); // e.g., { jobId: '123', status: 'submitted', logUrl: '...' }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResults({ message: `Fine-tuning job started for ${modelToUse} on ${fineTuneParams.datasetPath}. Check backend logs. LoRA: ${fineTuneParams.useLoRA}`, params: fineTuneParams });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentModelName = getFinalModelName();


  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-gray-100 rounded-lg shadow-xl space-y-6">
      <h1 className="text-2xl font-semibold text-indigo-400 mb-6">Model Orchestration Lab</h1>

      {/* Operation Mode Toggle */}
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

      {/* Common Configuration */}
      <div className="space-y-4 p-4 border border-gray-700 rounded-md">
        <h2 className="text-lg font-medium text-indigo-400">Common Configuration</h2>
        <TaskSelector selectedTask={selectedTask} setSelectedTask={(task) => {setSelectedTask(task); setSelectedModel(''); setCustomModelName('');}} />
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

      {/* Quantization (could be conditional based on mode) */}
      {(currentModelName) && (
        <div className="p-4 border border-gray-700 rounded-md">
          <Label htmlFor="quantization-option">Quantization (Applied during/after process)</Label>
          <Select id="quantization-option" value={quantizationOption} onChange={(e) => setQuantizationOption(e.target.value)}>
            <option value="none">None</option>
            <option value="dynamic_int8_cpu">Dynamic INT8 (CPU PyTorch)</option>
            {/* <option value="static_int8_cpu">Static INT8 (CPU PyTorch)</option> */}
            {/* <option value="bitsandbytes_nf4">BitsAndBytes NF4 (GPU)</option> */}
          </Select>
          <p className="text-xs text-gray-400 mt-1">Note: Actual applicability depends on backend & model support.</p>
        </div>
      )}


      {/* Mode-Specific Panes */}
      {currentModelName && selectedTask && operationMode === 'inference' && (
        <InferencePane
          inputText={inputText}
          setInputText={setInputText}
          handleRunInference={handleRunInference}
          isLoading={isLoading}
        />
      )}

      {currentModelName && selectedTask && operationMode === 'finetune' && (
        <FineTuningPane
          fineTuneParams={fineTuneParams}
          setFineTuneParams={setFineTuneParams}
          handleStartFineTuning={handleStartFineTuning}
          isLoading={isLoading}
        />
      )}

      {/* Results / Error Display */}
      <ResultsDisplay results={results} error={error} isLoading={isLoading && (!results && !error)} />

    </div>
  );
};

export default HuggingFaceOrchestrator;
