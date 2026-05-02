import type { RoleId, RoleInput, ExecutionReport, OrchestratorConfig } from '../types/index.js';
import { RoleRegistry } from '../registry/index.js';
import { Orchestrator } from '../orchestrator/index.js';
import { createDefaultAgents } from '../roles/index.js';
import { generateTraceId } from '../utils/index.js';

export class RoleRuntime {
  readonly registry: RoleRegistry;
  private readonly orchestrator: Orchestrator;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.registry = new RoleRegistry();
    const agents = createDefaultAgents();
    for (const agent of agents.values()) {
      this.registry.register(agent);
    }
    this.orchestrator = new Orchestrator(this.registry, config);
  }

  async executeAll(
    input: Readonly<Pick<RoleInput, 'context' | 'params'>>,
    traceId: string = generateTraceId(),
  ): Promise<ExecutionReport> {
    const allIds: RoleId[] = [
      'CEO',
      'CTO',
      'CFO',
      'COO',
      'CMO',
      'AEO',
      'Architect',
      'Planner',
      'Analyst',
      'Reviewer',
      'Executor',
    ];
    return this.orchestrator.run(allIds, input, traceId);
  }

  async executeRoles(
    roleIds: readonly RoleId[],
    input: Readonly<Pick<RoleInput, 'context' | 'params'>>,
    traceId: string = generateTraceId(),
  ): Promise<ExecutionReport> {
    return this.orchestrator.run(roleIds, input, traceId);
  }
}
