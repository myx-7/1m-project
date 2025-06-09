import { useState, useCallback } from 'react';
import { uploadToArweave, uploadMetadataToArweave, ArweaveUploadResponse } from '@/api/arweave';

interface UploadState {
  isUploading: boolean;
  progress?: number;
  error?: string;
  result?: ArweaveUploadResponse;
}

/**
 * React hook for Arweave file uploads
 * @returns Upload state and functions
 */
export const useArweaveUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false
  });

  /**
   * Upload a file to Arweave
   */
  const uploadFile = useCallback(async (
    file: File, 
    contentType?: string
  ): Promise<ArweaveUploadResponse> => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: undefined,
      result: undefined
    });

    try {
      // Start upload
      setUploadState(prev => ({ ...prev, progress: 10 }));
      
      const result = await uploadToArweave(file, contentType);
      
      // Upload completed
      setUploadState({
        isUploading: false,
        progress: 100,
        result,
        error: result.success ? undefined : result.error
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  /**
   * Upload metadata object to Arweave
   */
  const uploadMetadata = useCallback(async (
    metadata: Record<string, unknown>
  ): Promise<ArweaveUploadResponse> => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: undefined,
      result: undefined
    });

    try {
      // Start upload
      setUploadState(prev => ({ ...prev, progress: 10 }));
      
      const result = await uploadMetadataToArweave(metadata);
      
      // Upload completed
      setUploadState({
        isUploading: false,
        progress: 100,
        result,
        error: result.success ? undefined : result.error
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Metadata upload failed';
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  /**
   * Reset upload state
   */
  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: undefined,
      error: undefined,
      result: undefined
    });
  }, []);

  return {
    // State
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    error: uploadState.error,
    result: uploadState.result,
    
    // Actions
    uploadFile,
    uploadMetadata,
    resetUpload
  };
}; 