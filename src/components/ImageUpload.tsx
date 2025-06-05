
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}

export const ImageUpload = ({ onImageSelect, selectedImage }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-pixel text-muted-foreground">Upload Image</label>
      
      {preview ? (
        <div className="relative">
          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border border-border">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleUploadClick}
          className="w-full h-32 border-dashed border-2 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-6 h-6" />
            <span className="text-xs font-pixel">Click to upload</span>
            <span className="text-[10px]">PNG, JPG up to 10MB</span>
          </div>
        </Button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
