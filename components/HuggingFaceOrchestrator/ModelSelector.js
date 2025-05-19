// components/HuggingFaceOrchestrator/ModelSelector.js
import { useState, useEffect } from 'react';
import { Label, Select, Input } from './shared/FormElements';

// Example model lists (expand significantly or fetch dynamically)
const MODEL_SUGGESTIONS = {
  'text-classification': [
    { id: 'distilbert-base-uncased-finetuned-sst-2-english', name: 'DistilBERT SST-2 (Sentiment)' },
    { id: 'bert-base-uncased', name: 'BERT Base (Fine-tune for classification)' },
  ],
  'text-generation': [
    { id: 'gpt2', name: 'GPT-2' },
    { id: 'distilgpt2', name: 'DistilGPT-2 (Smaller)' },
  ],
  'question-answering': [
    { id: 'distilbert-base-cased-distilled-squad', name: 'DistilBERT SQuAD' },
  ],
  // ... add more for other tasks
};

const ModelSelector = ({ selectedTask, selectedModel, setSelectedModel, customModelName, setCustomModelName }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(MODEL_SUGGESTIONS[selectedTask] || []);
    if (selectedTask && !(MODEL_SUGGESTIONS[selectedTask] || []).find(m => m.id === selectedModel)) {
        // If current model is not in new suggestions, reset or set to custom
        // For simplicity, we let user manage this or it defaults to custom input
    }
  }, [selectedTask, selectedModel]);

  const handleModelChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setSelectedModel('custom');
    } else {
      setSelectedModel(value);
      setCustomModelName(''); // Clear custom name if a suggestion is picked
    }
  };

  return (
    <div>
      <Label htmlFor="model-select">Select Pre-trained Model</Label>
      <Select id="model-select" value={selectedModel} onChange={handleModelChange} disabled={!selectedTask}>
        <option value="">-- Select a Model --</option>
        {suggestions.map(model => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
        <option value="custom">Custom Model Name</option>
      </Select>
      {selectedModel === 'custom' && (
        <Input
          id="custom-model-name"
          type="text"
          value={customModelName}
          onChange={(e) => setCustomModelName(e.target.value)}
          placeholder="Enter Hugging Face model name (e.g., openai-community/gpt2)"
          className="mt-2"
        />
      )}
      {selectedModel && selectedModel !== 'custom' && (
        <p className="text-xs text-gray-400 mt-1">Selected: {selectedModel}</p>
      )}
    </div>
  );
};

export default ModelSelector;
