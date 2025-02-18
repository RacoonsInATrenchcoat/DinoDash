import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Ensure Vite runs in Frontend/
  publicDir: "D:/Coding/Projects/DinoDash/Frontend/public", // Force Vite to look at Frontend/public
});
