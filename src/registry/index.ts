import type { RoleAgent, RoleId, RegistryEntry } from '../types/index.js';
import { RoleError } from '../utils/index.js';

export class RoleRegistry {
  private readonly entries = new Map<RoleId, RegistryEntry>();

  register(agent: RoleAgent): void {
    if (this.entries.has(agent.metadata.id)) {
      throw new RoleError(
        `Agent already registered: ${agent.metadata.id}`,
        agent.metadata.id,
        'register',
      );
    }
    this.entries.set(agent.metadata.id, {
      agent,
      registeredAt: Date.now(),
    });
  }

  get(id: RoleId): RoleAgent {
    const entry = this.entries.get(id);
    if (!entry) {
      throw new RoleError(`Agent not found: ${id}`, id, 'lookup');
    }
    return entry.agent;
  }

  has(id: RoleId): boolean {
    return this.entries.has(id);
  }

  getAll(): ReadonlyMap<RoleId, RegistryEntry> {
    return this.entries;
  }

  unregister(id: RoleId): void {
    this.entries.delete(id);
  }

  clear(): void {
    this.entries.clear();
  }

  size(): number {
    return this.entries.size;
  }
}
