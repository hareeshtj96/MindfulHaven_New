import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load environment variables

  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['jwt-decode'],
    },
    // You can add your custom env variables or other configurations here if needed
  };
});
