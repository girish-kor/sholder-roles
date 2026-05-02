import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class CEOAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'CEO',
    name: 'Chief Executive Officer',
    version: '1.0.0',
    description: 'Sets strategic direction and approves enterprise decisions',
    dependencies: [],
    priority: 100,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const vision = (input.params['vision'] as string | undefined) ?? 'default-vision';
    const objectives = (input.params['objectives'] as string[] | undefined) ?? [];
    return Promise.resolve(
      Object.freeze({
        strategy: `strategic-plan-${vision}`,
        approved: true,
        objectives: objectives.slice(),
        mandate: 'enterprise-wide',
        quarter: Math.ceil((new Date().getMonth() + 1) / 3),
      }),
    );
  }
}
