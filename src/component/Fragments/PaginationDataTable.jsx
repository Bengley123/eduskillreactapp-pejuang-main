import React from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import Button from '../Elements/Button/index';
import Icon from '../Elements/AdminSource/Icon';
import Pagination from '../Moleculs/AdminSource/Pagination';
import { FaPlus, FaSearch } from 'react-icons/fa';

const PaginatedDataTable = ({ 
  title, 
  columns, 
  data, 
  currentPage,
  itemsPerPage,
  onPageChange,
  hasActions = false, 
  onAdd, 
  onRowAction,
  className = ""
}) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`bg-white rounded shadow ${className}`}>
      <div className="p-4">
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
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="text-left p-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="text-left p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={row.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-2">
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-2">
                      {onRowAction && (
                        <button 
                          onClick={() => onRowAction(row, index)}
                          className="text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <Icon icon={FaSearch} size="sm" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PaginatedDataTable;