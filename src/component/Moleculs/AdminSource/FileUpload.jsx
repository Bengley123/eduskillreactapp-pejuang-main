import React from 'react';
import Typography from '../../Elements/AdminSource/Typhography';
import DocumentLink from '../../Moleculs/AdminSource/DocumentLink';

const FileUpload = ({ label, currentFile, onFileChange, accept = "*" }) => {
  return (
    <div>
      <Typography variant="caption" className="text-gray-500 mb-1 block">
        {label}
      </Typography>
      {currentFile && <DocumentLink filename={currentFile} className="mb-2" />}
      <input 
        type="file" 
        accept={accept}
        onChange={onFileChange}
        className="w-full p-1 border rounded text-xs"
      />
    </div>
  );
};

export default FileUpload;