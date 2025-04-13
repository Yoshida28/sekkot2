import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface FileUploadProps {
  onUploadComplete: (filePath: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxSizeMB = 10,
  acceptedFormats = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg']
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      return `File type not supported. Accepted formats: ${acceptedFormats.join(', ')}`;
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadProgress(0);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('requirements')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percentage));
          }
        });

      if (uploadError) throw uploadError;

      onUploadComplete(filePath);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          error ? 'border-red-500' : 'border-purple-900 hover:border-purple-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={acceptedFormats.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-purple-400" />
          
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-purple-200">
                <span className="truncate max-w-xs">{file.name}</span>
                {!isUploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              
              {!isUploading && uploadProgress < 100 && (
                <button
                  onClick={handleUpload}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Upload File
                </button>
              )}
            </div>
          ) : (
            <div className="text-purple-200">
              <p className="text-lg font-medium">
                Drop your file here or click to upload
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supported formats: {acceptedFormats.join(', ')}
                <br />
                Maximum size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-400">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {uploadProgress === 100 && (
        <div className="flex items-center gap-2 mt-2 text-green-400">
          <Check size={16} />
          <span className="text-sm">Upload complete!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;