# SolPage - Advertise on the Famous Pixel Grid

**SolPage** is a modern recreation of the legendary Million Dollar Homepage from 2005, built on the Solana blockchain. Buy pixels to advertise your brand on our permanent grid. Each pixel you own becomes a permanent advertising space that drives traffic to your website forever.

## 🚀 Features

- **1,000,000 Pixels**: 100x100 grid of advertising space
- **Solana Blockchain**: Secure, permanent ownership via NFTs
- **Real-time Chat**: Connect with other advertisers
- **Mobile Responsive**: Works perfectly on all devices
- **Permanent Storage**: Images stored on Arweave for permanence
- **0.01 SOL per Pixel**: Affordable advertising for everyone

## 🛠 Technologies

This project is built with modern web technologies:

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Storage**: Arweave for permanent image storage
- **Database**: Supabase for real-time features

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd pixel-genesis-grid

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 How It Works

1. **Connect Wallet**: Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Select Pixels**: Click and drag to select pixels on the 100x100 grid
3. **Upload Image**: Choose an image to display in your selected area
4. **Add Link**: Optionally add a URL to drive traffic to your website
5. **Mint NFT**: Pay 0.01 SOL per pixel and mint your permanent ad space

## 🌐 Live Demo

Visit [SolPage](https://solpage.com) to see the live application.

## 📝 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Solana, Arweave)
├── api/                # API functions
├── types/              # TypeScript type definitions
└── pages/              # Page components
```

### Key Components
- `PixelGrid`: Interactive 100x100 pixel grid
- `SelectionPanel`: Pixel selection and minting interface
- `PublicChat`: Real-time chat for users
- `Header`: Navigation and wallet connection
- `StatsBar`: Live statistics display

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ARWEAVE_GATEWAY=your_arweave_gateway
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact us through our website.
