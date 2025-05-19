// components/HuggingFaceOrchestrator/ModelSelector.js
import { useState, useEffect } from 'react';
import { Label, Select, Input } from './shared/FormElements';

// Example model lists - added summarization and translation models
const MODEL_SUGGESTIONS = {
  'text-classification': [
    { id: 'distilbert-base-uncased-finetuned-sst-2-english', name: 'DistilBERT SST-2 (Sentiment)' },
    { id: 'bert-base-uncased', name: 'BERT Base (Fine-tune for classification)' },
    { id: 'facebook/bart-large-mnli', name: 'BART Large MNLI (Zero-shot Classification)'},
  ],
  'text-generation': [
    { id: 'gpt2', name: 'GPT-2' },
    { id: 'distilgpt2', name: 'DistilGPT-2 (Smaller)' },
    { id: 'openai-community/gpt2-medium', name: 'GPT-2 Medium' },
  ],
  'question-answering': [
    { id: 'distilbert-base-cased-distilled-squad', name: 'DistilBERT SQuAD' },
    { id: 'bert-large-uncased-whole-word-masking-finetuned-squad', name: 'BERT Large SQuAD'},
  ],
  'summarization': [
    { id: 'facebook/bart-large-cnn', name: 'BART Large CNN (News Summarization)' },
    { id: 't5-small', name: 'T5 Small (General Summarization/Translation)' },
    { id: 'google/pegasus-xsum', name: 'PEGASUS XSUM (Abstractive Summarization)'},
    { id: 'sshleifer/distilbart-cnn-12-6', name: 'DistilBART CNN 12-6 (Smaller Summarization)'}
  ],
  'translation': [
    { id: 't5-small', name: 'T5 Small (EN/FR/DE/RO)' },
    { id: 'Helsinki-NLP/opus-mt-en-fr', name: 'Opus MT (English to French)' },
    { id: 'Helsinki-NLP/opus-mt-fr-en', name: 'Opus MT (French to English)' },
    { id: 'Helsinki-NLP/opus-mt-en-es', name: 'Opus MT (English to Spanish)' },
    { id: 'Helsinki-NLP/opus-mt-es-en', name: 'Opus MT (Spanish to English)' },
    // Add more language pairs as needed
  ],
  'token-classification': [
    { id: 'dbmdz/bert-large-cased-finetuned-conll03-english', name: 'BERT Large CoNLL03 (NER)'},
    { id: 'Jean-Baptiste/camembert-ner', name: 'CamemBERT NER (French)'}
  ]
  // ... add more for other tasks
};

const ModelSelector = ({ selectedTask, selectedModel, setSelectedModel, customModelName, setCustomModelName }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Update suggestions based on the selected task
    const taskSuggestions = MODEL_SUGGESTIONS[selectedTask] || [];
    setSuggestions(taskSuggestions);

    // If the currently selected model is not in the new list of suggestions (and not 'custom'),
    // it might be good to reset it or handle it, but for now, we'll let it persist
    // until the user makes a new selection or types a custom model.
    // If a task is selected and no model is selected, or the selected model is not valid for the task,
    // you might want to default to the first suggestion or clear it.
    if (selectedTask && taskSuggestions.length > 0 && !taskSuggestions.find(m => m.id === selectedModel) && selectedModel !== 'custom') {
        // Optionally, uncomment to reset model if it's not in the new suggestions:
        // setSelectedModel(''); 
        // setCustomModelName('');
    }

  }, [selectedTask, selectedModel]); // Removed setSelectedModel and setCustomModelName from dependencies to avoid potential loops

  const handleModelChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setSelectedModel('custom');
      // Keep customModelName as is, user might be switching back and forth
    } else {
      setSelectedModel(value);
      setCustomModelName(''); // Clear custom name only if a pre-defined suggestion is picked
    }
  };

  return (
    <div>
      <Label htmlFor="model-select">Select Pre-trained Model</Label>
      <Select id="model-select" value={selectedModel} onChange={handleModelChange} disabled={!selectedTask}>
        <option value="">-- Select a Model --</option>
        {suggestions.map(model => (
          <option key={model.id} value={model.id}>{model.name} ({model.id.split('/')[1]})</option>
        ))}
        <option value="custom">Custom Model Name...</option>
      </Select>
      {selectedModel === 'custom' && (
        <Input
          id="custom-model-name"
          type="text"
          value={customModelName}
          onChange={(e) => setCustomModelName(e.target.value)}
          placeholder="Enter Hugging Face model ID (e.g., openai-community/gpt2)"
          className="mt-2"
        />
      )}
      {selectedModel && selectedModel !== 'custom' && (
        <p className="text-xs text-gray-400 mt-1">Selected Model ID: {selectedModel}</p>
      )}
       {selectedModel === 'custom' && customModelName && (
        <p className="text-xs text-gray-400 mt-1">Custom Model ID: {customModelName}</p>
      )}
    </div>
  );
};

export default ModelSelector;
