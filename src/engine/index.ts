import type {
  RoleId,
  ExecutionGraph,
  ExecutionNode,
  ExecutionPlan,
  RoleInput,
} from '../types/index.js';
import { CyclicDependencyError, OrchestrationError, generateTraceId } from '../utils/index.js';
import type { RoleRegistry } from '../registry/index.js';

export class ExecutionEngine {
  constructor(private readonly registry: RoleRegistry) {}

  buildGraph(
    roleIds: readonly RoleId[],
    baseInput: Readonly<Pick<RoleInput, 'context' | 'params'>>,
    traceId: string = generateTraceId(),
  ): ExecutionGraph {
    const nodes = new Map<RoleId, ExecutionNode>();
    const resolved = new Set<RoleId>();
    const visiting = new Set<RoleId>();

    const resolve = (id: RoleId, path: RoleId[]): void => {
      if (resolved.has(id)) return;
      if (visiting.has(id)) {
        throw new CyclicDependencyError([...path, id]);
      }
      visiting.add(id);
      const agent = this.registry.get(id);
      for (const dep of agent.metadata.dependencies) {
        resolve(dep, [...path, id]);
      }
      visiting.delete(id);
      resolved.add(id);
      nodes.set(id, {
        roleId: id,
        input: { ...baseInput, timestamp: Date.now(), traceId },
        dependsOn: agent.metadata.dependencies.slice(),
        status: 'pending',
      });
    };

    for (const id of roleIds) {
      resolve(id, []);
    }

    const order = Array.from(resolved);
    return { traceId, nodes, order };
  }

  buildPlan(graph: ExecutionGraph): ExecutionPlan {
    const stages: RoleId[][] = [];
    const completed = new Set<RoleId>();
    const remaining = new Set<RoleId>(graph.order);

    while (remaining.size > 0) {
      const stage: RoleId[] = [];
      for (const id of remaining) {
        const node = graph.nodes.get(id);
        if (!node) continue;
        const ready = node.dependsOn.every((dep) => completed.has(dep));
        if (ready) stage.push(id);
      }
      if (stage.length === 0) {
        throw new OrchestrationError('Deadlock detected in execution graph', graph.traceId);
      }
      stage.sort();
      stages.push(stage);
      for (const id of stage) {
        completed.add(id);
        remaining.delete(id);
      }
    }

    return {
      traceId: graph.traceId,
      stages,
      totalNodes: graph.nodes.size,
      estimatedDurationMs: stages.length * 50,
    };
  }
}
