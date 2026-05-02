import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class PlannerAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'Planner',
    name: 'Execution Planner',
    version: '1.0.0',
    description: 'Generates deterministic execution plans from architecture specs',
    dependencies: ['Architect', 'COO'],
    priority: 60,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const design = (input.context['systemDesign'] as string | undefined) ?? 'default';
    const model = (input.context['operatingModel'] as string | undefined) ?? 'default';
    return Promise.resolve(
      Object.freeze({
        executionPlan: `plan-${design}-${model}`,
        phases: ['init', 'deploy', 'verify', 'operate'],
        sprintCount: 6,
        milestones: ['alpha', 'beta', 'rc', 'ga'],
        criticalPath: ['Architect', 'Executor'],
      }),
    );
  }
}
