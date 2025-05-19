// components/HuggingFaceOrchestrator/FineTuningPane.js
import { Label, Input, Button, Checkbox } from './shared/FormElements';

const FineTuningPane = ({ fineTuneParams, setFineTuneParams, handleStartFineTuning, isLoading, selectedTask }) => {
  
  // Handles changes for top-level fineTuneParams
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? null : parseFloat(value); // Allow clearing number fields, send null
    }
    if (type === 'checkbox') {
      parsedValue = checked;
    }
    
    setFineTuneParams(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Handles changes for nested lora_config parameters
  const handleLoRAChange = (e) => {
    const { name, value } = e.target;
    // Assuming lora params like r, alpha are numbers, dropout can be float string
    let parsedValue = value;
    if (name === 'r' || name === 'alpha') {
        parsedValue = value === '' ? null : parseInt(value, 10);
    } else if (name === 'dropout') {
        parsedValue = value === '' ? null : parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = value; // Keep as string if not a valid float for now
    }

    setFineTuneParams(prev => ({
      ...prev,
      lora_config: { // Ensure this is snake_case
        ...prev.lora_config, // Ensure this is snake_case
        [name]: parsedValue,
      }
    }));
  };


  return (
    <div className="space-y-6 p-4 border border-gray-700 rounded-md">
      <h3 className="text-lg font-medium text-indigo-400">Fine-Tuning Configuration</h3>

      {/* Dataset Path */}
      <div>
        <Label htmlFor="datasetPath">Dataset Path/Identifier (HF Hub or local .csv)</Label>
        <Input
          id="datasetPath"
          name="datasetPath"
          value={fineTuneParams.datasetPath}
          onChange={handleChange}
          placeholder="e.g., your_hf_dataset_name or path/to/data.csv"
        />
      </div>

      {/* Column Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="text_column">
                {selectedTask === 'question-answering' ? 'Question Column Name' : 'Text Column Name'}
            </Label>
            <Input id="text_column" name="text_column" value={fineTuneParams.text_column} onChange={handleChange} placeholder="e.g., text, question"/>
        </div>
        <div>
            <Label htmlFor="label_column">
                {selectedTask === 'question-answering' ? 'Answers Column Name' : 'Label Column Name'}
            </Label>
            <Input id="label_column" name="label_column" value={fineTuneParams.label_column} onChange={handleChange} placeholder="e.g., label, answers"/>
        </div>
        {selectedTask === 'question-answering' && (
            <div className="md:col-span-2"> {/* Spans full width on medium screens if only one item */}
                <Label htmlFor="context_column">Context Column Name (for QA)</Label>
                <Input id="context_column" name="context_column" value={fineTuneParams.context_column} onChange={handleChange} placeholder="e.g., context"/>
            </div>
        )}
      </div>


      {/* Basic Training Args */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="epochs">Epochs</Label>
          <Input id="epochs" name="epochs" type="number" value={fineTuneParams.epochs || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="batchSize">Batch Size</Label>
          <Input id="batchSize" name="batchSize" type="number" value={fineTuneParams.batchSize || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="learningRate">Learning Rate</Label>
          <Input id="learningRate" name="learningRate" type="text" value={fineTuneParams.learningRate} onChange={handleChange} placeholder="e.g., 2e-5" />
        </div>
        <div>
          <Label htmlFor="max_seq_length">Max Sequence Length</Label>
          <Input id="max_seq_length" name="max_seq_length" type="number" value={fineTuneParams.max_seq_length || ''} onChange={handleChange} />
        </div>
        {selectedTask === 'text-classification' && (
            <div className="md:col-span-2">
                <Label htmlFor="num_labels">Number of Labels (Optional for Classification)</Label>
                <Input 
                    id="num_labels" 
                    name="num_labels" 
                    type="number" 
                    value={fineTuneParams.num_labels === null ? '' : fineTuneParams.num_labels} 
                    onChange={handleChange} 
                    placeholder="e.g., 2 (if not inferable)" 
                />
            </div>
        )}
      </div>

      {/* PEFT/LoRA Configuration */}
      <div className="pt-4">
        <Checkbox
            id="useLoRA"
            name="useLoRA"
            checked={fineTuneParams.useLoRA}
            onChange={handleChange}
            label="Enable LoRA (Parameter-Efficient Fine-Tuning)"
        />
        {fineTuneParams.useLoRA && fineTuneParams.lora_config && ( // Added check for lora_config existence
            <div className="mt-3 pl-4 border-l-2 border-indigo-500 space-y-3">
                <p className="text-sm text-indigo-300 mb-2">LoRA Parameters:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="loraR">LoRA r (Rank)</Label>
                        {/* Accessing with fineTuneParams.lora_config (snake_case) */}
                        <Input id="loraR" name="r" type="number" value={fineTuneParams.lora_config.r || ''} onChange={handleLoRAChange} />
                    </div>
                    <div>
                        <Label htmlFor="loraAlpha">LoRA Alpha</Label>
                        <Input id="loraAlpha" name="alpha" type="number" value={fineTuneParams.lora_config.alpha || ''} onChange={handleLoRAChange} />
                    </div>
                    <div>
                        <Label htmlFor="loraDropout">LoRA Dropout</Label>
                        <Input id="loraDropout" name="dropout" type="text" value={fineTuneParams.lora_config.dropout || ''} onChange={handleLoRAChange} placeholder="e.g., 0.05"/>
                    </div>
                    <div>
                        <Label htmlFor="loraTargetModules">Target Modules (comma-sep)</Label>
                        <Input id="loraTargetModules" name="targetModules" value={fineTuneParams.lora_config.target_modules || ''} onChange={handleLoRAChange} placeholder="e.g., q_proj,v_proj"/>
                    </div>
                </div>
            </div>
        )}
      </div>

      <Button onClick={handleStartFineTuning} disabled={isLoading || !fineTuneParams.datasetPath}>
        {isLoading ? 'Fine-Tuning...' : 'Start Fine-Tuning'}
      </Button>
    </div>
  );
};

export default FineTuningPane;
