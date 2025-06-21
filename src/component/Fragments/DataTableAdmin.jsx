import React from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import Button from '../Elements/Button/index';
import TableRow from '../Moleculs/AdminSource/TableRow';
import Icon from '../Elements/AdminSource/Icon';
import { FaPlus } from 'react-icons/fa';

const DataTable = ({ 
  title, 
  columns, 
  data, 
  hasActions = false, 
  onAdd, 
  onEdit, 
  onDelete,
  className = ""
}) => {
  return (
    <div className={`bg-white p-4 rounded shadow mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3">{title}</Typography>
        {onAdd && (
          <Button onClick={onAdd} size="sm" className="flex items-center gap-2">
            <Icon icon={FaPlus} size="sm" color="white" />
            Tambah
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                data={row}
                columns={columns}
                hasActions={hasActions}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;