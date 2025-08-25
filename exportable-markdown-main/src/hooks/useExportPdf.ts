import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { formatFilename } from '@/utils/formatters';

export const useExportPdf = () => {
  // Browser-native print-to-PDF (best quality, like Puppeteer)
  const exportToPdfNative = useCallback(async (
    previewElement: HTMLElement,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      // Create a new window with print-optimized styling
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window - popup might be blocked');
      }

      // Clone the content and add print styles
      const clonedContent = previewElement.cloneNode(true) as HTMLElement;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Markdown Export</title>
          <style>
            @page {
              margin: 0.75in;
              size: A4;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 14px;
              line-height: 1.7;
              color: #1a202c;
              max-width: none;
              margin: 0;
              padding: 0;
              background: white;
              letter-spacing: 0.01em;
            }
            
            /* Headings with precise spacing */
            h1, h2, h3, h4, h5, h6 {
              font-weight: 600;
              color: #1a202c;
              page-break-after: avoid;
              orphans: 3;
              widows: 3;
              margin-top: 0;
              margin-bottom: 0;
            }
            
            h1 { 
              font-size: 28px;
              line-height: 1.2;
              margin-top: 0;
              margin-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
            }
            
            h2 { 
              font-size: 22px;
              line-height: 1.3;
              margin-top: 32px;
              margin-bottom: 16px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
            }
            
            h3 { 
              font-size: 18px;
              line-height: 1.4;
              margin-top: 24px;
              margin-bottom: 12px;
            }
            
            h4 { 
              font-size: 16px;
              line-height: 1.4;
              margin-top: 20px;
              margin-bottom: 8px;
            }
            
            h5 { 
              font-size: 14px;
              line-height: 1.4;
              margin-top: 16px;
              margin-bottom: 6px;
            }
            
            h6 { 
              font-size: 12px;
              line-height: 1.4;
              margin-top: 16px;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            /* Paragraphs and text */
            p {
              margin-top: 0;
              margin-bottom: 16px;
              orphans: 2;
              widows: 2;
            }
            
            p:last-child {
              margin-bottom: 0;
            }
            
            /* Strong and emphasis */
            strong, b { font-weight: 600; }
            em, i { font-style: italic; }
            
            /* Code styling */
            code {
              font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace;
              font-size: 12px;
              background: #f8fafc;
              padding: 2px 6px;
              border-radius: 3px;
              border: 1px solid #e2e8f0;
              word-wrap: break-word;
            }
            
            pre {
              font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace;
              font-size: 12px;
              line-height: 1.5;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 16px;
              margin: 16px 0;
              overflow-x: auto;
              page-break-inside: avoid;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            
            pre code {
              background: none;
              padding: 0;
              border: none;
              font-size: inherit;
            }
            
            /* Blockquotes */
            blockquote {
              margin: 20px 0;
              padding: 0 0 0 16px;
              border-left: 4px solid #3182ce;
              color: #4a5568;
              font-style: italic;
              page-break-inside: avoid;
            }
            
            blockquote p {
              margin-bottom: 8px;
            }
            
            /* Lists */
            ul, ol {
              margin: 16px 0;
              padding-left: 24px;
            }
            
            li {
              margin-bottom: 4px;
              line-height: 1.6;
            }
            
            li p {
              margin-bottom: 8px;
            }
            
            /* Nested lists */
            ul ul, ol ol, ul ol, ol ul {
              margin-top: 4px;
              margin-bottom: 4px;
            }
            
            /* Tables */
            table {
              border-collapse: collapse;
              border-spacing: 0;
              width: 100%;
              margin: 20px 0;
              page-break-inside: avoid;
              font-size: 13px;
            }
            
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px 12px;
              text-align: left;
              vertical-align: top;
            }
            
            th {
              background: #f9fafb;
              font-weight: 600;
              color: #374151;
            }
            
            tr:nth-child(even) {
              background: #fafafa;
            }
            
            /* Images */
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 16px 0;
              page-break-inside: avoid;
            }
            
            /* Horizontal rules */
            hr {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            
            /* Links */
            a {
              color: #3182ce;
              text-decoration: underline;
            }
            
            a:visited {
              color: #553c9a;
            }
            
            /* Print-specific adjustments */
            @media print {
              body { 
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
              }
              
              blockquote, pre, img, table, figure {
                page-break-inside: avoid;
              }
              
              p, li {
                orphans: 2;
                widows: 2;
              }
              
              a {
                color: inherit;
                text-decoration: none;
              }
              
              a[href]:after {
                content: " (" attr(href) ")";
                font-size: 11px;
                color: #666;
              }
            }
          </style>
        </head>
        <body>
          ${clonedContent.innerHTML}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load
      printWindow.onload = () => {
        // Trigger print dialog
        printWindow.print();
        
        // Close the window after a short delay
        setTimeout(() => {
          printWindow.close();
          const filename = formatFilename('markdown-export', 'pdf');
          onSuccess?.(filename);
        }, 1000);
      };
      
    } catch (error) {
      console.error('Native PDF export failed:', error);
      onError?.(error as Error);
    }
  }, []);

  // High-quality image-based PDF export (fallback)
  const exportToPdfAsImage = useCallback(async (
    previewElement: HTMLElement,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      let dataUrl: string;
      
      try {
        // Try html2canvas first (more reliable) with higher quality
        const canvas = await html2canvas(previewElement, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: false,
          logging: false,
        });
        dataUrl = canvas.toDataURL('image/png', 1.0);
      } catch (html2canvasError) {
        console.warn('html2canvas failed, trying html-to-image:', html2canvasError);
        // Fallback to html-to-image
        dataUrl = await toPng(previewElement, {
          quality: 1.0,
          pixelRatio: 2, // Higher pixel ratio for better quality
          backgroundColor: '#ffffff',
          skipFonts: false,
        });
      }

      // Validate the data URL
      if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
        throw new Error('Failed to generate valid image from preview');
      }

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
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const imgRatio = img.width / img.height;
            let width = maxWidth;
            let height = width / imgRatio;

            // If content is very tall, we might need multiple pages
            if (height > maxHeight) {
              // Scale to fit page width, content will be tall
              const pages = Math.ceil(height / maxHeight);
              const pageHeight = maxHeight;
              
              for (let i = 0; i < pages; i++) {
                if (i > 0) pdf.addPage();
                
                // Create a canvas for this page slice
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = img.width;
                tempCanvas.height = (img.height / pages);
                
                if (tempCtx) {
                  tempCtx.drawImage(
                    img,
                    0, i * (img.height / pages), // source position
                    img.width, (img.height / pages), // source dimensions
                    0, 0, // destination position
                    img.width, (img.height / pages) // destination dimensions
                  );
                  
                  const pageDataUrl = tempCanvas.toDataURL('image/png', 1.0);
                  pdf.addImage(pageDataUrl, 'PNG', margin, margin, width, pageHeight);
                }
              }
            } else {
              // Single page - center the image
              const x = (pageWidth - width) / 2;
              const y = (pageHeight - height) / 2;
              pdf.addImage(dataUrl, 'PNG', x, y, width, height);
            }

            // Generate filename and save
            const filename = formatFilename('markdown-export', 'pdf');
            pdf.save(filename);

            onSuccess?.(filename);
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = (e) => {
          console.error('Image loading error:', e);
          reject(new Error('Failed to load generated image - the data URL might be corrupted'));
        };

        img.src = dataUrl;
      });

    } catch (error) {
      console.error('PDF export failed:', error);
      onError?.(error as Error);
    }
  }, []);

  // Main export function - uses browser's native print (like Puppeteer quality)
  const exportToPdf = useCallback(async (
    previewElement: HTMLElement,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ) => {
    // Use native print - this gives Puppeteer-level quality with selectable text
    await exportToPdfNative(previewElement, onSuccess, onError);
  }, [exportToPdfNative]);

  return { 
    exportToPdf,
    exportToPdfNative,
    exportToPdfAsImage 
  };
};

