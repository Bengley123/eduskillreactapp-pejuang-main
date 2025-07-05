// DetailModal.jsx

import React, { useState, useEffect } from 'react';
import Typography from '../Elements/AdminSource/Typhography';
import Button from '../Elements/Button/index';
import InputText from '../Elements/Input/Input';
import Label from '../Elements/Input/Label';
import FileUpload from '../Moleculs/AdminSource/FileUpload';
import DocumentLink from '../Moleculs/AdminSource/DocumentLink';
import Icon from '../Elements/AdminSource/Icon';
import { FaTimes, FaEdit, FaSave, FaTrashAlt, FaUser, FaFile, FaEye, FaDownload, FaArchive, FaSpinner, FaComment } from 'react-icons/fa';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


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
  fields = [], // Default to empty array to prevent issues if not provided
  documentFields = [], // Default to empty array
  showDocuments = false // Controls if the 'Documents' tab is shown
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  useEffect(() => {
    setActiveTab('info');
  }, [isOpen]);

  // Defensive check: If modal is not open or data is not provided, don't render.
  if (!isOpen || !data) return null;

  // Determine modal type based on props (Participant or Feedback/Generic)
  const isFeedbackModal = !showDocuments && documentFields.length === 0; // If no documents, it's feedback/generic
  const isPesertaModal = showDocuments || documentFields.length > 0; // If documents are shown or defined, it's a participant modal

  // Filter fields based on modal type and active tab
  // For Peserta Modal, 'infoFields' exclude 'file' type fields
  const infoFields = isPesertaModal
    ? fields.filter(field => field.type !== 'file')
    : fields;

  // 'fileFields' are explicitly passed document fields for Peserta Modal
  const fileFields = isPesertaModal
    ? (documentFields.length > 0 ? documentFields : [])
    : [];

  const getFileNameFromUrl = (url) => {
    if (!url) return 'N/A';
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      return pathSegments.pop() || 'File';
    } catch (e) {
      console.warn("Invalid URL for file name extraction:", url, e);
      return url.split('/').pop() || 'File';
    }
  };

  // Function to get the auth token from localStorage - KEEPING AS IS
  const getAuthToken = () => {
    const token = localStorage.getItem('jwt');
    console.log("DEBUG: Token retrieved from localStorage in getAuthToken:", token);
    return token;
  };

  // Function to download individual file - KEEPING AS IS
  const handleDownloadFile = async (fileUrl, suggestedFileName) => {
    if (!fileUrl) {
      alert('File tidak tersedia untuk diunduh.');
      return;
    }

    try {
      const token = getAuthToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log("DEBUG: Authorization header prepared:", headers['Authorization']);
      } else {
        console.warn("DEBUG: No token found. Authorization header will be missing.");
      }

      console.log("DEBUG: URL being fetched:", fileUrl);
      console.log("DEBUG: Headers being sent to fetch:", headers);
      const response = await fetch(fileUrl, { headers: headers });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download ${suggestedFileName || 'file'}: ${response.status} ${errorText || response.statusText}`);
      }

      const blob = await response.blob();
      saveAs(blob, suggestedFileName || getFileNameFromUrl(fileUrl));
    } catch (error) {
      console.error(`Error downloading file from ${fileUrl}:`, error);
      alert(error.message);
    }
  };

  // Function to view individual file (open in new tab) - KEEPING AS IS
  const handleViewFile = (fileUrl) => {
    if (fileUrl) {
      const token = getAuthToken();
      if (token) {
          fetch(fileUrl, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Failed to view file: ${response.status} ${response.statusText}`);
              }
              return response.blob();
          })
          .then(blob => {
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
              setTimeout(() => URL.revokeObjectURL(url), 30 * 1000);
          })
          .catch(error => {
              console.error(`Error viewing file from ${fileUrl}:`, error);
              alert(`Gagal melihat file: ${error.message}.`);
          });
      } else {
          window.open(fileUrl, '_blank');
      }
    } else {
      alert('File tidak tersedia untuk dilihat.');
    }
  };

  // Function to download all documents as ZIP (only for participants) - KEEPING AS IS
  const downloadAllDocumentsAsZip = async () => {
    if (!isPesertaModal) return;

    setIsDownloadingZip(true);

    try {
      const zip = new JSZip();
      const token = getAuthToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const documentsToDownload = [];

      if (data.foto_peserta && typeof data.foto_peserta === 'string' && data.foto_peserta.startsWith('http')) {
        documentsToDownload.push({
          url: data.foto_peserta,
          label: 'Foto Profil Peserta',
          zipPath: `foto_profil_peserta/${getFileNameFromUrl(data.foto_peserta)}`
        });
      }

      fileFields.forEach(field => {
        const fileUrl = data[field.key];
        if (fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('http')) {
          const fileNameInZip = getFileNameFromUrl(fileUrl);
          const folderName = field.urlPrefix ? field.urlPrefix.split('/').pop() : 'documents';
          documentsToDownload.push({
            url: fileUrl,
            label: field.label,
            zipPath: `${folderName}/${fileNameInZip}`
          });
        }
      });

      if (documentsToDownload.length === 0) {
        alert('Tidak ada dokumen yang tersedia untuk didownload');
        setIsDownloadingZip(false);
        return;
      }

      const downloadPromises = documentsToDownload.map(async (doc) => {
        try {
          console.log("DEBUG: URL being fetched for ZIP part:", doc.url);
          console.log("DEBUG: Headers being sent for ZIP part:", headers);
          const response = await fetch(doc.url, { headers: headers });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status} - ${errorText || response.statusText}`);
          }

          const blob = await response.blob();
          zip.file(doc.zipPath, blob);
          console.log(`Downloaded ${doc.label}: ${doc.zipPath}`);
          return { label: doc.label, success: true };
        } catch (error) {
          console.error(`Error downloading ${doc.label} from ${doc.url}:`, error);
          return { label: doc.label, success: false, error: error.message };
        }
      });

      const results = await Promise.allSettled(downloadPromises);

      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failedResults = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
      const failedCount = failedResults.length;

      if (successCount === 0 && failedCount > 0) {
        alert('Gagal mendownload semua dokumen. Cek konsol untuk detailnya.');
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const filenameSuggestion = `${(data.nama?.replace(/\s+/g, '_') || 'Tidak_Dikenal')}${data.nik_peserta ? `_${data.nik_peserta}` : ''}.zip`;
      saveAs(zipBlob, filenameSuggestion);

      let message = `✅ Berhasil mendownload ${successCount} dokumen sebagai ZIP.`;
      if (failedCount > 0) {
        message += `\n⚠️ ${failedCount} dokumen gagal didownload. Cek konsol browser untuk detailnya.`;
        failedResults.forEach(r => {
            console.error(`Detail Gagal Download: ${r.status === 'fulfilled' ? r.value.label + ': ' + r.value.error : r.reason}`);
        });
      }
      alert(message);

    } catch (error) {
      console.error('Fatal Error creating ZIP:', error);
      alert('Terjadi kesalahan fatal saat membuat file ZIP. Silakan coba lagi.');
    } finally {
      setIsDownloadingZip(false);
    }
  };


  // --- PERBAIKAN PENTING DI SINI: renderField yang lebih robust ---
  const renderField = (field) => {
    // Defensive check for the 'field' object itself
    // This is crucial for preventing "Cannot read properties of undefined (reading 'key')"
    if (!field || typeof field.key === 'undefined') {
        console.error("DetailModal: renderField received an invalid field object:", field);
        return null; // Skip rendering this invalid field to prevent crashes
    }

    const currentData = isEditing ? editedData : data;
    // Use optional chaining for safe access to data properties
    const value = currentData?.[field.key];


    // Check if the field is specifically a file type for Participant modals
    if (field.type === 'file' || field.type === 'document') {
      const fileUrl = value;
      const hasFile = fileUrl && typeof fileUrl === 'string' && fileUrl !== '';

      return (
        <div key={field.key} className="flex items-center justify-between gap-2 flex-wrap">
          {/* Label for the file field */}
          <Label htmlFor={field.key} className="font-medium mb-2 block">
            {field.label}
            {hasFile && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ✓ Tersedia
                </span>
            )}
          </Label>
          {isEditing ? (
            <FileUpload
              label={""} // Label is now rendered separately above
              currentFile={hasFile ? getFileNameFromUrl(fileUrl) : null}
              onFileChange={(e) => onFileChange && onFileChange(field.key, e)}
              accept={field.accept}
            />
          ) : (
            <>
              {hasFile ? (
                <div className="flex gap-1.5 ml-auto">
                  <button
                    onClick={() => handleViewFile(fileUrl)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors text-sm"
                    title="Lihat file"
                  >
                    <Icon icon={FaEye} size="sm" className="inline mr-1" />
                    Lihat
                  </button>
                  <button
                    onClick={() => handleDownloadFile(fileUrl, getFileNameFromUrl(fileUrl))}
                    className="text-green-600 hover:text-green-800 p-1 rounded transition-colors text-sm"
                    title="Unduh file"
                  >
                    <Icon icon={FaDownload} size="sm" className="inline mr-1" />
                    Unduh
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Tidak tersedia</p>
              )}
            </>
          )}
        </div>
      );
    }

    // Default rendering for non-file fields (text, textarea, select, etc.)
    return (
      <div key={field.key}> {/* Ensure key is on the outermost element */}
        <Label htmlFor={field.key}>{field.label}</Label>
        {field.type === 'textarea' ? (
          <textarea
            id={field.key}
            value={value ?? ''}
            onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
            className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
            rows="3"
            readOnly={!isEditing || field.readonly}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.key}
            value={value ?? ''}
            onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
            className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
            disabled={!isEditing || field.readonly} // Use disabled for select when readonly
          >
            <option value="">Pilih...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.renderDisplay && !isEditing ? ( // Custom display render for view mode
          <p className="mt-1 text-gray-900">
            {field.renderDisplay(data?.[field.key])} {/* Use optional chaining */}
          </p>
        ) : field.render && isEditing ? ( // Custom render for edit mode
          field.render(currentData, isEditing, onInputChange)
        ) : ( // Default to InputText
          <InputText
            type={field.type || 'text'}
            id={field.key}
            value={value ?? ''}
            onChange={(e) => isEditing && onInputChange && onInputChange(field.key, e.target.value)}
            className={`w-full p-1.5 border rounded mt-1 text-sm ${!isEditing || field.readonly ? 'bg-gray-50' : ''}`}
            readOnly={!isEditing || field.readonly}
          />
        )}
      </div>
    );
  };
  // --- END OF PERBAIKAN PENTING ---


  const availableDocumentsCount = isPesertaModal ? fileFields.filter(field => {
    const fileUrl = data[field.key];
    return fileUrl && fileUrl !== null && fileUrl !== '';
  }).length : 0;

  // If foto_peserta is a separate field and not part of documentFields, add it to count
  const fotoPesertaCount = (data.foto_peserta && !fileFields.some(f => f.key === 'foto_peserta')) ? 1 : 0;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto max-h-[85vh] overflow-hidden flex flex-col">
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

        {/* Tab Navigation - Logic for showing tabs */}
        {isPesertaModal && (availableDocumentsCount + fotoPesertaCount > 0 || fileFields.length > 0) ? ( // Only show tabs if it's a participant modal and there might be documents
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
                Dokumen ({availableDocumentsCount + fotoPesertaCount})
              </button>
            </nav>
          </div>
        ) : (
          // For Feedback or generic modals (no documents tab)
          <div className="border-b border-gray-200">
            <nav className="flex px-4">
              <div className="py-3 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                <Icon icon={FaComment} size="sm" className="inline mr-2" />
                Detail Feedback
              </div>
            </nav>
          </div>
        )}

        {/* Content Area - diberi flex-grow dan overflow-y-auto */}
        <div className="p-4 flex-grow overflow-y-auto">
          {/* Tab Info - Informasi Peserta atau Detail Feedback */}
          {(!isPesertaModal || activeTab === 'info') && ( // Show info if it's not a participant modal, or if it is and 'info' tab is active
            <div className="space-y-3">
              {infoFields.map((field, index) => (
                <div key={field.key || index}> {/* Use field.key as key if available, fallback to index */}
                  {renderField(field)}
                </div>
              ))}
              {/* If foto_peserta is NOT handled by documentFields but should be shown in info tab */}
              {isPesertaModal && activeTab === 'info' && data.foto_peserta && !fileFields.some(f => f.key === 'foto_peserta') && (
                <div key="foto_profil_peserta_info">
                  {renderField({ key: 'foto_peserta', label: 'Foto Profil Peserta', type: 'document' })}
                </div>
              )}
            </div>
          )}

          {/* Tab Documents - File Dokumen (hanya untuk peserta) */}
          {isPesertaModal && activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h4">Dokumen Peserta</Typography>
                {(availableDocumentsCount + fotoPesertaCount) > 0 && !isEditing && (
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
                        Download All ZIP ({availableDocumentsCount + fotoPesertaCount})
                      </>
                    )}
                  </Button>
                )}
              </div>

              {(availableDocumentsCount + fotoPesertaCount) > 0 ? (
                <div className="space-y-3">
                  {/* Render Foto Profil Peserta explicitly if it exists and is not in documentFields */}
                  {data.foto_peserta && !fileFields.some(f => f.key === 'foto_peserta') && (
                      <div key="foto_profil_peserta_doc" className={`rounded-lg p-3 border ${data.foto_peserta ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                          {renderField({ key: 'foto_peserta', label: 'Foto Profil Peserta', type: 'document' })}
                      </div>
                  )}

                  {fileFields.map((field, index) => {
                    const hasFile = data[field.key] && data[field.key] !== null && data[field.key] !== '';
                    return (
                      <div key={field.key || index} className={`rounded-lg p-3 border ${hasFile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
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

              {(availableDocumentsCount + fotoPesertaCount) === 0 && (fileFields.length > 0 || (data.foto_peserta && data.foto_peserta !== null && data.foto_peserta !== '')) && (
                <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg border border-amber-200 mt-4">
                  <Icon icon={FaFile} size="md" className="mx-auto mb-2" />
                  <p className="text-sm">Belum ada dokumen yang diupload</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50 flex-shrink-0">
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