import { FaSearch } from 'react-icons/fa';

const InputSearch = ({ placeholder, onChange }) => {
  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder={placeholder || 'Cari...'}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
};

export default InputSearch;
