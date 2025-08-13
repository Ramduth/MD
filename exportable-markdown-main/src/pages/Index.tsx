import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useMarkdownState } from '@/hooks/useMarkdownState';
import { useHistory } from '@/hooks/useHistory';
import { useBackend } from '@/hooks/useBackend';
import { useExportPdfBackend } from '@/hooks/useExportPdf';
import { useExportDocx } from '@/hooks/useExportDocx';
import { useWhatsappShare } from '@/hooks/useWhatsappShare';
import { useIsMobile } from '@/hooks/use-mobile';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Toolbar } from '@/components/Toolbar';
import { HistoryPanel } from '@/components/HistoryPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { ToastContainer, useToasts } from '@/components/Toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Eye, Edit } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [isExporting, setIsExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Hooks
  const {
    content,
    updateContent,
    clearContent,
    loadFromFile,
    wordCount,
    charCount,
  } = useMarkdownState();

  const {
    history,
    addToHistory,
    clearHistory,
  } = useHistory();

  const {
    backendUrl,
    updateBackendUrl,
  } = useBackend();

  const { exportToPdf } = useExportPdfBackend();
  const { exportToDocx } = useExportDocx();
  const { shareMarkdown, shareUrl } = useWhatsappShare();
  const { showSuccess, showError, showInfo, toasts, removeToast } = useToasts();

  // Handlers
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          loadFromFile(text);
          showSuccess('File imported successfully', file.name);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportPdf = async () => {
    if (!content) return;
    
    setIsExporting(true);
    try {
      await exportToPdf(
        content,
        (filename) => {
          addToHistory(filename, 'pdf', content);
          showSuccess('PDF exported successfully', filename);
        },
        (error) => {
          showError('PDF export failed', error.message);
        }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (!content) return;
    
    setIsExporting(true);
    try {
      await exportToDocx(
        content,
        (filename) => {
          addToHistory(filename, 'docx', content);
          showSuccess('DOCX exported successfully', filename);
        },
        (error) => {
          showError('DOCX export failed', error.message);
        }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!content) return;
    
    try {
      shareMarkdown(content);
      showInfo('Opening WhatsApp...', 'Share link will open in a new tab');
    } catch (error) {
      showError('Failed to open WhatsApp', 'Please try again');
    }
  };

  const handleHistoryDownload = async (item: any) => {
    if (item.type === 'pdf') {
      setIsExporting(true);
      try {
        await exportToPdf(
          item.content,
          () => showSuccess('PDF re-downloaded', item.name),
          (error) => showError('Download failed', error.message)
        );
      } finally {
        setIsExporting(false);
      }
    } else if (item.type === 'docx') {
      setIsExporting(true);
      try {
        await exportToDocx(
          item.content,
          () => showSuccess('DOCX re-downloaded', item.name),
          (error) => showError('Download failed', error.message)
        );
      } finally {
        setIsExporting(false);
      }
    }
  };

  const handleHistoryShare = (item: any) => {
    try {
      shareMarkdown(item.content);
      showInfo('Opening WhatsApp...', 'Sharing content from history');
    } catch (error) {
      showError('Failed to share', 'Please try again');
    }
  };

  const hasContent = content.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Toolbar
        onNew={clearContent}
        onImport={handleImport}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onShare={handleWhatsAppShare}
        onSettings={() => setShowSettings(true)}
        onHistory={() => setShowHistory(true)}
        hasContent={hasContent}
        isExporting={isExporting}
      />

      <div className="relative">
        {isMobile ? (
          // Mobile: Tabbed interface
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-0">
                <Editor
                  content={content}
                  onChange={updateContent}
                  wordCount={wordCount}
                  charCount={charCount}
                  onClear={clearContent}
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <Preview ref={previewRef} content={content} />
              </TabsContent>
            </Tabs>

            {/* Mobile floating share button */}
            {hasContent && (
              <Button
                onClick={handleWhatsAppShare}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow z-40"
                size="sm"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            )}
          </div>
        ) : (
          // Desktop: Side-by-side layout
          <div className="grid grid-cols-2 gap-4 p-4" style={{ height: 'calc(100vh - 80px)' }}>
            <Editor
              content={content}
              onChange={updateContent}
              wordCount={wordCount}
              charCount={charCount}
              onClear={clearContent}
            />
            <Preview ref={previewRef} content={content} />
          </div>
        )}

        {/* History Panel */}
        <HistoryPanel
          history={history}
          onDownload={handleHistoryDownload}
          onShare={handleHistoryShare}
          onClear={clearHistory}
          onClose={() => setShowHistory(false)}
          isOpen={showHistory}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        backendUrl={backendUrl}
        onBackendUrlChange={updateBackendUrl}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Index;
