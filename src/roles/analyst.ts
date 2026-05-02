import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class AnalystAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'Analyst',
    name: 'Data Analyst',
    version: '1.0.0',
    description: 'Produces data insights and validates metrics against KPIs',
    dependencies: ['Planner', 'CFO'],
    priority: 50,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const plan = (input.context['executionPlan'] as string | undefined) ?? 'default';
    const budget = (input.context['approvedBudget'] as number | undefined) ?? 0;
    return Promise.resolve(
      Object.freeze({
        analysisReport: `analysis-${plan}`,
        roi: budget > 0 ? ((budget * 3.2) / budget).toFixed(2) : '3.20',
        variance: 0.04,
        forecast: 'positive',
        dataPoints: 1024,
      }),
    );
  }
}
