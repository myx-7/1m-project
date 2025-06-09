# Database Integration Setup Guide

This guide will help you set up the complete database integration for your pixel NFT grid application with Supabase.

## 🚀 Quick Start

The application now supports both **mock data mode** (for development) and **full database mode** (for production) with Supabase integration.

### Current Implementation Features

✅ **Canvas-based high-performance pixel grid**  
✅ **NFT image rendering with automatic preloading**  
✅ **Real-time database operations (GET/POST)**  
✅ **Pixel collision detection and validation**  
✅ **Mobile touch support with pinch zoom**  
✅ **Responsive design with smooth animations**  
✅ **Advanced error handling and fallbacks**  

## 📁 File Structure

```
src/
├── api/
│   └── pixels.ts              # API endpoints with database integration
├── db/
│   └── database.ts            # Supabase configuration and utilities
├── models/
│   └── PixelNFT.ts           # Database model with CRUD operations
├── types/
│   └── nft.ts                # TypeScript interfaces
├── components/
│   ├── PixelGrid.tsx         # Enhanced canvas component
│   └── PixelTooltip.tsx      # NFT-aware tooltip
├── utils/
│   ├── pixelUtils.ts         # Utility functions
│   └── canvasUtils.ts        # Canvas rendering with NFT support
└── hooks/
    └── usePixelGridInteractions.ts # Interaction handling

database-schema.sql           # Supabase database setup
env.example                   # Environment configuration template
```

## 🛠️ Setup Instructions

### Step 1: Environment Configuration

1. **Copy the environment template:**
```bash
cp env.example .env.local
```

2. **Configure for mock data mode (default):**
```env
VITE_USE_DATABASE=false
```

3. **Configure for database mode:**
```env
VITE_USE_DATABASE=true
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Supabase Setup (for database mode)

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database:**
   - Open the Supabase SQL editor
   - Copy and paste the contents of `database-schema.sql`
   - Run the SQL to create tables, functions, and policies

3. **Configure Row Level Security (RLS):**
   - The schema includes security policies
   - Adjust authentication rules based on your needs
   - Test with your authentication system

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 🔧 API Endpoints

### GET Operations

#### Fetch All NFT Records
```typescript
import { fetchPixelsAPI } from '@/api/pixels';

const response = await fetchPixelsAPI();
if (response.success) {
  console.log('NFT records:', response.pixels);
}
```

#### Get NFTs by Owner
```typescript
import { getPixelsByOwnerAPI } from '@/api/pixels';

const ownerNFTs = await getPixelsByOwnerAPI('wallet-address');
```

#### Get Grid Statistics
```typescript
import { getGridStatisticsAPI } from '@/api/pixels';

const stats = await getGridStatisticsAPI();
console.log('Total NFTs:', stats.statistics?.totalNFTs);
```

### POST Operations

#### Create New NFT Record
```typescript
import { createPixelNFTAPI } from '@/api/pixels';

const newNFT = await createPixelNFTAPI({
  pixelIds: [1010, 1011, 1110, 1111],
  startX: 10,
  startY: 10,
  endX: 11,
  endY: 11,
  imageUrl: 'https://example.com/image.png',
  metadataUrl: 'https://example.com/metadata.json',
  nftMintAddress: 'unique-mint-address',
  ownerWallet: 'owner-wallet-address',
  transactionSignature: 'blockchain-tx-signature'
});
```

#### Check Pixel Availability
```typescript
import { checkPixelAvailabilityAPI } from '@/api/pixels';

const availability = await checkPixelAvailabilityAPI(10, 10, 12, 12);
console.log('Available:', availability.available);
```

## 🗄️ Database Model Usage

The `PixelNFTModel` class provides comprehensive database operations:

### Create Operations
```typescript
import { PixelNFTModel } from '@/models/PixelNFT';

// Create new NFT with automatic validation
const nft = await PixelNFTModel.create({
  pixelIds: [1010, 1011],
  startX: 10,
  startY: 10,
  endX: 11,
  endY: 10,
  imageUrl: 'https://example.com/image.png',
  metadataUrl: 'https://example.com/metadata.json',
  nftMintAddress: 'unique-mint-address',
  ownerWallet: 'owner-wallet',
  transactionSignature: 'tx-signature',
  createdAt: new Date().toISOString()
});
```

### Read Operations
```typescript
// Get all NFTs
const allNFTs = await PixelNFTModel.getAll();

// Get NFT by mint address
const nft = await PixelNFTModel.getByMintAddress('mint-address');

// Get NFTs by owner
const ownerNFTs = await PixelNFTModel.getByOwner('wallet-address');

// Get NFTs at specific coordinates
const coordinateNFTs = await PixelNFTModel.getByPixelCoordinates(10, 10);

// Check pixel availability
const available = await PixelNFTModel.arePixelsAvailable(10, 10, 12, 12);

// Get grid statistics
const stats = await PixelNFTModel.getGridStatistics();
```

### Update Operations
```typescript
// Update NFT record
const updatedNFT = await PixelNFTModel.update('nft-id', {
  imageUrl: 'https://new-image-url.com/image.png'
});
```

### Delete Operations
```typescript
// Delete NFT record
const success = await PixelNFTModel.delete('nft-id');
```

## 🎨 Canvas Features

### NFT Image Rendering
- **Automatic image preloading** for better performance
- **Image caching** to prevent redundant downloads
- **Fallback rendering** for failed image loads
- **Rounded corners** and subtle borders for visual polish

### Performance Optimizations
- **Viewport culling** - only renders visible pixels
- **RequestAnimationFrame** for smooth 60fps animations
- **Draw parameter comparison** to skip unnecessary redraws
- **Efficient batch rendering** by color groups

### Interactive Features
- **Zoom**: Mouse wheel or pinch gesture (0.5x to 10x)
- **Pan**: Middle mouse button, Ctrl+drag, or touch drag
- **Selection**: Click and drag to select available pixels
- **Hover**: Real-time tooltip with NFT information

## 🔒 Security Features

### Database Security
- **Row Level Security (RLS)** enabled by default
- **Input validation** for all coordinates and data
- **Pixel overlap prevention** with database constraints
- **Unique constraints** on mint addresses and transaction signatures

### API Security
- **Data validation** for all incoming requests
- **Error handling** with appropriate error messages
- **Connection health checks** with automatic fallbacks
- **Rate limiting ready** (add your preferred middleware)

## 🧪 Testing

### Mock Data Mode
```typescript
// The application works fully with mock data when database is disabled
VITE_USE_DATABASE=false
```

### Database Mode Testing
```typescript
// Test database connection
import { checkDatabaseConnection } from '@/db/database';

const isConnected = await checkDatabaseConnection();
console.log('Database connected:', isConnected);
```

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
```env
VITE_USE_DATABASE=true
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Database Setup Checklist
- ✅ Run `database-schema.sql` in production Supabase
- ✅ Configure RLS policies for your authentication system
- ✅ Set up proper indexing for performance
- ✅ Configure backup policies
- ✅ Monitor database performance

### Performance Considerations
- **Image CDN**: Use a CDN for NFT images (`imageUrl`)
- **Caching**: Implement Redis or similar for frequently accessed data
- **Connection pooling**: Configure Supabase connection limits
- **Monitoring**: Set up alerts for database performance

## 🎯 Integration Examples

### With Solana Wallet Integration
```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { createPixelNFTAPI } from '@/api/pixels';

const { publicKey } = useWallet();

const mintNFTAndSave = async (mintData: any) => {
  // 1. Mint NFT on Solana
  const mintResult = await mintNFTOnSolana(mintData);
  
  // 2. Save to database
  const dbResult = await createPixelNFTAPI({
    ...mintData,
    nftMintAddress: mintResult.mintAddress,
    ownerWallet: publicKey?.toString() || '',
    transactionSignature: mintResult.signature
  });
  
  return dbResult;
};
```

### With Real-time Updates
```typescript
import { supabase } from '@/db/database';

// Subscribe to real-time changes
const subscription = supabase
  .channel('pixel-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'pixel_nfts'
  }, (payload) => {
    console.log('Real-time update:', payload);
    // Refresh grid data
  })
  .subscribe();
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection fails**
   - Check your Supabase URL and keys
   - Verify network connectivity
   - Application falls back to mock data automatically

2. **Image loading errors**
   - Images are cached and retried automatically
   - CORS errors: ensure image URLs allow cross-origin requests
   - Fallback rectangles are shown for failed images

3. **Performance issues**
   - Check console for excessive re-renders
   - Verify viewport culling is working
   - Monitor network requests for redundant calls

### Debug Mode
```typescript
// Enable detailed logging
localStorage.setItem('debug', 'pixel-grid:*');
```

## 📚 Next Steps

1. **Authentication Integration**: Connect with your authentication system
2. **Payment Processing**: Add payment handling for pixel purchases
3. **Real-time Collaboration**: Implement WebSocket updates
4. **Advanced Analytics**: Add usage tracking and analytics
5. **Mobile App**: Extend to React Native for mobile apps

---

**🎉 You're all set!** Your pixel NFT grid now has full database integration with high-performance canvas rendering and comprehensive API endpoints. 