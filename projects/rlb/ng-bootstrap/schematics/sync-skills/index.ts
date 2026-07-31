import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { isObservable, firstValueFrom } from 'rxjs';
import { Schema } from './schema';

/** Where the consumer's Claude skills live. */
const SKILLS_ROOT = '/.claude/skills';

/**
 * Records which skill folders this library owns, so a later sync can delete the ones it no
 * longer ships without touching skills the consumer wrote themselves.
 */
const MANIFEST_PATH = `${SKILLS_ROOT}/.rlb-skills.json`;

/** Set this in CI if a pipeline asserts a clean working tree after `npm install`. */
const SKIP_ENV_VAR = 'RLB_SKIP_SKILL_SYNC';

const PACKAGE_NAME = '@open-rlb/ng-bootstrap';

interface Manifest {
  package: string;
  version: string;
  skills: string[];
}

/**
 * Copies the Claude skills bundled with the *installed* version of the library into the
 * consumer's `.claude/skills`. Safe to re-run: it is how consumers pick up skill changes after
 * `npm update`, typically from their own `postinstall` script.
 */
export function syncSkills(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    if (process.env[SKIP_ENV_VAR]) {
      context.logger.info(`• ${SKIP_ENV_VAR} is set — skipping Claude skill sync.`);
      return noop;
    }

    const bundled = await readBundledSkills(context);

    if (bundled.skills.length === 0) {
      context.logger.warn(
        `⚠ ${PACKAGE_NAME} shipped without Claude skills — nothing to sync. ` +
          'This usually means the package was built with a bare `ng build` instead of `npm run lib:build`.',
      );
      return noop;
    }

    const previous = readManifest(tree);
    // Only folders a previous sync claimed are ours to delete. Anything else in .claude/skills
    // was authored in the consumer and must survive.
    const stale =
      options.prune === false
        ? []
        : (previous?.skills ?? []).filter(name => !bundled.skills.includes(name));

    const added = bundled.files.filter(file => !tree.exists(join(SKILLS_ROOT, file.path)));
    const updated = bundled.files.filter(file => {
      const target = join(SKILLS_ROOT, file.path);
      const current = tree.read(target);
      return current !== null && !current.equals(file.content);
    });

    return chain([
      prune(stale),
      mergeWith(apply(url('./claude-skills'), [move(SKILLS_ROOT)]), MergeStrategy.Overwrite),
      writeManifest(bundled.skills),
      logSummary({ skills: bundled.skills, added: added.length, updated: updated.length, stale }),
    ]);
  };
}

/** Reads the skills packaged alongside this schematic (see scripts/build-schematics.mjs). */
async function readBundledSkills(
  context: SchematicContext,
): Promise<{ skills: string[]; files: Array<{ path: string; content: Buffer }> }> {
  const source = url('./claude-skills')(context);
  const bundledTree = isObservable(source) ? await firstValueFrom(source) : source;

  const skills = new Set<string>();
  const files: Array<{ path: string; content: Buffer }> = [];

  bundledTree.visit((path, entry) => {
    const folder = path.replace(/^\//, '').split('/')[0];
    if (folder) {
      skills.add(folder);
    }
    if (entry) {
      files.push({ path, content: entry.content });
    }
  });

  return { skills: [...skills].sort(), files };
}

function readManifest(tree: Tree): Manifest | null {
  const raw = tree.read(MANIFEST_PATH);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw.toString('utf-8')) as Partial<Manifest>;
    return Array.isArray(parsed.skills)
      ? { package: PACKAGE_NAME, version: '', ...parsed, skills: parsed.skills }
      : null;
  } catch {
    // A hand-mangled manifest must not abort the sync — treat it as "nothing owned yet".
    return null;
  }
}

/** Deletes every file under the named skill folders. */
function prune(stale: string[]): Rule {
  return (tree: Tree) => {
    for (const name of stale) {
      const dir = tree.getDir(join(SKILLS_ROOT, name));
      const paths: string[] = [];
      dir.visit(path => paths.push(path));
      paths.forEach(path => tree.delete(path));
    }
    return tree;
  };
}

function writeManifest(skills: string[]): Rule {
  return (tree: Tree) => {
    const manifest: Manifest = { package: PACKAGE_NAME, version: installedVersion(), skills };
    const content = JSON.stringify(manifest, null, 2) + '\n';

    if (tree.exists(MANIFEST_PATH)) {
      tree.overwrite(MANIFEST_PATH, content);
    } else {
      tree.create(MANIFEST_PATH, content);
    }
    return tree;
  };
}

/**
 * The version of the library these skills came from. Resolved from the package.json two levels
 * up from the compiled `schematics/sync-skills/index.js`, i.e. the installed package's own.
 */
function installedVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return (require('../../package.json') as { version?: string }).version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function logSummary(summary: {
  skills: string[];
  added: number;
  updated: number;
  stale: string[];
}): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const log = context.logger;
    log.info('');
    log.info(`✅ Claude skills synced from ${PACKAGE_NAME}@${installedVersion()}`);
    log.info(`   • ${summary.skills.length} skills: ${summary.skills.join(', ')}`);
    log.info(`   • ${summary.added} new file(s), ${summary.updated} updated`);
    if (summary.stale.length) {
      log.info(`   • pruned (no longer shipped): ${summary.stale.join(', ')}`);
    }
    log.info('');
  };
}

function join(base: string, path: string): string {
  return `${base}/${path}`.replace(/\/+/g, '/');
}

/** A no-op rule. */
const noop: Rule = tree => tree;
