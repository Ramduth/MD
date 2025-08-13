import { useCallback } from 'react';
import { useDeviceDetect } from './useDeviceDetect';
import { truncateForWhatsApp } from '@/utils/formatters';

export const useWhatsappShare = () => {
  const { getWhatsAppUrl } = useDeviceDetect();

  const shareMarkdown = useCallback((markdown: string, truncate = true) => {
    const message = truncate ? truncateForWhatsApp(markdown) : markdown;
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  }, [getWhatsAppUrl]);

  const shareUrl = useCallback((url: string, title?: string) => {
    const message = title 
      ? `${title}\n\n${url}`
      : `Check out this exported document: ${url}`;
    
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  }, [getWhatsAppUrl]);

  return {
    shareMarkdown,
    shareUrl,
  };
};