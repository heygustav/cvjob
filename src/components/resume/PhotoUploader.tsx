
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploaderProps {
  photo?: string;
  onPhotoChange: (photo?: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photo, onPhotoChange }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fejl ved upload",
        description: "Billedet må ikke overstige 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onPhotoChange(event.target.result as string);

        toast({
          title: "Billede uploadet",
          description: "Dit foto er blevet tilføjet til CV'et.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(undefined);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "Billede fjernet",
      description: "Dit foto er blevet fjernet fra CV'et.",
    });
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-2">Profilbillede (valgfrit)</h4>
      <div className="flex items-center space-x-4">
        {photo ? (
          <div className="relative inline-block">
            <img 
              src={photo} 
              alt="Profilbillede" 
              className="w-16 h-16 object-cover rounded-full border"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Fjern billede"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload billede
          </Button>
        )}
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        <span className="text-xs text-muted-foreground">
          Billedet vil blive vist i øverste venstre hjørne af dit CV
        </span>
      </div>
    </div>
  );
};

export default PhotoUploader;
