import { FaCheck, FaTimesCircle } from 'react-icons/fa';
export const StatusDisplay = ({ shown }) => (
  shown ? (
    <span className="text-green-500 flex items-center gap-1">
      <FaCheck size={12} /> Ya
    </span>
  ) : (
    <span className="text-red-500 flex items-center gap-1">
      <FaTimesCircle size={12} /> Tidak
    </span>
  )
);