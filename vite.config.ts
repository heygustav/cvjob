
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// Copy PDF.js worker during build process
const copyPdfWorker = () => {
  return {
    name: 'copy-pdf-worker',
    buildStart() {
      const source = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.js');
      const dest = path.resolve(__dirname, 'public/pdf.worker.js');
      
      try {
        if (fs.existsSync(source)) {
          console.log('Copying PDF.js worker file to public directory...');
          if (!fs.existsSync(path.dirname(dest))) {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
          }
          fs.copyFileSync(source, dest);
          console.log('PDF.js worker file copied successfully');
        } else {
          console.warn('PDF.js worker file not found at:', source);
        }
      } catch (error) {
        console.error('Error copying PDF.js worker file:', error);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    copyPdfWorker(), // Add the plugin to copy the PDF.js worker
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    }
  }
}));
