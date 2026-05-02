import { describe, it, expect, beforeEach } from 'vitest';
import { RoleRegistry } from '../src/registry/index.js';
import { CEOAgent } from '../src/roles/ceo.js';
import { CTOAgent } from '../src/roles/cto.js';
import { RoleError } from '../src/utils/index.js';

describe('RoleRegistry', () => {
  let registry: RoleRegistry;

  beforeEach(() => {
    registry = new RoleRegistry();
  });

  it('registers and retrieves agents', () => {
    const ceo = new CEOAgent();
    registry.register(ceo);
    expect(registry.get('CEO')).toBe(ceo);
  });

  it('throws on duplicate registration', () => {
    registry.register(new CEOAgent());
    expect(() => {
      registry.register(new CEOAgent());
    }).toThrow(RoleError);
  });

  it('throws on missing agent', () => {
    expect(() => registry.get('CTO')).toThrow(RoleError);
  });

  it('reports size correctly', () => {
    registry.register(new CEOAgent());
    registry.register(new CTOAgent());
    expect(registry.size()).toBe(2);
  });

  it('clears all entries', () => {
    registry.register(new CEOAgent());
    registry.clear();
    expect(registry.size()).toBe(0);
  });

  it('unregisters individual agents', () => {
    registry.register(new CEOAgent());
    registry.unregister('CEO');
    expect(registry.has('CEO')).toBe(false);
  });
});
