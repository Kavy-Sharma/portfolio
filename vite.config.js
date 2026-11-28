import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const formKey = env.FORM_KEY || env.VITE_FORM_KEY || process.env.FORM_KEY || process.env.VITE_FORM_KEY || '';

  return {
    plugins: [react()],
    assetsInclude: ['**/*.md'],
    envPrefix: ['VITE_', 'FORM_'],
    define: {
      'import.meta.env.FORM_KEY': JSON.stringify(formKey),
      'import.meta.env.VITE_FORM_KEY': JSON.stringify(formKey)
    }
  };
});
