const SelectInput = ({ label, options = [], className = "", error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};