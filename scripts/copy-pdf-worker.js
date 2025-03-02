
const fs = require('fs');
const path = require('path');

function copyPdfWorker() {
  const source = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
  const destination = path.resolve(__dirname, '../public/pdf.worker.js');
  
  try {
    if (!fs.existsSync(path.dirname(destination))) {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
    }
    
    fs.copyFileSync(source, destination);
    console.log('PDF.js worker file copied to public directory');
  } catch (error) {
    console.error('Error copying PDF.js worker file:', error);
  }
}

copyPdfWorker();
