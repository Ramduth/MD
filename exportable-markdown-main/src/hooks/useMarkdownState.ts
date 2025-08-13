import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'markdown-exporter-content';
const AUTOSAVE_INTERVAL = 2000;

export const useMarkdownState = () => {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
      setLastSaved(new Date());
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        localStorage.setItem(STORAGE_KEY, content);
        setLastSaved(new Date());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [content]);

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const clearContent = useCallback(() => {
    setContent('');
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
  }, []);

  const loadFromFile = useCallback((fileContent: string) => {
    setContent(fileContent);
  }, []);

  // Calculate word and character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return {
    content,
    updateContent,
    clearContent,
    loadFromFile,
    lastSaved,
    wordCount,
    charCount,
  };
};