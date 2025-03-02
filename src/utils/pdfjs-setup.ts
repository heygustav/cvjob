
import * as pdfjs from 'pdfjs-dist';

// Get the base URL for our application
const getBaseUrl = () => {
  // In development or when serving locally
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/';
  }
  
  // In production when deployed
  return window.location.origin + '/';
};

// Set up the worker path using the base URL
const workerSrc = `${getBaseUrl()}pdf.worker.js`;

console.log(`Setting PDF.js worker source to: ${workerSrc}`);

try {
  // Configure PDF.js to use the worker from the public directory
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  console.log('PDF.js worker configuration complete');
  
  // Force loading the worker to check if it's available
  fetch(workerSrc, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log('PDF.js worker file verified and available');
      } else {
        console.error(`PDF.js worker file check failed with status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error verifying PDF.js worker file:', error);
    });
} catch (error) {
  console.error('Error configuring PDF.js worker:', error);
}

export { pdfjs };
