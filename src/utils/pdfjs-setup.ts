
import * as pdfjs from 'pdfjs-dist';

// Use a path from the public directory - this is the key to fixing the worker loading issue
// The public directory in Vite is served at the root path
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export { pdfjs };
