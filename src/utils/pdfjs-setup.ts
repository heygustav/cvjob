
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js to use a worker from the same origin
// This avoids issues with cross-origin restrictions and import queries
const workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

console.log(`Setting PDF.js worker source to: ${workerSrc}`);

try {
  // Configure PDF.js worker
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  console.log('PDF.js worker configuration complete');
} catch (error) {
  console.error('Error configuring PDF.js worker:', error);
}

export { pdfjs };
