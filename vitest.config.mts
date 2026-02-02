/// <reference types="vitest" />
import { angularVitestPlugin } from '@angular/build/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angularVitestPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
  },
});
