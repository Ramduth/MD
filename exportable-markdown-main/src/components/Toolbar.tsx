import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Share2, 
  Settings, 
  FileDown,
  History,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  onNew: () => void;
  onImport: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onShare: () => void;
  onSettings: () => void;
  onHistory: () => void;
  hasContent: boolean;
  isExporting: boolean;
  className?: string;
}

export const Toolbar = ({
  onNew,
  onImport,
  onExportPdf,
  onExportDocx,
  onShare,
  onSettings,
  onHistory,
  hasContent,
  isExporting,
  className
}: ToolbarProps) => {
  return (
    <div className={cn(
      "flex flex-wrap items-center gap-2 p-4 bg-card border-b",
      className
    )}>
      <div className="flex items-center gap-2 flex-1">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Markdown Exporter Pro
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNew}
          className="hidden sm:flex"
        >
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button
          variant="default"
          size="sm"
          onClick={onExportPdf}
          disabled={!hasContent || isExporting}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onExportDocx}
          disabled={!hasContent || isExporting}
        >
          <FileDown className="h-4 w-4 mr-2" />
          DOCX
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          disabled={!hasContent}
          className="hidden sm:flex"
        >
          <Share2 className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>

        <div className="h-4 w-px bg-border hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onHistory}
        >
          <History className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">History</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};