import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  createdAtISO: string;
  content: string; // Store the markdown content for re-generation
}

const HISTORY_STORAGE_KEY = 'markdown-exporter-history';
const MAX_HISTORY_ITEMS = 5;

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((name: string, type: 'pdf' | 'docx', content: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      name,
      type,
      createdAtISO: new Date().toISOString(),
      content,
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      // Keep only the latest 5 items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeHistoryItem,
  };
};
