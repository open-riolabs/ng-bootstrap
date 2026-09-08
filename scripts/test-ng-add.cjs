// Isolated, in-memory verification of the ng-add and sync-skills schematics.
// No real npm install, no writes to the repo.
const { SchematicTestRunner } = require('@angular-devkit/schematics/testing');
const { Tree } = require('@angular-devkit/schematics');
const { readdirSync } = require('node:fs');
const path = require('node:path');

const distSchematics = path.join(__dirname, '..', 'dist', 'rlb', 'ng-bootstrap', 'schematics');
const collection = path.join(distSchematics, 'collection.json');

/** The skills the freshly built package actually bundles — the expected sync result. */
const bundledSkills = readdirSync(path.join(distSchematics, 'sync-skills', 'claude-skills'), {
  withFileTypes: true,
})
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

let failures = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}

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
          options: {
            browser: 'src/main.ts',
            tsConfig: 'tsconfig.app.json',
            styles: ['src/styles.scss'],
          },
        },
      },
    },
  },
};

function appTree(packageJson) {
  const tree = Tree.empty();
  tree.create('/package.json', JSON.stringify(packageJson, null, 2));
  tree.create('/angular.json', JSON.stringify(angularJson, null, 2));
  tree.create('/tsconfig.app.json', JSON.stringify({ compilerOptions: {} }, null, 2));
  tree.create('/src/styles.scss', '');
  tree.create(
    '/src/main.ts',
    [
      "import { bootstrapApplication } from '@angular/platform-browser';",
      "import { appConfig } from './app/app.config';",
      "import { AppComponent } from './app/app.component';",
      'bootstrapApplication(AppComponent, appConfig);',
      '',
    ].join('\n'),
  );
  tree.create(
    '/src/app/app.config.ts',
    [
      "import { ApplicationConfig } from '@angular/core';",
      'export const appConfig: ApplicationConfig = {',
      '  providers: [],',
      '};',
      '',
    ].join('\n'),
  );
  tree.create(
    '/src/app/app.component.ts',
    [
      "import { Component } from '@angular/core';",
      "@Component({ selector: 'app-root', template: '' })",
      'export class AppComponent {}',
      '',
    ].join('\n'),
  );
  return tree;
}

async function testNgAdd() {
  console.log('\n=== ng-add on a fresh app ===');
  const runner = new SchematicTestRunner('open-rlb', collection);
  const tree = appTree({
    name: 'demo',
    version: '0.0.0',
    dependencies: { '@angular/core': '^21.1.2' },
    devDependencies: {},
  });
  const result = await runner.runSchematic('ng-add', { project: 'demo' }, tree);

  console.log('\n--- scheduled tasks (should include node-package install) ---');
  console.log(
    runner.tasks.map(t => t.name + ' ' + JSON.stringify(t.options || {})).join('\n') || '(none)',
  );

  console.log('\n--- /package.json ---');
  console.log(result.readContent('/package.json'));

  console.log('--- /angular.json styles ---');
  console.log(
    JSON.stringify(
      JSON.parse(result.readContent('/angular.json')).projects.demo.architect.build.options.styles,
      null,
      2,
    ),
  );

  console.log('\n--- /src/app/app.config.ts ---');
  console.log(result.readContent('/src/app/app.config.ts'));

  console.log('--- generated files under src/app/rlb-starter ---');
  console.log(result.files.filter(f => f.includes('rlb-starter')).join('\n') || '(none)');

  console.log('\n--- Claude skills copied to .claude/skills ---');
  console.log(result.files.filter(f => f.startsWith('/.claude/skills')).join('\n') || '(none)');

  console.log('\n--- assertions ---');
  const pkg = JSON.parse(result.readContent('/package.json'));
  check(
    'package.json gained the sync-skills postinstall',
    pkg.scripts && pkg.scripts.postinstall === 'ng g @open-rlb/ng-bootstrap:sync-skills',
    `got: ${JSON.stringify(pkg.scripts)}`,
  );

  check(
    '@angular/cdk follows the app’s Angular major',
    pkg.dependencies && pkg.dependencies['@angular/cdk'] === '^21.0.0',
    `got: ${pkg.dependencies && pkg.dependencies['@angular/cdk']}`,
  );

  check(
    'manifest written to .claude/skills/.rlb-skills.json',
    result.files.includes('/.claude/skills/.rlb-skills.json'),
  );
  if (result.files.includes('/.claude/skills/.rlb-skills.json')) {
    const manifest = JSON.parse(result.readContent('/.claude/skills/.rlb-skills.json'));
    check(
      'manifest lists every bundled skill',
      JSON.stringify(manifest.skills) === JSON.stringify(bundledSkills),
      `expected ${JSON.stringify(bundledSkills)}, got ${JSON.stringify(manifest.skills)}`,
    );
    check('manifest records the package name', manifest.package === '@open-rlb/ng-bootstrap');
  }

  check(
    'every bundled skill has a SKILL.md in the tree',
    bundledSkills.every(name => result.files.includes(`/.claude/skills/${name}/SKILL.md`)),
  );
}

async function testSyncSkillsPrunes() {
  console.log('\n=== sync-skills prunes stale library skills, spares hand-written ones ===');
  const runner = new SchematicTestRunner('open-rlb', collection);
  const tree = appTree({ name: 'demo', version: '0.0.0', dependencies: {}, devDependencies: {} });

  // A previous sync of an older library version: it owned one skill that no longer ships.
  tree.create(
    '/.claude/skills/.rlb-skills.json',
    JSON.stringify(
      {
        package: '@open-rlb/ng-bootstrap',
        version: '0.0.1',
        skills: [...bundledSkills, 'rlb-retired'],
      },
      null,
      2,
    ),
  );
  tree.create('/.claude/skills/rlb-retired/SKILL.md', '# retired');
  tree.create('/.claude/skills/rlb-retired/references/notes.md', 'stale');
  // Authored in the consumer, never listed in the manifest — must survive.
  tree.create('/.claude/skills/my-own-skill/SKILL.md', '# mine');
  // A stale copy of a skill that IS still shipped — must be overwritten.
  tree.create(`/.claude/skills/${bundledSkills[0]}/SKILL.md`, 'outdated content');

  const result = await runner.runSchematic('sync-skills', {}, tree);

  console.log('\n--- .claude/skills after sync ---');
  console.log(result.files.filter(f => f.startsWith('/.claude/skills')).join('\n') || '(none)');

  console.log('\n--- assertions ---');
  check(
    'retired skill pruned',
    !result.files.some(f => f.startsWith('/.claude/skills/rlb-retired/')),
    result.files.filter(f => f.startsWith('/.claude/skills/rlb-retired/')).join(', '),
  );
  check(
    'hand-written skill survived',
    result.files.includes('/.claude/skills/my-own-skill/SKILL.md'),
  );
  check(
    'stale copy of a shipped skill was overwritten',
    result.readContent(`/.claude/skills/${bundledSkills[0]}/SKILL.md`) !== 'outdated content',
  );

  const manifest = JSON.parse(result.readContent('/.claude/skills/.rlb-skills.json'));
  check(
    'manifest no longer lists the retired skill',
    JSON.stringify(manifest.skills) === JSON.stringify(bundledSkills),
    `got ${JSON.stringify(manifest.skills)}`,
  );
}

async function testSyncSkillsRespectsSkipEnv() {
  console.log('\n=== sync-skills honours RLB_SKIP_SKILL_SYNC ===');
  const runner = new SchematicTestRunner('open-rlb', collection);
  const tree = appTree({ name: 'demo', version: '0.0.0', dependencies: {}, devDependencies: {} });

  process.env.RLB_SKIP_SKILL_SYNC = '1';
  try {
    const result = await runner.runSchematic('sync-skills', {}, tree);
    check(
      'nothing written to .claude/skills',
      !result.files.some(f => f.startsWith('/.claude/skills')),
    );
  } finally {
    delete process.env.RLB_SKIP_SKILL_SYNC;
  }
}

/**
 * A hardcoded `@angular/cdk` pin is what broke `ng add` once the peerDependencies moved to a
 * new Angular major: npm then had to satisfy a CDK major the library itself rejects.
 */
async function testCdkTracksAngularMajor() {
  console.log('\n=== ng-add pins @angular/cdk to the app’s Angular major ===');

  const cases = [
    { label: 'Angular 21 app', deps: { '@angular/core': '^21.1.2' }, expected: '^21.0.0' },
    { label: 'Angular 22 app', deps: { '@angular/core': '^22.1.3' }, expected: '^22.0.0' },
    { label: 'exact version, no range', deps: { '@angular/core': '22.0.1' }, expected: '^22.0.0' },
    { label: 'no @angular/core (fallback)', deps: {}, expected: '^22.0.0' },
  ];

  for (const testCase of cases) {
    const runner = new SchematicTestRunner('open-rlb', collection);
    const tree = appTree({
      name: 'demo',
      version: '0.0.0',
      dependencies: testCase.deps,
      devDependencies: {},
    });
    const result = await runner.runSchematic(
      'ng-add',
      { project: 'demo', skipSkills: true, skipStarter: true },
      tree,
    );
    const cdk = JSON.parse(result.readContent('/package.json')).dependencies['@angular/cdk'];
    check(`${testCase.label} → ${testCase.expected}`, cdk === testCase.expected, `got: ${cdk}`);
  }
}

(async () => {
  console.log(`Bundled skills: ${bundledSkills.join(', ')}`);
  await testNgAdd();
  await testCdkTracksAngularMajor();
  await testSyncSkillsPrunes();
  await testSyncSkillsRespectsSkipEnv();

  if (failures > 0) {
    console.error(`\n✗ ${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\n✓ All schematic assertions passed.');
})().catch(err => {
  console.error('SCHEMATIC FAILED:\n', err);
  process.exit(1);
});
