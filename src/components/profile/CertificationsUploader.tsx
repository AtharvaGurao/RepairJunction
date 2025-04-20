
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CertificationsUploaderProps {
  initialCertifications: string | null;
  onCertificationsChange: (files: FileList | null) => void;
}

export function CertificationsUploader({
  initialCertifications,
  onCertificationsChange
}: CertificationsUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Handle displaying existing certifications
    if (initialCertifications) {
      try {
        // Make sure we have a valid JSON string before parsing
        if (typeof initialCertifications === 'string' && initialCertifications.trim() !== '') {
          const parsedCertifications = JSON.parse(initialCertifications);
          if (Array.isArray(parsedCertifications)) {
            setUploadedFiles(parsedCertifications.map((cert: any) => cert.name));
          }
        }
      } catch (error) {
        console.error("Error parsing certifications:", error);
        setUploadedFiles([]);
      }
    }
  }, [initialCertifications]);

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onCertificationsChange(files);
    
    // Update the UI to show selected file names
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prevFiles => [...prevFiles, ...fileNames]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="certifications">Certifications/Qualifications</Label>
      <div className="flex items-center gap-2">
        <Input
          id="certifications"
          name="certifications"
          type="file"
          onChange={handleCertificationChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple
        />
        <Button 
          type="button" 
          size="sm"
          variant="outline"
          onClick={() => document.getElementById('certifications')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium">Uploaded files:</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-muted-foreground">Upload certifications related to your expertise (PDF, Images, Documents)</p>
    </div>
  );
}
