/// <reference types="vitest" />
import { angularVitestPlugin } from '@angular/build/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angularVitestPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/rlb/ng-bootstrap/src/test-setup.ts'],
    include: ['projects/rlb/ng-bootstrap/src/**/*.spec.ts'],
    reporters: ['default'],
  },
});
