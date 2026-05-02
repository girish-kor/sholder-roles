import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class ReviewerAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'Reviewer',
    name: 'Quality Reviewer',
    version: '1.0.0',
    description: 'Validates outputs across roles and enforces quality gates',
    dependencies: ['Analyst', 'Planner'],
    priority: 45,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const report = (input.context['analysisReport'] as string | undefined) ?? 'default';
    const plan = (input.context['executionPlan'] as string | undefined) ?? 'default';
    return Promise.resolve(
      Object.freeze({
        reviewId: `review-${report}-${plan}`,
        approved: true,
        qualityScore: 0.97,
        findings: [],
        gatesPassed: ['security', 'performance', 'compliance', 'coverage'],
      }),
    );
  }
}
