import type { RoleAgent, RoleInput, RoleOutput, RoleMetadata } from '../types/index.js';
import { elapsed, RoleError } from '../utils/index.js';

export abstract class BaseRoleAgent implements RoleAgent {
  abstract readonly metadata: Readonly<RoleMetadata>;

  init(input: RoleInput): Promise<void> {
    if (!input.traceId || !input.timestamp) {
      throw new RoleError('Invalid input: missing traceId or timestamp', this.metadata.id, 'init');
    }
    return Promise.resolve();
  }

  async execute(input: RoleInput): Promise<RoleOutput> {
    const start = Date.now();
    await this.init(input);
    const result = await this.run(input);
    const output: RoleOutput = {
      roleId: this.metadata.id,
      result,
      status: 'completed',
      durationMs: elapsed(start),
      timestamp: Date.now(),
      traceId: input.traceId,
    };
    const valid = await this.validate(output);
    if (!valid) {
      throw new RoleError('Validation failed', this.metadata.id, 'validate');
    }
    return output;
  }

  validate(output: RoleOutput): Promise<boolean> {
    return Promise.resolve(
      output.roleId === this.metadata.id &&
        output.status === 'completed' &&
        typeof output.durationMs === 'number' &&
        output.durationMs >= 0,
    );
  }

  protected abstract run(input: RoleInput): Promise<Readonly<Record<string, unknown>>>;
}
