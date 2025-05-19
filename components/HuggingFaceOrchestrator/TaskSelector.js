// components/HuggingFaceOrchestrator/TaskSelector.js
import { Label, Select } from './shared/FormElements';

const NLP_TASKS = [
  { id: 'text-classification', name: 'Text Classification (e.g., Sentiment)' },
  { id: 'text-generation', name: 'Text Generation' },
  { id: 'question-answering', name: 'Question Answering' },
  { id: 'summarization', name: 'Summarization' },
  { id: 'translation', name: 'Translation' },
  { id: 'token-classification', name: 'Token Classification (e.g., NER)' },
  // Add more tasks as needed
];

const TaskSelector = ({ selectedTask, setSelectedTask }) => {
  return (
    <div>
      <Label htmlFor="nlp-task">Select NLP Task</Label>
      <Select id="nlp-task" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
        <option value="">-- Select a Task --</option>
        {NLP_TASKS.map(task => (
          <option key={task.id} value={task.id}>{task.name}</option>
        ))}
      </Select>
    </div>
  );
};

export default TaskSelector;
