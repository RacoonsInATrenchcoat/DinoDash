import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'Backend/Firebase/public'), // Change output directory to Firebase public folder. _dirname is the project folder.
    assetsDir: `assets`,                  // Specifies that the assets are put into public/assets folder instead of public/dist/assets
    emptyOutDir: false,                  // If true, clears the folder before each build. Good pratice but deletes previous files there!

    /*Note on path & dirname:
    It creates an anchor that others can relate the path to.
    __dirname refers to the directory where vite.config.js is located.

    From: "D:/Coding/Projects/DinoDash/"
    Using: "path.resolve(__dirname, 'Backend/Firebase/public')"

    To: D:/Coding/Projects/DinoDash/Backend/Firebase/public
    Where the main folder (DinoDash) is now the _currentdirectoryname

    */

    rollupOptions: {
      input: './Frontend/Components/src/main.jsx',            // Ensure main entry point is included
      output: {
        entryFileNames: 'assets/index.js',    // Force output filename, instead of randomly generated
        chunkFileNames: 'assets/[name].js',   // Ensures other JS files are predictable
        assetFileNames: 'assets/[name].[ext]',// Fix CSS and images
        /*Why?
        Vite will now always generate public/assets/index.js (instead of a hashed filename).
        Your index.html now correctly references /assets/index.js, so it works in both development and production.
        Random hashes also means it cant be pointed to, unlike specific filenames.
        */
      }
    }
  },
});