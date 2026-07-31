/** Options for the `ng generate @open-rlb/ng-bootstrap:sync-skills` schematic. */
export interface Schema {
  /**
   * When false, skills that the library used to ship but no longer does are left in place
   * instead of being deleted. Skills authored in the consumer are never pruned either way.
   */
  prune?: boolean;
}
