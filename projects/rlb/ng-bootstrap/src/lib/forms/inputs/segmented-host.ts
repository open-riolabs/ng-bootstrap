/**
 * The slice of `rlb-segmented` an option talks to.
 *
 * An option is content the caller writes inside the group, so it reaches it through its element
 * injector rather than by importing it — the import check in this repo rejects cycles.
 */
export abstract class RlbSegmentedHost {
  abstract choose(option: unknown): void;
}
