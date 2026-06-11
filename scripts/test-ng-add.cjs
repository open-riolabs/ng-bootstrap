// Isolated, in-memory verification of the ng-add schematic.
// No real npm install, no writes to the repo.
const { SchematicTestRunner } = require('@angular-devkit/schematics/testing');
const { Tree } = require('@angular-devkit/schematics');
const path = require('node:path');

const collection = path.join(__dirname, '..', 'dist', 'rlb', 'ng-bootstrap', 'schematics', 'collection.json');

const angularJson = {
  version: 1,
  projects: {
    demo: {
      projectType: 'application',
      root: '',
      sourceRoot: 'src',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: { browser: 'src/main.ts', tsConfig: 'tsconfig.app.json', styles: ['src/styles.scss'] },
        },
      },
    },
  },
};

const tree = Tree.empty();
tree.create('/package.json', JSON.stringify({ name: 'demo', version: '0.0.0', dependencies: {}, devDependencies: {} }, null, 2));
tree.create('/angular.json', JSON.stringify(angularJson, null, 2));
tree.create('/tsconfig.app.json', JSON.stringify({ compilerOptions: {} }, null, 2));
tree.create('/src/styles.scss', '');
tree.create('/src/main.ts', [
  "import { bootstrapApplication } from '@angular/platform-browser';",
  "import { appConfig } from './app/app.config';",
  "import { AppComponent } from './app/app.component';",
  'bootstrapApplication(AppComponent, appConfig);',
  '',
].join('\n'));
tree.create('/src/app/app.config.ts', [
  "import { ApplicationConfig } from '@angular/core';",
  'export const appConfig: ApplicationConfig = {',
  '  providers: [],',
  '};',
  '',
].join('\n'));
tree.create('/src/app/app.component.ts', [
  "import { Component } from '@angular/core';",
  "@Component({ selector: 'app-root', template: '' })",
  'export class AppComponent {}',
  '',
].join('\n'));

(async () => {
  const runner = new SchematicTestRunner('open-rlb', collection);
  const result = await runner.runSchematic('ng-add', { project: 'demo' }, tree);

  console.log('=== scheduled tasks (should include node-package install) ===');
  console.log(runner.tasks.map(t => t.name + ' ' + JSON.stringify(t.options || {})).join('\n') || '(none)');

  console.log('\n=== /package.json ===');
  console.log(result.readContent('/package.json'));

  console.log('=== /angular.json styles ===');
  console.log(JSON.stringify(JSON.parse(result.readContent('/angular.json')).projects.demo.architect.build.options.styles, null, 2));

  console.log('\n=== /src/app/app.config.ts ===');
  console.log(result.readContent('/src/app/app.config.ts'));

  console.log('=== generated files under src/app/rlb-starter ===');
  console.log(result.files.filter(f => f.includes('rlb-starter')).join('\n') || '(none)');
  console.log('\n--- rlb-starter.component.ts ---');
  console.log(result.readContent('/src/app/rlb-starter/rlb-starter.component.ts'));

  console.log('\n=== Claude skills copied to .claude/skills ===');
  console.log(result.files.filter(f => f.startsWith('/.claude/skills')).join('\n') || '(none)');
})().catch(err => {
  console.error('SCHEMATIC FAILED:\n', err);
  process.exit(1);
});
