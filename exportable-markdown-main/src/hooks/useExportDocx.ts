import { useCallback } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { formatFilename } from '@/utils/formatters';

interface MarkdownElement {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'blockquote';
  level?: number;
  content: string;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
}

export const useExportDocx = () => {
  const parseMarkdown = useCallback((markdown: string): MarkdownElement[] => {
    const lines = markdown.split('\n');
    const elements: MarkdownElement[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        elements.push({ type: 'paragraph', content: '' });
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        elements.push({
          type: 'heading',
          level: headingMatch[1].length,
          content: headingMatch[2],
        });
        continue;
      }

      // Code blocks
      if (line.startsWith('```')) {
        const codeLines = [];
        i++; // Skip opening ```
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push({
          type: 'code',
          content: codeLines.join('\n'),
        });
        continue;
      }

      // Lists
      if (line.match(/^[-*+]\s+/) || line.match(/^\d+\.\s+/)) {
        const listContent = line.replace(/^[-*+\d+\.]\s+/, '');
        elements.push({
          type: 'list',
          content: listContent,
        });
        continue;
      }

      // Blockquotes
      if (line.startsWith('>')) {
        elements.push({
          type: 'blockquote',
          content: line.replace(/^>\s*/, ''),
        });
        continue;
      }

      // Regular paragraph
      elements.push({
        type: 'paragraph',
        content: line,
      });
    }

    return elements;
  }, []);

  const createDocxElements = useCallback((elements: MarkdownElement[]) => {
    return elements.map(element => {
      const processText = (text: string) => {
        const runs: TextRun[] = [];
        let currentText = '';
        let isBold = false;
        let isItalic = false;
        let isCode = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];

          if (char === '*' && nextChar === '*') {
            if (currentText) {
              runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
              currentText = '';
            }
            isBold = !isBold;
            i++; // Skip next *
            continue;
          }

          if (char === '*') {
            if (currentText) {
              runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
              currentText = '';
            }
            isItalic = !isItalic;
            continue;
          }

          if (char === '`') {
            if (currentText) {
              runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
              currentText = '';
            }
            isCode = !isCode;
            continue;
          }

          currentText += char;
        }

        if (currentText) {
          runs.push(new TextRun({ 
            text: currentText, 
            bold: isBold, 
            italics: isItalic,
            font: isCode ? 'Courier New' : undefined,
          }));
        }

        return runs;
      };

      switch (element.type) {
        case 'heading':
          const level = Math.min(element.level || 1, 6);
          const headingLevels = [
            HeadingLevel.HEADING_1,
            HeadingLevel.HEADING_2,
            HeadingLevel.HEADING_3,
            HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_5,
            HeadingLevel.HEADING_6,
          ];
          return new Paragraph({
            text: element.content,
            heading: headingLevels[level - 1],
          });

        case 'code':
          return new Paragraph({
            children: [
              new TextRun({
                text: element.content,
                font: 'Courier New',
                size: 20,
              }),
            ],
          });

        case 'list':
          return new Paragraph({
            children: processText(`• ${element.content}`),
          });

        case 'blockquote':
          return new Paragraph({
            children: processText(element.content),
            indent: { left: 720 }, // 0.5 inch
          });

        default:
          return new Paragraph({
            children: processText(element.content),
          });
      }
    });
  }, []);

  const exportToDocx = useCallback(async (
    markdown: string,
    onSuccess?: (filename: string) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const elements = parseMarkdown(markdown);
      const docxElements = createDocxElements(elements);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docxElements,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const filename = formatFilename('markdown-export', 'docx');
      
      // Create a download link and trigger download
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      onSuccess?.(filename);

    } catch (error) {
      console.error('DOCX export failed:', error);
      onError?.(error as Error);
    }
  }, [parseMarkdown, createDocxElements]);

  return { exportToDocx };
};