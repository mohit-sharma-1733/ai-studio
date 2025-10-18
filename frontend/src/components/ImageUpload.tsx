import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError('');
    
    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setError('Only JPEG and PNG images are allowed');
      return false;
    }

    return true;
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Calculate new dimensions (max width 1920px)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with quality compression
          const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
          resolve(resizedImage);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      const resizedImage = await resizeImage(file);
      setPreview(resizedImage);
      onImageSelect(resizedImage);
    } catch (err) {
      setError('Failed to process image');
      console.error('Image processing error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError('');
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Upload Image
        <span className="text-gray-500 font-normal ml-2">(Max 10MB, JPEG/PNG)</span>
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : preview
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transform transition-all duration-200 hover:scale-110"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              ✓ Image uploaded successfully
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-700 mb-1">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              JPEG or PNG up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-slideIn" role="alert">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        aria-label="File input"
      />
    </div>
  );
};

export default ImageUpload;
