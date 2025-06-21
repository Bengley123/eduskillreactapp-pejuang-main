import React, { useState } from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import Button from '../Elements/Button/index';
import InputText from '../Elements/Input/Input';
import Label from '../Elements/Input/Label';
import FileUpload from '../Moleculs/AdminSource/FileUpload';
import DocumentLink from '../Moleculs/AdminSource/DocumentLink';
import Icon from '../Elements/AdminSource/Icon';
import { FaTimes, FaEdit, FaSave, FaTrashAlt, FaUser, FaFile, FaEye, FaDownload, FaArchive, FaSpinner, FaComment } from 'react-icons/fa';
import JSZip from 'jszip';

const DetailModal = ({ 
  isOpen, 
  onClose, 
  title, 
  data, 
  isEditing, 
  editedData, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onInputChange,
  onFileChange,
  fields = [],
  documentFields = [], // Optional - untuk peserta
  showDocuments = false // Optional - untuk peserta
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  if (!isOpen || !data) return null;

  // Deteksi apakah ini halaman feedback atau peserta berdasarkan props
  const isFeedbackModal = !showDocuments && documentFields.length === 0;
  const isPesertaModal = showDocuments || documentFields.length > 0;

  // Pisahkan fields berdasarkan tipe (hanya untuk peserta)
  const infoFields = isPesertaModal ? fields.filter(field => field.type !== 'file') : fields;
  const fileFields = isPesertaModal ? (documentFields.length > 0 ? documentFields : fields.filter(field => field.type === 'file')) : [];

  // Fungsi untuk download semua dokumen sebagai ZIP (hanya untuk peserta)
  const downloadAllDocumentsAsZip = async () => {
    if (!isPesertaModal) return;
    
    setIsDownloadingZip(true);
    
    try {
      const zip = new JSZip();
      
      // Filter dokumen yang tersedia
      const availableDocuments = fileFields.filter(field => {
        const fileUrl = data[field.key];
        return fileUrl && fileUrl !== null && fileUrl !== '';
      });

      if (availableDocuments.length === 0) {
        alert('Tidak ada dokumen yang tersedia untuk didownload');
        return;
      }

      // Nama folder berdasarkan nama peserta
      const folderName = `Dokumen_${data.nama?.replace(/\s+/g, '_') || 'Peserta'}`;
      const folder = zip.folder(folderName);

      // Download dan tambahkan setiap file ke ZIP
      const downloadPromises = availableDocuments.map(async (field) => {
        try {
          const fileUrl = data[field.key];
          const response = await fetch(fileUrl);
          
          if (!response.ok) {
            console.warn(`Failed to download ${field.label}: ${response.statusText}`);
            return null;
          }

          const blob = await response.blob();
          
          // Ekstrak nama file dari URL atau gunakan nama field
          let fileName = field.label;
          try {
            const urlPath = new URL(fileUrl).pathname;
            const originalName = urlPath.split('/').pop();
            if (originalName && originalName.includes('.')) {
              fileName = `${field.label}_${originalName}`;
            } else {
              // Tentukan ekstensi berdasarkan mime type
              const mimeType = blob.type;
              let extension = '';
              if (mimeType.includes('pdf')) extension = '.pdf';
              else if (mimeType.includes('image/jpeg')) extension = '.jpg';
              else if (mimeType.includes('image/png')) extension = '.png';
              else if (mimeType.includes('image/')) extension = '.jpg';
              else extension = '.pdf'; // default
              
              fileName = `${field.label}${extension}`;
            }
          } catch (e) {
            fileName = `${field.label}.pdf`; // fallback
          }

          folder.file(fileName, blob);
          return { field: field.label, success: true };
        } catch (error) {
          console.error(`Error downloading ${field.label}:`, error);
          return { field: field.label, success: false, error: error.message };
        }
      });

      const results = await Promise.all(downloadPromises);
      
      // Filter hasil yang berhasil
      const successCount = results.filter(r => r && r.success).length;
      const failedCount = results.filter(r => r && !r.success).length;

      if (successCount === 0) {
        alert('Gagal mendownload semua dokumen. Silakan coba lagi atau download satu per satu.');
        return;
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // Show result message
      let message = `✅ Berhasil mendownload ${successCount} dokumen sebagai ZIP`;
      if (failedCount > 0) {
        message += `\n⚠️ ${failedCount} dokumen gagal didownload`;
      }
      alert(message);

    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Gagal membuat file ZIP. Silakan coba lagi atau download dokumen satu per satu.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const renderField = (field) => {
    const currentData = isEditing ? editedData : data;
    const value = currentData[field.key] || '';

    if (field.type === 'file') {
      return isEditing ? (
        <FileUpload 
          label=""
          currentFile={value}
          onFileChange={(e) => onFileChange && onFileChange(field.key, e)}
          accept={field.accept}
        />
      ) : (
        <div className="flex items-center justify-between">
          <DocumentLink filename={value} />
          {value && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => window.open(value, '_blank')}
                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                title="Lihat file"
              >
                <Icon icon={FaEye} size="sm" />
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = value;
                  link.download = value.split('/').pop() || field.label;
                  link.target = '_blank';
                  link.click();
                }}
                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                title="Download file"
              >
                <Icon icon={FaDownload} size="sm" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea 
          value={value}
          onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
          className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
          rows="3"
          readOnly={!isEditing || field.readonly}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
          className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
          disabled={!isEditing || field.readonly}
        >
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.render) {
      return field.render(currentData, isEditing, onInputChange);
    }

    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
        className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
        readOnly={!isEditing || field.readonly}
      />
    );
  };

  // Hitung jumlah dokumen yang tersedia (hanya untuk peserta)
  const availableDocumentsCount = isPesertaModal ? fileFields.filter(field => {
    const fileUrl = data[field.key];
    return fileUrl && fileUrl !== null && fileUrl !== '';
  }).length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <Typography variant="h3">{title}</Typography>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon={FaTimes} size="md" />
          </button>
        </div>

        {/* Tab Navigation - hanya tampil untuk peserta yang ada dokumen */}
        {isPesertaModal && showDocuments && fileFields.length > 0 && (
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 px-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon={FaUser} size="sm" className="inline mr-2" />
                Informasi Peserta
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon={FaFile} size="sm" className="inline mr-2" />
                Dokumen ({availableDocumentsCount})
              </button>
            </nav>
          </div>
        )}

        {/* Tab Navigation - untuk feedback (simple) */}
        {isFeedbackModal && (
          <div className="border-b border-gray-200">
            <nav className="flex px-4">
              <div className="py-3 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                <Icon icon={FaComment} size="sm" className="inline mr-2" />
                Detail Feedback
              </div>
            </nav>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 max-h-60 overflow-y-auto">
          {/* Tab Info - Informasi Peserta atau Detail Feedback */}
          {(isFeedbackModal || !showDocuments || activeTab === 'info') && (
            <div className="space-y-3">
              {infoFields.map((field, index) => (
                <div key={index}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

          {/* Tab Documents - File Dokumen (hanya untuk peserta) */}
          {isPesertaModal && showDocuments && activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h4">Dokumen Peserta</Typography>
                {availableDocumentsCount > 0 && !isEditing && (
                  <Button
                    onClick={downloadAllDocumentsAsZip}
                    variant="primary"
                    size="sm"
                    disabled={isDownloadingZip}
                    className="flex items-center gap-2"
                  >
                    {isDownloadingZip ? (
                      <>
                        <Icon icon={FaSpinner} size="sm" className="animate-spin" />
                        Membuat ZIP...
                      </>
                    ) : (
                      <>
                        <Icon icon={FaArchive} size="sm" />
                        Download All ZIP ({availableDocumentsCount})
                      </>
                    )}
                  </Button>
                )}
              </div>

              {fileFields.length > 0 ? (
                <div className="space-y-3">
                  {fileFields.map((field, index) => {
                    const hasFile = data[field.key] && data[field.key] !== null && data[field.key] !== '';
                    return (
                      <div key={index} className={`rounded-lg p-3 border ${hasFile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <Label htmlFor={field.key} className={`font-medium mb-2 block ${hasFile ? 'text-blue-800' : 'text-gray-700'}`}>
                          {field.label}
                          {hasFile && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              ✓ Tersedia
                            </span>
                          )}
                        </Label>
                        {renderField(field)}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Icon icon={FaFile} size="lg" className="mx-auto mb-2 opacity-50" />
                  <p>Tidak ada dokumen tersedia</p>
                </div>
              )}

              {availableDocumentsCount === 0 && fileFields.length > 0 && (
                <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                  <Icon icon={FaFile} size="md" className="mx-auto mb-2" />
                  <p className="text-sm">Belum ada dokumen yang diupload</p>
                </div>
              )}
            </div>
          )}

          {/* Fallback - jika peserta tidak ada showDocuments tapi ada file fields */}
          {isPesertaModal && !showDocuments && fileFields.length > 0 && activeTab === 'info' && (
            <div className="space-y-3 mt-4">
              <hr className="my-4" />
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h4">Dokumen</Typography>
                {availableDocumentsCount > 0 && !isEditing && (
                  <Button
                    onClick={downloadAllDocumentsAsZip}
                    variant="primary"
                    size="sm"
                    disabled={isDownloadingZip}
                    className="flex items-center gap-2"
                  >
                    {isDownloadingZip ? (
                      <>
                        <Icon icon={FaSpinner} size="sm" className="animate-spin" />
                        Membuat ZIP...
                      </>
                    ) : (
                      <>
                        <Icon icon={FaArchive} size="sm" />
                        Download ZIP
                      </>
                    )}
                  </Button>
                )}
              </div>
              {fileFields.map((field, index) => (
                <div key={index}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={onCancel} variant="secondary" size="sm">
                  Batal
                </Button>
                <Button onClick={onSave} variant="primary" size="sm" className="flex items-center gap-1">
                  <Icon icon={FaSave} size="sm" color="white" />
                  Simpan
                </Button>
              </>
            ) : (
              onEdit && (
                <Button onClick={onEdit} variant="primary" size="sm" className="flex items-center gap-1">
                  <Icon icon={FaEdit} size="sm" color="white" />
                  Edit
                </Button>
              )
            )}
          </div>
          
          <div className="flex gap-2">
            {onDelete && !isEditing && (
              <Button onClick={onDelete} variant="danger" size="sm" className="flex items-center gap-1">
                <Icon icon={FaTrashAlt} size="sm" color="white" />
                Hapus
              </Button>
            )}
            <Button onClick={onClose} variant="secondary" size="sm">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;