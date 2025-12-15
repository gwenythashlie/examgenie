const supabase = require('../config/supabase');
const pdfParse = require('pdf-parse');

const BUCKET = 'reviewers';

const fetchPdfBuffer = async (filePath) => {
  const { data, error } = await supabase.storage.from(BUCKET).download(filePath);
  if (error || !data) {
    throw new Error(`Download failed: ${error?.message || 'no data'}`);
  }
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const extractTextFromPdf = async (filePath) => {
  const buffer = await fetchPdfBuffer(filePath);
  const parsed = await pdfParse(buffer);
  return parsed.text || '';
};

module.exports = { extractTextFromPdf };
