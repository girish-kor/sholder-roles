import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class CFOAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'CFO',
    name: 'Chief Financial Officer',
    version: '1.0.0',
    description: 'Manages financial strategy, budgets, and risk',
    dependencies: ['CEO'],
    priority: 90,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const budget = (input.params['budget'] as number | undefined) ?? 0;
    const strategy = (input.context['strategy'] as string | undefined) ?? 'default';
    return Promise.resolve(
      Object.freeze({
        approvedBudget: budget,
        fiscalStrategy: `fiscal-${strategy}`,
        riskTolerance: 'moderate',
        burnRateMonthly: Math.floor(budget / 12),
        runway: 24,
      }),
    );
  }
}
