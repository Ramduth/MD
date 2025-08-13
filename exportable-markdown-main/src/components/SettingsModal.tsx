import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Server, Save, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  backendUrl,
  onBackendUrlChange,
}: SettingsModalProps) => {
  const [tempUrl, setTempUrl] = useState(backendUrl);

  const handleSave = () => {
    onBackendUrlChange(tempUrl);
    onClose();
  };

  const handleClose = () => {
    setTempUrl(backendUrl); // Reset to original value
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
            Configure your backend settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-4 w-4" />
              <Label htmlFor="backend-url" className="font-medium">
                Backend API URL
              </Label>
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </div>
            
            <Input
              id="backend-url"
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://your-api.example.com"
              className="mb-3"
            />
            
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="mb-1 font-medium">Future Feature</p>
                <p>
                  This will be used for file uploads and URL generation when 
                  backend integration is implemented. Currently, all exports 
                  work locally in your browser.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};