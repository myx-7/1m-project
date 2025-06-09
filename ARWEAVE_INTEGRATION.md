# Arweave Upload Integration

This guide explains how to use the Arweave file upload functionality in your pixel NFT grid application.

## 🚀 Quick Start

The Arweave integration allows you to upload images and metadata permanently to the Arweave network for your NFTs.

### Files Added

- `src/api/arweave.ts` - Core Arweave upload API
- `src/hooks/useArweaveUpload.ts` - React hook for easy integration
- `src/components/ArweaveUploadDemo.tsx` - Demo component

## 📦 Installation

Arweave package has been installed:
```bash
npm install arweave
```

## 🔧 Configuration

### Environment Variables

Add to your `.env.local` file:

```env
# Arweave Configuration (optional)
# IMPORTANT: For production, use a server-side proxy instead of client-side keys
VITE_ARWEAVE_KEY='{"d":"your-d-value","dp":"your-dp-value",...}'
```

**Security Note**: The current implementation includes a default Arweave key for testing. In production, you should:
1. Use your own Arweave wallet key
2. Implement a server-side proxy to keep keys secure
3. Never expose private keys in client-side code

## 🎯 Basic Usage

### Using the Hook

```typescript
import { useArweaveUpload } from '@/hooks/useArweaveUpload';

const MyComponent = () => {
  const { isUploading, error, result, uploadFile, uploadMetadata } = useArweaveUpload();
  
  const handleFileUpload = async (file: File) => {
    const result = await uploadFile(file);
    if (result.success) {
      console.log('Uploaded to:', result.url);
    }
  };
  
  // ... rest of component
};
```

### Direct API Usage

```typescript
import { uploadToArweave, uploadMetadataToArweave } from '@/api/arweave';

// Upload an image
const uploadImage = async (file: File) => {
  const result = await uploadToArweave(file);
  return result.url; // Use this URL in your NFT metadata
};

// Upload metadata
const uploadNFTMetadata = async (metadata: any) => {
  const result = await uploadMetadataToArweave(metadata);
  return result.url; // Use this URL as your NFT's metadata URI
};
```

## 🎨 NFT Workflow Integration

### Complete NFT Creation Flow

```typescript
import { useArweaveUpload } from '@/hooks/useArweaveUpload';
import { createPixelNFTAPI } from '@/api/pixels';

const createPixelNFT = async (imageFile: File, pixelCoordinates: any) => {
  const { uploadFile, uploadMetadata } = useArweaveUpload();
  
  // 1. Upload image to Arweave
  const imageResult = await uploadFile(imageFile);
  if (!imageResult.success) throw new Error('Image upload failed');
  
  // 2. Create metadata
  const metadata = {
    name: "Pixel NFT",
    description: "A unique pixel from the grid",
    image: imageResult.url,
    attributes: [
      { trait_type: "Position", value: `${pixelCoordinates.x},${pixelCoordinates.y}` },
      { trait_type: "Size", value: `${pixelCoordinates.width}x${pixelCoordinates.height}` }
    ]
  };
  
  // 3. Upload metadata to Arweave
  const metadataResult = await uploadMetadata(metadata);
  if (!metadataResult.success) throw new Error('Metadata upload failed');
  
  // 4. Create NFT record in database
  const nftResult = await createPixelNFTAPI({
    ...pixelCoordinates,
    imageUrl: imageResult.url,
    metadataUrl: metadataResult.url,
    nftMintAddress: 'your-mint-address',
    ownerWallet: 'your-wallet-address',
    transactionSignature: 'your-tx-signature'
  });
  
  return nftResult;
};
```

## 🧪 Testing the Demo

To test the Arweave upload functionality:

1. Add the demo component to your app:

```typescript
// In your main component or page
import { ArweaveUploadDemo } from '@/components/ArweaveUploadDemo';

// Add somewhere in your JSX
<ArweaveUploadDemo />
```

2. Select an image file (PNG/JPEG, max 5MB)
3. Upload and get the Arweave URL
4. Upload sample metadata using the image URL

## 📋 Supported File Types

- **Images**: PNG, JPEG (max 5MB)
- **Metadata**: JSON files (max 5MB)
- **Custom**: Any file type with proper `contentType` parameter

## 🔒 Security Considerations

### For Development
- The current setup includes a test Arweave key
- Files are uploaded directly from the browser
- Suitable for development and testing

### For Production
1. **Server-Side Proxy**: Implement a backend service that handles Arweave uploads
2. **Key Management**: Store Arweave keys securely on the server
3. **Rate Limiting**: Implement upload limits and user authentication
4. **File Validation**: Add server-side file type and size validation

Example production setup:
```typescript
// Instead of direct upload, send to your backend
const productionUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload-to-arweave', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  return response.json();
};
```

## 💰 Cost Estimation

```typescript
import { getArweaveUploadCost } from '@/api/arweave';

const estimateCost = async (file: File) => {
  const result = await getArweaveUploadCost(file.size);
  console.log(`Upload cost: ${result.cost} AR`);
};
```

## 🔗 Integration with Solana NFTs

The uploaded Arweave URLs can be used directly in Solana NFT metadata:

```typescript
// Metaplex NFT metadata format
const solanaMetadata = {
  name: "Pixel NFT #1",
  symbol: "PIXEL",
  description: "A unique pixel from the grid",
  image: arweaveImageUrl,          // Image uploaded to Arweave
  external_url: "https://your-app.com",
  attributes: [...],
  properties: {
    files: [
      {
        uri: arweaveImageUrl,        // Same Arweave URL
        type: "image/png"
      }
    ],
    category: "image"
  }
};
```

## 🚨 Error Handling

Common error scenarios and solutions:

```typescript
const handleUpload = async (file: File) => {
  try {
    const result = await uploadToArweave(file);
    
    if (!result.success) {
      switch (result.error) {
        case 'File size too large':
          alert('Please select a file smaller than 5MB');
          break;
        case 'Unsupported file type':
          alert('Please select a PNG, JPEG, or JSON file');
          break;
        default:
          alert(`Upload failed: ${result.error}`);
      }
      return;
    }
    
    // Success - use result.url
    console.log('Upload successful:', result.url);
    
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed. Please try again.');
  }
};
```

## 📊 Transaction Status

Check if your upload has been confirmed on Arweave:

```typescript
import { checkArweaveStatus } from '@/api/arweave';

const checkStatus = async (txId: string) => {
  const status = await checkArweaveStatus(txId);
  console.log('Confirmed:', status.confirmed);
  console.log('Block height:', status.blockHeight);
};
```

---

**🎉 You're ready to integrate Arweave uploads into your NFT workflow!**

The uploaded files will be permanently stored on Arweave and accessible via their URLs for use in NFT metadata and blockchain transactions. 