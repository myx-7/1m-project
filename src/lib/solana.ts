import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl
} from '@solana/web3.js';
import { 
  Metaplex, 
  walletAdapterIdentity,
  toMetaplexFile,
  type WalletAdapter
} from '@metaplex-foundation/js';
import { PixelData, PixelNFTMetadata, PIXEL_PRICE_SOL } from '@/types';
import UploadFileToBlockChain from './arweave';

// Solana configuration
export const SOLANA_NETWORK = 'devnet';
export const RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

// Initialize connection
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Initialize Metaplex with proper wallet adapter
export const getMetaplex = (walletAdapter: WalletAdapter) => {
  return Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter));
};

// Generate pixel NFT metadata
export const generatePixelMetadata = (
  pixelData: PixelData,
  imageFile: File
): PixelNFTMetadata => {
  // Extract numeric part from pixel ID or use coordinates
  const pixelNumber = pixelData.id.replace(/\D/g, '').slice(-6) || `${pixelData.x}-${pixelData.y}`;
  
  return {
    name: `MDP #${pixelNumber}`, // Keep it short: "MDP #123456" (max 32 chars)
    description: `Pixel at coordinates (${pixelData.x}, ${pixelData.y}) on the Million Dollar Homepage NFT grid. Own a piece of internet history!`,
    image: '', // Will be set after upload
    external_url: pixelData.linkUrl || '',
    attributes: [
      {
        trait_type: 'X Coordinate',
        value: pixelData.x
      },
      {
        trait_type: 'Y Coordinate', 
        value: pixelData.y
      },
      {
        trait_type: 'Pixel ID',
        value: pixelData.id
      },
      {
        trait_type: 'Grid Position',
        value: `${pixelData.x},${pixelData.y}`
      }
    ],
    properties: {
      files: [
        {
          uri: '', // Will be set after upload
          type: imageFile.type
        }
      ],
      category: 'image'
    }
  };
};

// Upload image and metadata to Arweave using your API
export const uploadPixelAssets = async (
  metaplex: Metaplex,
  imageFile: File,
  metadata: PixelNFTMetadata
): Promise<{ imageUri: string; metadataUri: string }> => {
  try {
    console.log('📤 Uploading image to Arweave...');
    console.log('🖼️ Image file details:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });
    
    // Upload image using your Arweave API
    const imageUri = await UploadFileToBlockChain(imageFile);
    
    if (!imageUri) {
      throw new Error('Failed to upload image to Arweave - no URL returned');
    }
    
    console.log('✅ Image uploaded successfully:', imageUri);
    
    // Update metadata with image URI
    const updatedMetadata = {
      ...metadata,
      image: imageUri,
      properties: {
        ...metadata.properties,
        files: [
          {
            uri: imageUri,
            type: imageFile.type
          }
        ]
      }
    };
    
    console.log('📤 Uploading metadata to Arweave...');
    console.log('📋 Metadata to upload:', updatedMetadata);
    
    // Create metadata file properly
    const metadataJson = JSON.stringify(updatedMetadata);
    const metadataFile = new File([metadataJson], 'metadata.json', {
      type: 'application/json'
    });
    
    console.log('📄 Metadata file created:', {
      name: metadataFile.name,
      type: metadataFile.type,
      size: metadataFile.size
    });
    
    const metadataUri = await UploadFileToBlockChain(metadataFile, 'application/json');
    
    if (!metadataUri) {
      throw new Error('Failed to upload metadata to Arweave - no URL returned');
    }
    
    console.log('✅ Metadata uploaded successfully:', metadataUri);
    
    return { imageUri, metadataUri };
  } catch (error) {
    console.error('❌ Error uploading assets:', error);
    throw new Error(`Failed to upload pixel assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Mint pixel NFT
export const mintPixelNFT = async (
  metaplex: Metaplex,
  pixelData: PixelData,
  imageFile: File,
  walletPublicKey: PublicKey
): Promise<{ 
  mint: PublicKey; 
  transactionSignature: string;
  imageUrl: string;
  metadataUrl: string;
}> => {
  try {
    // Generate metadata
    const metadata = generatePixelMetadata(pixelData, imageFile);
    
    // Upload assets (using simplified approach for testing)
    const { imageUri, metadataUri } = await uploadPixelAssets(metaplex, imageFile, metadata);
    
    // Create NFT
    const { nft, response } = await metaplex.nfts().create({
      uri: metadataUri,
      name: metadata.name,
      symbol: 'MDP', // Million Dollar Pixel
      sellerFeeBasisPoints: 500, // 5% royalty
      creators: [
        {
          address: walletPublicKey,
          share: 100
        }
      ],
      isMutable: false,
      maxSupply: 1
    });
    
    return {
      mint: nft.address,
      transactionSignature: response.signature,
      imageUrl: imageUri,
      metadataUrl: metadataUri
    };
  } catch (error) {
    console.error('Error minting pixel NFT:', error);
    throw new Error('Failed to mint pixel NFT');
  }
};

// Calculate total cost for pixel selection
export const calculatePixelCost = (pixelCount: number): number => {
  return pixelCount * PIXEL_PRICE_SOL;
};

// Validate wallet balance
export const validateWalletBalance = async (
  walletPublicKey: PublicKey,
  requiredSOL: number
): Promise<boolean> => {
  try {
    const balance = await connection.getBalance(walletPublicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    return balanceSOL >= requiredSOL;
  } catch (error) {
    console.error('Error checking wallet balance:', error);
    return false;
  }
};

// Get wallet balance in SOL
export const getWalletBalance = async (walletPublicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(walletPublicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return 0;
  }
};

// Simulate transaction to estimate fees
export const estimateTransactionFee = async (
  transaction: Transaction
): Promise<number> => {
  try {
    const { value } = await connection.getFeeForMessage(
      transaction.compileMessage(),
      'confirmed'
    );
    return (value || 0) / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error estimating transaction fee:', error);
    return 0.001; // Default estimate
  }
}; 