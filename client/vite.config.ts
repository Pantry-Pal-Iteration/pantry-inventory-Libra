import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const CLIENT_NODE_MODULES = path.resolve(__dirname, 'node_modules');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(CLIENT_NODE_MODULES, 'react'),
      'react-dom': path.resolve(CLIENT_NODE_MODULES, 'react-dom'),
    },
  },

  // *** FIX FOR: does not provide an export named 'default' ***
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['react-hook-form'],
  },

  build: {
    commonjsOptions: {
      defaultIsModuleExports: true,
      include: [/node_modules/],
    },
  },
});
