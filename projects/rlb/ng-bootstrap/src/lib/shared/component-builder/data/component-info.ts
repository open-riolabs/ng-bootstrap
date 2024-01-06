import { ComponentData } from './component-data';

export interface ComponentInfo<name = string, T = any>
  extends ComponentData<T> {
  name: name;
}
