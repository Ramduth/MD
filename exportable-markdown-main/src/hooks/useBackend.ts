import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL_KEY = 'markdown-exporter-backend-url';

export const useBackend = () => {
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(BACKEND_URL_KEY);
    if (saved) {
      setBackendUrl(saved);
    }
  }, []);

  const updateBackendUrl = useCallback((url: string) => {
    setBackendUrl(url);
    localStorage.setItem(BACKEND_URL_KEY, url);
  }, []);

  // Placeholder methods for future backend integration
  const uploadExport = useCallback(async (blob: Blob, filename: string): Promise<string> => {
    // For now, return a fake URL
    const baseUrl = backendUrl || 'https://example.com';
    return `${baseUrl}/files/${filename}`;
  }, [backendUrl]);

  const shortenUrl = useCallback(async (url: string): Promise<string> => {
    // For now, return the same URL
    return url;
  }, []);

  return {
    backendUrl,
    updateBackendUrl,
    uploadExport,
    shortenUrl,
  };
};