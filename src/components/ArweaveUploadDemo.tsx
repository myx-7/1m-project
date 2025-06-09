import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useArweaveUpload } from '@/hooks/useArweaveUpload';
import { Upload, FileImage, CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * Demo component showing how to use Arweave upload functionality
 * This can be integrated into your NFT minting workflow
 */
export const ArweaveUploadDemo: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, progress, error, result, uploadFile, uploadMetadata, resetUpload } = useArweaveUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 Selected file:', file.name, file.size, 'bytes');
    
    await uploadFile(file);
  };

  const handleMetadataUpload = async () => {
    const sampleMetadata = {
      name: "Sample Pixel NFT",
      description: "A pixel NFT from the grid",
      image: result?.url || "https://example.com/image.png",
      attributes: [
        { trait_type: "Grid Position", value: "10,10" },
        { trait_type: "Size", value: "2x2" },
        { trait_type: "Color Scheme", value: "Blue" }
      ],
      properties: {
        files: [
          {
            uri: result?.url || "https://example.com/image.png",
            type: "image/png"
          }
        ],
        category: "image"
      }
    };

    await uploadMetadata(sampleMetadata);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-background border rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Arweave Upload Demo
      </h3>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
            variant="outline"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileImage className="w-4 h-4 mr-2" />
            )}
            {isUploading ? 'Uploading...' : 'Select Image/JSON File'}
          </Button>
        </div>

        {/* Progress */}
        {isUploading && progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-2">
            {result.success ? (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Upload Successful!</p>
                  <p className="text-xs text-green-700 break-all">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      {result.url}
                    </a>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Transaction ID: {result.txId}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Upload Failed</p>
                  <p className="text-xs text-red-700">{result.error}</p>
                  {result.details && (
                    <p className="text-xs text-red-600 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && !result && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Metadata Upload Button */}
        {result?.success && (
          <Button
            onClick={handleMetadataUpload}
            disabled={isUploading}
            className="w-full"
            variant="secondary"
          >
            Upload Sample Metadata
          </Button>
        )}

        {/* Reset Button */}
        {(result || error) && (
          <Button
            onClick={resetUpload}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Usage Info */}
      <div className="mt-6 text-xs text-muted-foreground space-y-1">
        <p>• Supports PNG, JPEG, and JSON files up to 5MB</p>
        <p>• Files are permanently stored on Arweave</p>
        <p>• Use the returned URL for NFT metadata</p>
      </div>
    </div>
  );
}; 