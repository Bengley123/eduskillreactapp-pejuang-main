// src/Atoms/TextArea.js
const TextArea = ({ value, onChange, placeholder, rows }) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder={placeholder}
  />
);

export default TextArea;
