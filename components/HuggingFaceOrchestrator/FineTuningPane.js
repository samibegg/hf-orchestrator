// components/HuggingFaceOrchestrator/FineTuningPane.js
import { Label, Input, Button, Checkbox } from './shared/FormElements';

const FineTuningPane = ({ fineTuneParams, setFineTuneParams, handleStartFineTuning, isLoading }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFineTuneParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLoRAChange = (e) => {
    const { name, value, type } = e.target;
     // LoRA params are nested
    setFineTuneParams(prev => ({
      ...prev,
      loraConfig: {
        ...prev.loraConfig,
        [name]: type === 'number' ? parseFloat(value) : value,
      }
    }));
  };


  return (
    <div className="space-y-6 p-4 border border-gray-700 rounded-md">
      <h3 className="text-lg font-medium text-indigo-400">Fine-Tuning Configuration</h3>

      {/* Dataset */}
      <div>
        <Label htmlFor="dataset-path">Dataset Path/Identifier</Label>
        <Input
          id="dataset-path"
          name="datasetPath"
          value={fineTuneParams.datasetPath}
          onChange={handleChange}
          placeholder="e.g., your_hf_dataset_name or path/to/data.csv"
        />
        <p className="text-xs text-gray-400 mt-1">For CSV, ensure backend handles loading.</p>
      </div>

      {/* Basic Training Args */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="epochs">Epochs</Label>
          <Input id="epochs" name="epochs" type="number" value={fineTuneParams.epochs} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="batchSize">Batch Size</Label>
          <Input id="batchSize" name="batchSize" type="number" value={fineTuneParams.batchSize} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="learningRate">Learning Rate</Label>
          <Input id="learningRate" name="learningRate" type="text" value={fineTuneParams.learningRate} onChange={handleChange} placeholder="e.g., 2e-5" />
        </div>
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
        {fineTuneParams.useLoRA && (
            <div className="mt-3 pl-4 border-l-2 border-indigo-500 space-y-3">
                <p className="text-sm text-indigo-300 mb-2">LoRA Parameters:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="loraR">LoRA r (Rank)</Label>
                        <Input id="loraR" name="r" type="number" value={fineTuneParams.loraConfig.r} onChange={handleLoRAChange} />
                    </div>
                    <div>
                        <Label htmlFor="loraAlpha">LoRA Alpha</Label>
                        <Input id="loraAlpha" name="alpha" type="number" value={fineTuneParams.loraConfig.alpha} onChange={handleLoRAChange} />
                    </div>
                    <div>
                        <Label htmlFor="loraDropout">LoRA Dropout</Label>
                        <Input id="loraDropout" name="dropout" type="text" value={fineTuneParams.loraConfig.dropout} onChange={handleLoRAChange} placeholder="e.g., 0.05"/>
                    </div>
                    <div>
                        <Label htmlFor="loraTargetModules">Target Modules (comma-sep)</Label>
                        <Input id="loraTargetModules" name="targetModules" value={fineTuneParams.loraConfig.targetModules} onChange={handleLoRAChange} placeholder="e.g., q_proj,v_proj"/>
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
