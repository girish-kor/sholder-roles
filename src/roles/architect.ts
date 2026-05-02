import type { RoleMetadata, RoleInput } from '../types/index.js';
import { BaseRoleAgent } from '../core/index.js';

export class ArchitectAgent extends BaseRoleAgent {
  readonly metadata: Readonly<RoleMetadata> = {
    id: 'Architect',
    name: 'Systems Architect',
    version: '1.0.0',
    description: 'Designs system topology and enforces architectural constraints',
    dependencies: ['CTO', 'AEO'],
    priority: 70,
  };

  protected run(input: RoleInput): Promise<Readonly<Record<string, unknown>>> {
    const roadmap = (input.context['techRoadmap'] as string | undefined) ?? 'default';
    const pipeline = (input.context['agentPipeline'] as string | undefined) ?? 'default';
    return Promise.resolve(
      Object.freeze({
        systemDesign: `arch-${roadmap}`,
        topology: 'event-driven-microservices',
        pipelineArch: pipeline,
        patterns: ['CQRS', 'saga', 'circuit-breaker', 'bulkhead'],
        slaMs: 200,
      }),
    );
  }
}
