import React from 'react';
import Typography from '../../Elements/AdminSource/Typhography';
import Icon from '../../Elements/AdminSource/Icon';
import Button from '../../Elements/Button/index';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TableRow = ({ data, columns, hasActions = false, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      {columns.map((column, index) => (
        <td key={index} className="px-4 py-2">
          {column.render ? column.render(data[column.key]) : data[column.key]}
        </td>
      ))}
      {hasActions && (
        <td className="px-4 py-2 text-center space-x-2">
          <button 
            onClick={() => onEdit?.(data)}
            className="text-blue-500 hover:text-blue-700 transition-colors p-1"
          >
            <Icon icon={FaEdit} color="blue-500" />
          </button>
          <button 
            onClick={() => onDelete?.(data)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
          >
            <Icon icon={FaTrash} color="red-500" />
          </button>
        </td>
      )}
    </tr>
  );
};

export default TableRow;