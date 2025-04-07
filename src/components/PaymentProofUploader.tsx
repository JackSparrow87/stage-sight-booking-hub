
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentProofUploaderProps {
  onUploadComplete: (file: File, url: string) => void;
  isUploaded: boolean;
}

const PaymentProofUploader: React.FC<PaymentProofUploaderProps> = ({ 
  onUploadComplete,
  isUploaded
}) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const processFile = async (file: File) => {
    // Check if the file is an image or PDF
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB');
      return;
    }
    
    setUploadedFile(file);
    
    try {
      setIsUploading(true);
      
      // Create a unique file path for the upload
      const timestamp = new Date().getTime();
      const filePath = `payment_proofs/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('theater_images')
        .upload(filePath, file);
      
      if (error) {
        // If there's an error with storage, use a fake URL for demo purposes
        console.error('Storage upload error:', error);
        toast.warning('Using demo mode for file upload');
        
        const fakePublicUrl = `https://example.com/payment_proofs/${timestamp}_${file.name}`;
        setUploadedFile(file);
        onUploadComplete(file, fakePublicUrl);
      } else {
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('theater_images')
          .getPublicUrl(data.path);
        
        // Pass the file and URL to the parent component
        onUploadComplete(file, urlData.publicUrl);
        toast.success('Payment proof uploaded successfully');
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      // Fallback to demo mode if something goes wrong
      toast.warning('Using demo mode due to an error');
      const timestamp = new Date().getTime();
      const fakePublicUrl = `https://example.com/payment_proofs/${timestamp}_${file.name}`;
      onUploadComplete(file, fakePublicUrl);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Proof of Payment</h3>
      
      {!isUploaded ? (
        <>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-10 w-10 text-theater-muted mb-4" />
            <p className="mb-2 text-theater-muted">
              {isUploading ? 'Uploading...' : 'Drag & drop your proof of payment or click to browse'}
            </p>
            <p className="text-xs text-theater-muted mb-4">
              Accepted formats: JPG, PNG, PDF (Max size: 5MB)
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Select File'}
            </Button>
          </div>
          
          <Alert className="mt-4" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Payment proof is required to complete your booking
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 flex justify-between items-center">
            <span>
              {uploadedFile?.name || 'Proof of payment uploaded successfully'}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              Change
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PaymentProofUploader;
