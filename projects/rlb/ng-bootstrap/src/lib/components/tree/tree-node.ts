/** One node of an `rlb-tree`. Plain data: the tree owns no state of its own. */
export interface RlbTreeNode {
  /** Unique across the whole tree: expansion and selection are remembered by it. */
  id: string;
  label: string;
  icon?: string;
  children?: RlbTreeNode[];
  disabled?: boolean;
}

/** Every node of the tree, depth first, parents before their children. */
export function flattenTree(nodes: readonly RlbTreeNode[]): RlbTreeNode[] {
  const out: RlbTreeNode[] = [];
  const walk = (list: readonly RlbTreeNode[]) => {
    for (const node of list) {
      out.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

/** The ids of `node` and everything under it. */
export function subtreeIds(node: RlbTreeNode): string[] {
  return flattenTree([node]).map(child => child.id);
}

/**
 * The ids on the path from the root down to every node matching `query`, so a search can open the
 * branches that lead to a hit instead of hiding it inside a closed one.
 */
export function idsMatching(
  nodes: readonly RlbTreeNode[],
  matches: (node: RlbTreeNode) => boolean,
): { hits: Set<string>; open: Set<string> } {
  const hits = new Set<string>();
  const open = new Set<string>();

  const walk = (list: readonly RlbTreeNode[], ancestors: string[]): boolean => {
    let any = false;
    for (const node of list) {
      const self = matches(node);
      const below = node.children?.length ? walk(node.children, [...ancestors, node.id]) : false;
      if (self || below) {
        hits.add(node.id);
        ancestors.forEach(id => open.add(id));
        if (below) open.add(node.id);
        any = true;
      }
    }
    return any;
  };

  walk(nodes, []);
  return { hits, open };
}
