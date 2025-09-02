const Document = require('../models/Document');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

// @desc    Create a new document
// @route   POST /api/documents
// @access  Public
exports.createDocument = async (req, res, next) => {
  try {
    const { content } = req.body;
    const document = await Document.create({ content });
    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get a document by ID
// @route   GET /api/documents/:id
// @access  Public
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Export a document to PDF
// @route   POST /api/documents/export/pdf
// @access  Public
exports.exportDocumentToPdf = async (req, res, next) => {
  let browser = null;
  
  try {
    const { markdown, filename } = req.body;
    console.log('PDF Export Request received:', { hasMarkdown: !!markdown, hasFilename: !!filename });

    if (!markdown) {
      return res.status(400).json({ success: false, error: 'Markdown content is required' });
    }

    // Generate filename - use provided filename or create from markdown content
    let pdfFilename = 'export.pdf';
    if (filename) {
      // Use provided filename, ensure it has .pdf extension
      pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    } else {
      // Extract first heading or first few words as filename
      const firstHeading = markdown.match(/^#\s+(.+)$/m);
      if (firstHeading) {
        const title = firstHeading[1].trim();
        // Clean filename: remove special characters, limit length
        const cleanTitle = title
          .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .toLowerCase()
          .substring(0, 50); // Limit length
        pdfFilename = `${cleanTitle}.pdf`;
      } else {
        // Use timestamp if no heading found
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
        pdfFilename = `markdown-${timestamp}.pdf`;
      }
    }

    // Convert markdown to HTML
    const html = marked(markdown);
    console.log('Generated HTML length:', html.length); // Log HTML length

    // Create a complete HTML document with proper styling
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            max-width: none;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
          }
          h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
          h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
          h3 { font-size: 1.25em; }
          p { margin-bottom: 16px; }
          ul, ol {
            margin-bottom: 16px;
            padding-left: 30px;
          }
          li {
            margin-bottom: 4px;
          }
          blockquote {
            margin: 16px 0;
            padding: 0 16px;
            border-left: 4px solid #dfe2e5;
            color: #6a737d;
          }
          code {
            background-color: rgba(27,31,35,.05);
            border-radius: 3px;
            font-size: 85%;
            margin: 0;
            padding: .2em .4em;
          }
          pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
            margin-bottom: 16px;
          }
          a {
            color: #0366d6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          table {
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
          }
          table th, table td {
            border: 1px solid #dfe2e5;
            padding: 6px 13px;
          }
          table th {
            background-color: #f6f8fa;
            font-weight: 600;
          }
          
          /* Page break controls */
          @media print {
            h1, h2 {
              page-break-after: avoid;
            }
            pre, blockquote, table {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Puppeteer launch options optimized for Render
    const puppeteerOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    };

    console.log('Launching Puppeteer with options:', puppeteerOptions);
    
    // Launch a headless browser
    browser = await puppeteer.launch(puppeteerOptions);
    console.log('Puppeteer browser launched successfully');
    
    const page = await browser.newPage();
    console.log('New page created');

    // Set the HTML content of the page
    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
    console.log('Page content set successfully');

    // Generate PDF with compact margins
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: {
        top: '15mm',
        right: '20mm', 
        bottom: '15mm',
        left: '20mm'
      }
    });
    console.log('PDF generated successfully, buffer size:', pdfBuffer.length);

    // Close the browser
    await browser.close();
    browser = null;
    console.log('Puppeteer browser closed successfully');

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(pdfBuffer);
    console.log('PDF sent to client successfully');

  } catch (err) {
    console.error('PDF Export Error:', err.message);
    console.error('Full error stack:', err.stack);
    
    // Clean up browser if it's still open
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed after error');
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
    }
    
    // Send more detailed error message
    const errorMessage = err.message.includes('Failed to launch') 
      ? 'PDF generation failed. Puppeteer cannot launch Chrome. This is a known issue on Render Free tier.'
      : err.message;
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
};
