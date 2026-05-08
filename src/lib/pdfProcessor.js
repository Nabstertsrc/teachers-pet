export const isPDF = (file) => {
  if (!file) return false;
  const name = typeof file === 'string' ? file : file.name;
  return name?.toLowerCase().endsWith('.pdf');
};

export const extractTextFromPDF = async (file) => {
  // In a real browser environment, we'd use pdf.js
  // For this integration, we'll simulate it or use a simpler text extraction for .txt files
  // and handle PDFs via the AI if needed, but since we're in a browser env, we can try to load pdf.js
  
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return await file.text();
  }

  // Placeholder for PDF.js logic
  // We'll advise the user that PDF extraction requires pdfjs-dist
  return "PDF Content Extraction placeholder. Please use a .txt or .md file for now, or ensure pdfjs-dist is installed.";
};
