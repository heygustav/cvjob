
const fs = require('fs');
const path = require('path');

function copyPdfWorker() {
  const source = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
  const destination = path.resolve(__dirname, '../public/pdf.worker.js');
  
  console.log('PDF.js Worker Copy Utility');
  console.log('Source path:', source);
  console.log('Destination path:', destination);
  
  try {
    // Check if source file exists
    if (!fs.existsSync(source)) {
      console.error('Error: Source worker file not found. Please ensure pdfjs-dist is installed.');
      console.log('Expected path:', source);
      return;
    }
    
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      console.log('Creating destination directory:', destDir);
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(source, destination);
    console.log('PDF.js worker file successfully copied to:', destination);
    console.log('PDF parsing should now work correctly in your application.');
  } catch (error) {
    console.error('Error copying PDF.js worker file:', error);
  }
}

copyPdfWorker();
