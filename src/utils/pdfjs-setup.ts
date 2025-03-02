
import * as pdfjs from 'pdfjs-dist';

// Use a path from the public directory - this is the key to fixing the worker loading issue
// The public directory in Vite is served at the root path
const workerSrc = '/pdf.worker.js';
console.log(`Setting PDF.js worker source to: ${workerSrc}`);

try {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  console.log('PDF.js worker configuration complete');
} catch (error) {
  console.error('Error configuring PDF.js worker:', error);
}

export { pdfjs };
