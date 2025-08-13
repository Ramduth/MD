import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { formatFilename } from '@/utils/formatters';

export const useExportPdf = () => {
  const exportToPdf = useCallback(async (
    previewElement: HTMLElement,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      // Generate image from preview element
      const dataUrl = await toPng(previewElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: previewElement.scrollWidth,
        height: previewElement.scrollHeight,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);

      // Create image and calculate scaled dimensions
      const img = new Image();
      img.onload = () => {
        const imgRatio = img.width / img.height;
        let width = maxWidth;
        let height = width / imgRatio;

        // If height exceeds page, scale by height instead
        if (height > maxHeight) {
          height = maxHeight;
          width = height * imgRatio;
        }

        // Center the image
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(dataUrl, 'PNG', x, y, width, height);

        // Generate filename and save
        const filename = formatFilename('markdown-export', 'pdf');
        pdf.save(filename);

        onSuccess?.(filename);
      };

      img.onerror = () => {
        throw new Error('Failed to load generated image');
      };

      img.src = dataUrl;

    } catch (error) {
      console.error('PDF export failed:', error);
      onError?.(error as Error);
    }
  }, []);

  return { exportToPdf };
};

// Real backend-based PDF generation
export const useExportPdfBackend = () => {
  const exportToPdf = useCallback(async (
    markdown: string,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void,
    customFilename?: string
  ) => {
    try {
      const response = await fetch('http://localhost:3001/api/documents/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown, filename: customFilename }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
      }

      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Received empty PDF file from server');
      }
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = formatFilename('markdown-export', 'pdf');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      onSuccess?.(filename);

    } catch (error) {
      console.error('Backend PDF export failed:', error);
      onError?.(error as Error);
    }
  }, []);

  return { exportToPdf };
};