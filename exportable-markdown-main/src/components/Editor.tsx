import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  wordCount: number;
  charCount: number;
  onClear: () => void;
  className?: string;
}

export const Editor = ({ 
  content, 
  onChange, 
  wordCount, 
  charCount, 
  onClear,
  className 
}: EditorProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
      };
      reader.readAsText(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    noClick: true,
  });

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <div 
        {...getRootProps()} 
        className={cn(
          "flex-1 p-4 transition-colors",
          isDragActive && "bg-gradient-accent border-primary"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Markdown Editor</h2>
          {content && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isDragActive && (
          <div className="absolute inset-4 border-2 border-dashed border-primary bg-gradient-accent rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Drop your .md file here</p>
            </div>
          </div>
        )}

        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing your markdown here... or drag and drop a .md file"
          className="min-h-[400px] resize-none border-0 shadow-none focus-visible:ring-0 bg-editor-bg"
        />
      </div>

      <div className="p-4 border-t bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="text-xs">
            Drag & drop .md files supported
          </div>
        </div>
      </div>
    </Card>
  );
};