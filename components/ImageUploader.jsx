// components/ImageUploader.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button1';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

/**
 * ImageUploader component for uploading images to Supabase Storage
 * @param {function(string): void} onUpload - Callback function that returns the public URL
 * @param {string} currentImageUrl - Optional current image URL to display
 * @param {string} bucketName - Bucket name (default: "article_image")
 */
export default function ImageUploader({ onUpload, currentImageUrl = null, bucketName = "article_image" }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl || null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImageUrl || null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
      setUploadedUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      setError(null);
      const file = event.target.files[0];
      
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const filePath = `articles/${timestamp}-${randomStr}.${fileExt}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      // Get the public URL of the uploaded file
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not get public URL.');
      }

      // Set the URL and pass it to the parent form
      setUploadedUrl(data.publicUrl);
      onUpload(data.publicUrl);
    
    } catch (error) {
      console.error('Image upload error:', error);
      setError(error.message || 'Failed to upload image');
      setPreview(uploadedUrl); // Revert to previous image on error
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    onUpload(''); // Clear the image URL
    // Reset file input
    const fileInput = document.getElementById('articleImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="articleImage" className="block text-sm font-medium text-gray-700 mb-2">
          Article Cover Image
        </Label>
        
        {/* Upload Area */}
        <div className="mt-2">
          {preview ? (
            <div className="relative group">
              <div className="relative w-full h-64 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50">
                <Image
                  src={preview}
                  alt="Article preview"
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('articleImage')?.click()}
                      disabled={uploading}
                      className="bg-white hover:bg-white/90"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                      className="bg-white hover:bg-white/90"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="articleImage"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="mb-2 text-sm text-gray-500">Uploading image...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (MAX. 10MB)</p>
                  </>
                )}
              </div>
            </label>
          )}
        </div>

        {/* Hidden file input - always present */}
        <input
          id="articleImage"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading image...</span>
          </div>
        )}

        {/* Success Message */}
        {uploadedUrl && !uploading && !error && (
          <p className="mt-2 text-sm text-green-600 flex items-center">
            <ImageIcon className="w-4 h-4 mr-1" />
            Image {preview ? 'ready' : 'uploaded successfully'}!
          </p>
        )}
      </div>
    </div>
  );
}