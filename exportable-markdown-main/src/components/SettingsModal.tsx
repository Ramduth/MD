import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
}: SettingsModalProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Application information and export details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="mb-1 font-medium">Client-Side Export</p>
                <p>
                  All PDF and DOCX exports now work directly in your browser 
                  without requiring a backend server. This makes the app fully 
                  self-contained and deployable on static hosting platforms.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};