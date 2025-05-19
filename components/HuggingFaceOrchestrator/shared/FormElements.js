// components/HuggingFaceOrchestrator/shared/FormElements.js

export const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-300 mb-1 ${className}`}>
    {children}
  </label>
);

export const Select = ({ id, value, onChange, children, className }) => (
  <select
    id={id}
    name={id}
    value={value}
    onChange={onChange}
    className={`mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
  >
    {children}
  </select>
);

export const Input = ({ id, type = 'text', value, onChange, placeholder, className, disabled }) => (
  <input
    type={type}
    id={id}
    name={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 ${className}`}
  />
);

export const TextArea = ({ id, value, onChange, placeholder, rows = 4, className }) => (
  <textarea
    id={id}
    name={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
  />
);

export const Button = ({ children, onClick, type = 'button', className, variant = 'primary', disabled }) => {
  const baseStyle = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  const variantStyles = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400",
    secondary: "text-indigo-300 bg-gray-700 hover:bg-gray-600 focus:ring-indigo-500 disabled:bg-gray-500",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className} disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

export const Checkbox = ({ id, checked, onChange, label, className }) => (
  <div className={`flex items-center ${className}`}>
    <input
      id={id}
      name={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 border-gray-500 rounded bg-gray-700 focus:ring-indigo-500"
    />
    <label htmlFor={id} className="ml-2 block text-sm text-gray-300">
      {label}
    </label>
  </div>
);
