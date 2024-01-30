import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractRegistryService<T extends Function> {
  protected registry: Map<string, T> = new Map();

  public get(name: string | null | undefined) {
    if (!name) return;
    const type = this.registry.get(name);
    if (!type) throw new Error(`Component ${name} not found in registry`);
    return type;
  }

  protected add(name: string, type: T,) {
    if (!type) throw new Error('Component type is required');
    if (!name) throw new Error('Component name is required');
    let _name: string = this.dasherizeString(name);
    this.registry.set(_name, type);
  }

  protected dasherizeName(type: Function) {
    let name: string = type?.prototype?.constructor?.name;
    name = name.startsWith('_') ? name.slice(1) : name;
    return this.dasherizeString(name);
  }

  protected dasherizeString(val: string): string {
    if (!val) '';
    return val.replace(
      /[A-Z]/g,
      (char, index) => (index !== 0 ? '-' : '') + char.toLowerCase(),
    );
  }
}
