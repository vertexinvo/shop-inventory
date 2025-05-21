import { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { BiImport } from 'react-icons/bi';
import Modal from './Modal'; // Adjust the import path based on your project structure

// Reusable Button Component (adapted to match Modal's button styling)
const Button = ({ children, variant = 'primary', disabled, loading, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-4';
  const variants = {
    primary: 'text-white bg-[#5d596c] hover:bg-[#4a4657] focus:ring-[#5d596c]',
    success: 'text-white bg-black hover:bg-gray-800 focus:ring-gray-800',
  };
  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabledStyles}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Generic CSV Import Modal Component
const CSVImportModal = ({
  isOpen,
  onClose,
  templateUrl = '/template.csv',
  title = 'Import Data via CSV',
  instructions = [
    'Download the CSV template and fill in the required fields.',
    'Ensure the file format is CSV, XLSX, or XLS.',
    'Select your completed file.',
    'Click "Import" to process the file.',
  ],
  onFileUpload = async (file) => {
    // Default implementation using router.post to product.csvstore
    if (file) {
      await router.post(route('product.csvstore'), { file });
    }
  },
}) => {
  const [fileSelected, setFileSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (matches original handleFileSelect logic)
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const isValidFile =
      file.type === 'text/csv' || validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidFile) {
      setError('Please select a valid CSV, XLSX, or XLS file.');
      setFileSelected(null);
      return;
    }

    setError('');
    setFileSelected(file);
    setLoading(true);

    try {
      await onFileUpload(file);
      onClose();
      setFileSelected(null);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('File upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={() => {
      onClose();
      setError('');
      setFileSelected(null);
    }}>
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="flex justify-center p-10">
          <div className="text-2xl font-medium text-[#5d596c]">
            {title}
          </div>
        </div>
        <div className="px-10 mb-5">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[#5d596c]">How to Import</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Download Template */}
            <a href={templateUrl} download={templateUrl.split('/').pop()}>
              <Button variant="primary">
                <FaFileDownload className="mr-2 h-5 w-5" />
                Download Template
              </Button>
            </a>

            {/* File Input */}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={loading}
                />
                <Button variant="success" loading={loading} disabled={loading}>
                  <BiImport className="mr-2 h-5 w-5" />
                  {fileSelected ? 'Import File' : 'Choose File'}
                </Button>
              </label>
              {fileSelected && !loading && (
                <span className="text-sm text-green-600">
                  {fileSelected.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CSVImportModal;