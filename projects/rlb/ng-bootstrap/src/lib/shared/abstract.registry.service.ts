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

  protected add(type: T, name?: string) {
    let _name;
    if (name) {
      _name = this.dasherizeString(name);
    } else {
      _name = this.dasherizeName(type);
    }
    if (!_name) return;
    this.registry.set(_name, type);
  }

  protected dasherizeName(type: Function) {
    let name: string = type?.prototype?.constructor?.name;
    name = name.startsWith('_') ? name.slice(1) : name;
    return this.dasherizeString(name);
  }

  protected dasherizeString(val: string) {
    if (!val) return;
    return val.replace(
      /[A-Z]/g,
      (char, index) => (index !== 0 ? '-' : '') + char.toLowerCase(),
    );
  }
}
