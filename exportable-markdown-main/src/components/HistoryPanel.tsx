import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Trash2, 
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { HistoryItem } from '@/hooks/useHistory';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface HistoryPanelProps {
  history: HistoryItem[];
  onDownload: (item: HistoryItem) => void;
  onShare: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

export const HistoryPanel = ({
  history,
  onDownload,
  onShare,
  onClear,
  onClose,
  isOpen,
  className
}: HistoryPanelProps) => {
  if (!isOpen) return null;

  return (
    <Card className={cn(
      "absolute top-16 right-4 w-80 max-h-96 overflow-hidden z-50 shadow-elegant",
      className
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <h3 className="font-semibold">Export History</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {history.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No exports yet</p>
            <p className="text-xs mt-1">Your exported files will appear here</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {history.map((item) => (
              <Card key={item.id} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <Badge 
                        variant={item.type === 'pdf' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.createdAtISO)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(item)}
                      className="h-7 w-7 p-0"
                      title="Re-download"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShare(item)}
                      className="h-7 w-7 p-0"
                      title="Share via WhatsApp"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      )}
    </Card>
  );
};