/** Options for the `ng add @open-rlb/ng-bootstrap` schematic. */
export interface Schema {
  /** The name of the project to add the library to. Defaults to the workspace's default/first app. */
  project?: string;
  /** When true, the starter example component is not generated. */
  skipStarter?: boolean;
}
