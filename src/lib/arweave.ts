import { uploadToArweave } from '@/api/arweave';

/**
 * Upload file to Arweave (legacy function for backward compatibility)
 * @param file - File to upload
 * @param contentType - Optional content type
 * @returns Promise with Arweave URL
 */
const UploadFileToBlockChain = async (
  file: File, 
  contentType?: string
): Promise<string> => {
  try {
    const result = await uploadToArweave(file, contentType);
    
    if (!result.success || !result.url) {
      throw new Error(result.error || 'Upload failed');
    }
    
    return result.url;
  } catch (error) {
    console.error('❌ Arweave upload error:', error);
    throw new Error(`Failed to upload to Arweave: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default UploadFileToBlockChain;
