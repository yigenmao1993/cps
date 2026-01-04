// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './',   // ★加这一行
  plugins: [react()],
})
