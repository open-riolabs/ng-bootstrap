import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addDependency,
  addRootProvider,
  DependencyType,
  readWorkspace,
  updateWorkspace,
} from '@schematics/angular/utility';
import { Schema } from './schema';

/**
 * Dependencies the library needs at the consumer side. `@angular/{core,common,forms,router}`
 * and `rxjs` are intentionally omitted: every Angular app already provides them.
 */
const DEPENDENCIES: ReadonlyArray<{ name: string; version: string; type: DependencyType }> = [
  { name: '@open-rlb/date-tz', version: '^2.1.1', type: DependencyType.Default },
  { name: '@ngx-translate/core', version: '^16.0.0', type: DependencyType.Default },
  { name: '@angular/cdk', version: '^21.0.0', type: DependencyType.Default },
  { name: 'bootstrap', version: '^5.3.0', type: DependencyType.Default },
  { name: 'bootstrap-icons', version: '^1.11.0', type: DependencyType.Default },
  { name: '@types/bootstrap', version: '^5.2.0', type: DependencyType.Dev },
];

/** Global styles required for the Bootstrap look & feel. */
const STYLE_PATHS: ReadonlyArray<string> = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/bootstrap-icons/font/bootstrap-icons.css',
];

export function ngAdd(options: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const project = await resolveProject(tree, options.project);

    return chain([
      // 1. Install dependencies (a single npm install is scheduled automatically).
      ...DEPENDENCIES.map(dep => addDependency(dep.name, dep.version, { type: dep.type })),
      // 2. Register Bootstrap + Bootstrap Icons global styles in angular.json.
      addBootstrapStyles(project),
      // 3. Wire up the library providers (modals/toasts registry, etc.).
      addRootProvider(project, ({ code, external }) =>
        code`${external('provideRlbBootstrap', '@open-rlb/ng-bootstrap')}()`,
      ),
      // 4. Optionally scaffold a starter component.
      options.skipStarter ? noop : scaffoldStarter(tree, project),
      // 5. Print next steps.
      logNextSteps(project, options.skipStarter),
    ]);
  };
}

/** Resolves the target project: the provided name, else the first application, else the first project. */
async function resolveProject(tree: Tree, name?: string): Promise<string> {
  const workspace = await readWorkspace(tree);

  if (name) {
    if (!workspace.projects.has(name)) {
      throw new SchematicsException(`Project "${name}" was not found in the workspace.`);
    }
    return name;
  }

  for (const [projectName, project] of workspace.projects) {
    if (project.extensions['projectType'] === 'application') {
      return projectName;
    }
  }

  const first = workspace.projects.keys().next().value;
  if (!first) {
    throw new SchematicsException('No project found in the workspace to add @open-rlb/ng-bootstrap to.');
  }
  return first;
}

function addBootstrapStyles(project: string): Rule {
  return updateWorkspace(workspace => {
    const target = workspace.projects.get(project)?.targets.get('build');
    if (!target) {
      return;
    }
    target.options ??= {};
    const styles = (target.options['styles'] as Array<string | { input: string }>) ?? [];

    for (const style of STYLE_PATHS) {
      const present = styles.some(s => (typeof s === 'string' ? s : s.input) === style);
      if (!present) {
        styles.unshift(style);
      }
    }
    target.options['styles'] = styles;
  });
}

function scaffoldStarter(tree: Tree, project: string): Rule {
  return async () => {
    const workspace = await readWorkspace(tree);
    const def = workspace.projects.get(project);
    const sourceRoot = def?.sourceRoot ?? (def ? `${def.root}/src` : 'src');

    const templates = apply(url('./files'), [
      applyTemplates({ ...strings }),
      move(`${sourceRoot}/app/rlb-starter`),
    ]);

    // Skip silently if the files already exist (idempotent re-runs).
    return mergeWith(templates, MergeStrategy.Default);
  };
}

function logNextSteps(project: string, skipStarter?: boolean): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const log = context.logger;
    log.info('');
    log.info('✅ @open-rlb/ng-bootstrap added successfully.');
    log.info(`   • Dependencies installed and added to package.json`);
    log.info(`   • Bootstrap + Bootstrap Icons styles registered in angular.json`);
    log.info(`   • provideRlbBootstrap() wired into the "${project}" app providers`);
    if (!skipStarter) {
      log.info('   • Starter component generated at src/app/rlb-starter/');
      log.info('     Render it to verify the setup, e.g. add <app-rlb-starter /> to a template.');
    }
    log.info('');
  };
}

/** A no-op rule. */
const noop: Rule = tree => tree;
