import { useState } from "react";
import { ArrowLeft, ExternalLink, Copy, Check, Wallet, Grid3X3, Image, MessageSquare, Zap, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Docs = () => {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CodeBlock = ({ children, language = "bash" }: { children: string; language?: string }) => (
    <div className="relative group">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{children}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(children, children.substring(0, 20))}
      >
        {copiedText === children.substring(0, 20) ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Grid
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">SolanaPage Documentation</h1>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            v1.0.0
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to SolanaPage</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            The modern recreation of the legendary Million Dollar Homepage, built on Solana blockchain. 
            Own your piece of internet history with permanent, decentralized advertising space.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-sm">Solana Blockchain</Badge>
            <Badge variant="outline" className="text-sm">NFT Ownership</Badge>
            <Badge variant="outline" className="text-sm">Permanent Storage</Badge>
            <Badge variant="outline" className="text-sm">Real-time Chat</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="getting-started">Get Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5" />
                    What is SolanaPage?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SolanaPage is a pixel-based advertising platform where you can purchase pixels on a 100x100 grid 
                    to display your brand, artwork, or message. Each pixel is backed by a Solana NFT, ensuring 
                    permanent ownership and decentralized storage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Why Blockchain?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traditional web advertising is temporary. With SolanaPage, your advertising space is:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>Permanently owned as an NFT</li>
                    <li>Stored on decentralized networks (Arweave)</li>
                    <li>Transferable and tradeable</li>
                    <li>Censorship resistant</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,000,000</div>
                    <div className="text-sm text-muted-foreground">Total Pixels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100×100</div>
                    <div className="text-sm text-muted-foreground">Grid Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0.01 SOL</div>
                    <div className="text-sm text-muted-foreground">Price per Pixel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Forever</div>
                    <div className="text-sm text-muted-foreground">Ownership Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>
                  Follow these simple steps to start advertising on SolanaPage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Connect Your Wallet
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Connect a Solana wallet (Phantom, Solflare, etc.) to start purchasing pixels.
                      </p>
                      <Alert>
                        <AlertDescription>
                          Make sure you have some SOL in your wallet for purchases and transaction fees.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Grid3X3 className="w-4 h-4" />
                        Select Your Pixels
                      </h3>
                      <p className="text-muted-foreground">
                        Click and drag on the grid to select the pixels you want to purchase. 
                        You can select individual pixels or rectangular areas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Upload Your Image
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Upload an image that will be displayed in your selected pixel area. 
                        Supported formats: PNG, JPG (max 5MB).
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Image will be automatically resized to fit your selection</p>
                        <p>• Higher resolution images look better when zoomed</p>
                        <p>• Images are permanently stored on Arweave</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Add Link (Optional)
                      </h3>
                      <p className="text-muted-foreground">
                        Add a URL to drive traffic to your website when users click on your pixels.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Mint Your NFT
                      </h3>
                      <p className="text-muted-foreground">
                        Confirm the transaction to mint your pixel NFT and claim permanent ownership 
                        of your advertising space.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Setup</CardTitle>
                <CardDescription>
                  Recommended Solana wallets for the best experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Phantom Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Most popular Solana wallet with great mobile support
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">
                        Download <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Solflare Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Advanced features and hardware wallet support
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://solflare.com" target="_blank" rel="noopener noreferrer">
                        Download <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    NFT Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Each pixel purchase creates a unique Solana NFT that proves permanent ownership. 
                    Trade, transfer, or hold your advertising space forever.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-green-500" />
                    Permanent Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Images and metadata are stored on Arweave, a permanent and decentralized storage network. 
                    Your content will be accessible forever.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    Real-time Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with other advertisers and pixel owners through our integrated chat system. 
                    Share experiences and network with the community.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-orange-500" />
                    Interactive Grid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Zoom, pan, and explore the pixel grid with smooth interactions. 
                    Mobile-responsive design works perfectly on all devices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Fast Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built on Solana for fast, low-cost transactions. 
                    Mint your NFTs in seconds, not minutes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-red-500" />
                    Click-through Traffic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add links to your pixels to drive traffic to your website, product, or social media. 
                    Track engagement and measure ROI.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Blockchain</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Network: Solana Mainnet</li>
                      <li>• Standard: Metaplex NFT</li>
                      <li>• Token Symbol: MDP</li>
                      <li>• Royalties: 5%</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Storage</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Images: Arweave permanent storage</li>
                      <li>• Metadata: Arweave JSON</li>
                      <li>• Max file size: 5MB</li>
                      <li>• Formats: PNG, JPG, JPEG</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Simple, Transparent Pricing</CardTitle>
                <CardDescription className="text-center">
                  Pay once, own forever. No hidden fees or recurring charges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">0.01 SOL</div>
                    <div className="text-muted-foreground">per pixel</div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                    <div className="p-4 border rounded-lg">
                      <div className="text-lg font-semibold">1 Pixel</div>
                      <div className="text-2xl font-bold text-primary">0.01 SOL</div>
                      <div className="text-sm text-muted-foreground">~$2.50</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-lg font-semibold">100 Pixels</div>
                      <div className="text-2xl font-bold text-primary">1 SOL</div>
                      <div className="text-sm text-muted-foreground">~$250</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-lg font-semibold">10,000 Pixels</div>
                      <div className="text-2xl font-bold text-primary">100 SOL</div>
                      <div className="text-sm text-muted-foreground">~$25,000</div>
                    </div>
                  </div>

                  <Alert>
                    <DollarSign className="w-4 h-4" />
                    <AlertDescription>
                      Prices shown in USD are estimates based on current SOL market rates. 
                      All transactions are processed in SOL.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Permanent pixel ownership</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Solana NFT certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Arweave permanent storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Click-through link support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Full transferability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>24/7 display visibility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Solana transaction fee</span>
                      <span className="text-muted-foreground">~0.00025 SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arweave storage fee</span>
                      <span className="text-muted-foreground">Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NFT minting fee</span>
                      <span className="text-muted-foreground">Included</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total per transaction</span>
                      <span>~0.00025 SOL extra</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
                <CardDescription>
                  Understanding the technology behind SolanaPage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-3">Frontend Stack</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• React 18 with TypeScript</li>
                      <li>• Vite for build optimization</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• shadcn/ui component library</li>
                      <li>• React Router for navigation</li>
                      <li>• TanStack Query for state management</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Blockchain Integration</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Solana Web3.js for blockchain interaction</li>
                      <li>• Wallet Adapter for wallet connections</li>
                      <li>• Metaplex SDK for NFT operations</li>
                      <li>• Arweave SDK for permanent storage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">NFT Metadata Structure</h3>
                  <CodeBlock language="json">
{`{
  "name": "MDP #123456",
  "description": "Pixel at coordinates (45, 67) on the Million Dollar Homepage NFT grid",
  "image": "https://arweave.net/your-image-hash",
  "external_url": "https://your-website.com",
  "attributes": [
    {
      "trait_type": "X Coordinate",
      "value": 45
    },
    {
      "trait_type": "Y Coordinate", 
      "value": 67
    },
    {
      "trait_type": "Pixel ID",
      "value": "pixel-45-67"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/your-image-hash",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}`}
                  </CodeBlock>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Network Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Mainnet</h4>
                      <CodeBlock language="javascript">
{`const endpoint = "https://api.mainnet-beta.solana.com";
const network = WalletAdapterNetwork.Mainnet;`}
                      </CodeBlock>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Development</h4>
                      <CodeBlock language="javascript">
{`const endpoint = "https://api.devnet.solana.com";
const network = WalletAdapterNetwork.Devnet;`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available API endpoints for developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Pixel Data</h3>
                  <CodeBlock>
{`GET /api/pixels
# Fetch all pixel NFT records

POST /api/pixels
# Save new pixel NFT record`}
                  </CodeBlock>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">File Upload</h3>
                  <CodeBlock>
{`POST /api/arweave/upload
# Upload files to Arweave permanent storage

Content-Type: multipart/form-data
Body: file (image or metadata JSON)`}
                  </CodeBlock>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Chat System</h3>
                  <CodeBlock>
{`GET /api/chat/messages
# Fetch recent chat messages

POST /api/chat/messages
# Send new chat message`}
                  </CodeBlock>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is the Million Dollar Homepage?</h3>
                    <p className="text-muted-foreground">
                      The original Million Dollar Homepage was created in 2005 by Alex Tew as a way to pay for university. 
                      It consisted of a 1000×1000 pixel grid where people could buy pixels for $1 each to advertise their websites. 
                      SolanaPage brings this concept to the blockchain era with permanent ownership and modern technology.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Why choose SolanaPage over traditional advertising?</h3>
                    <p className="text-muted-foreground">
                      Unlike traditional advertising that expires, your SolanaPage pixels are permanently owned through NFTs. 
                      There are no recurring fees, no risk of content removal, and you can even sell your advertising space 
                      to others. It's a one-time investment in permanent exposure.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How long will my advertisement be displayed?</h3>
                    <p className="text-muted-foreground">
                      Forever! Your images are stored permanently on Arweave, and your NFT ownership is recorded on the 
                      Solana blockchain. As long as these networks exist, your advertisement will be accessible.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What wallets are supported?</h3>
                    <p className="text-muted-foreground">
                      We support all major Solana wallets including Phantom, Solflare, Backpack, and any wallet 
                      compatible with the Solana Wallet Adapter standard.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What image formats are supported?</h3>
                    <p className="text-muted-foreground">
                      We support PNG, JPG, and JPEG formats up to 5MB in size. Images are automatically optimized 
                      and resized to fit your selected pixel area while maintaining aspect ratio.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Can I change my image after minting?</h3>
                    <p className="text-muted-foreground">
                      No, NFTs are immutable by design. Once minted, the image and metadata cannot be changed. 
                      This ensures the permanent and trustless nature of your ownership. Choose your image carefully!
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What happens if Arweave goes down?</h3>
                    <p className="text-muted-foreground">
                      Arweave is designed to be permanent and decentralized. The network uses economic incentives 
                      to ensure data is replicated across many nodes worldwide. The probability of permanent data 
                      loss is extremely low, much lower than traditional cloud storage.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Can I sell my pixels to someone else?</h3>
                    <p className="text-muted-foreground">
                      Yes! Your pixels are NFTs that can be transferred, sold, or traded on any NFT marketplace 
                      that supports Solana NFTs, such as Magic Eden, Solanart, or OpenSea.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Do I earn royalties when my NFT is sold?</h3>
                    <p className="text-muted-foreground">
                      The platform retains a 5% royalty on secondary sales. However, as the pixel owner, 
                      you receive 95% of any resale value. You can set your own price when listing for sale.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Is this a good investment?</h3>
                    <p className="text-muted-foreground">
                      SolanaPage pixels should primarily be viewed as advertising and novelty purchases, not investments. 
                      While they may appreciate in value due to scarcity and historical significance, 
                      there are no guarantees. Never invest more than you can afford to lose.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How can I track the performance of my advertisement?</h3>
                    <p className="text-muted-foreground">
                      You can add UTM parameters to your links to track clicks in Google Analytics or other 
                      analytics tools. We may add built-in analytics features in future updates.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Still have questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Can't find the answer you're looking for? Join our community chat or reach out to our support team.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                      <a href="mailto:support@solanapage.com">
                        Email Support
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://discord.gg/solanapage" target="_blank" rel="noopener noreferrer">
                        Join Discord <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://twitter.com/solanapage" target="_blank" rel="noopener noreferrer">
                        Follow on Twitter <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SolanaPage</span>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Own your piece of internet history with permanent, blockchain-based advertising space.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Button variant="link" asChild>
                <a href="/">Back to Grid</a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://github.com/solanapage" target="_blank" rel="noopener noreferrer">
                  GitHub <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
              <Button variant="link" asChild>
                <a href="https://twitter.com/solanapage" target="_blank" rel="noopener noreferrer">
                  Twitter <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 SolanaPage. Built on Solana blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs; 