
/**
 * This file contains instructions for manually copying the PDF.js worker file
 * to the public directory since we can't modify package.json directly.
 * 
 * Follow these steps:
 * 
 * 1. Navigate to your project directory in a terminal
 * 2. Run: node scripts/copy-pdf-worker.js
 * 
 * This will copy the worker file from node_modules to the public directory,
 * which is necessary for PDF parsing to work correctly.
 * 
 * You only need to do this once, or whenever you update the pdfjs-dist package.
 * 
 * If you encounter errors, check:
 * - Your terminal is at the project root (where package.json is)
 * - The public directory exists
 * - Node.js is installed and working
 * - You have pdfjs-dist installed in node_modules
 */

// This file is for documentation only and doesn't need to be imported anywhere
