import React from 'react';
import Button from '../../Elements/Button/index';
import Typography from '../../Elements/AdminSource/Typhography';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <Typography variant="body2" className="text-gray-600">
        Menampilkan {startItem} - {endItem} dari {totalItems} data
      </Typography>
      
      <div className="flex justify-center space-x-2">
        <Button
          onClick={handlePrevPage}
          size="sm"
          variant="secondary"
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            onClick={() => onPageChange(i + 1)}
            size="sm"
            variant={currentPage === i + 1 ? 'primary' : 'secondary'}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          onClick={handleNextPage}
          size="sm"
          variant="secondary"
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;