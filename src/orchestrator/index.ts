import type {
  RoleId,
  RoleInput,
  RoleOutput,
  ExecutionReport,
  OrchestratorConfig,
  ExecutionStatus,
} from '../types/index.js';
import { generateTraceId, elapsed, mergeContext, OrchestrationError } from '../utils/index.js';
import type { RoleRegistry } from '../registry/index.js';
import { ExecutionEngine } from '../engine/index.js';

const DEFAULT_CONFIG: Readonly<OrchestratorConfig> = {
  maxConcurrency: 4,
  timeoutMs: 30000,
  retryLimit: 0,
  strict: true,
};

export class Orchestrator {
  private readonly engine: ExecutionEngine;
  private readonly config: Readonly<OrchestratorConfig>;

  constructor(
    private readonly registry: RoleRegistry,
    config: Partial<OrchestratorConfig> = {},
  ) {
    this.engine = new ExecutionEngine(registry);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async run(
    roleIds: readonly RoleId[],
    initialInput: Readonly<Pick<RoleInput, 'context' | 'params'>>,
    traceId: string = generateTraceId(),
  ): Promise<ExecutionReport> {
    const start = Date.now();
    const graph = this.engine.buildGraph(roleIds, initialInput, traceId);
    const plan = this.engine.buildPlan(graph);
    const outputs = new Map<RoleId, RoleOutput>();
    let accumulated = { ...initialInput.context };

    for (const stage of plan.stages) {
      const batch = stage.slice(0, this.config.maxConcurrency);
      const results = await Promise.allSettled(
        batch.map(async (id) => {
          const agent = this.registry.get(id);
          const input: RoleInput = {
            context: Object.freeze({ ...accumulated }),
            params: initialInput.params,
            timestamp: Date.now(),
            traceId,
          };
          const output = await Promise.race([
            agent.execute(input),
            this.timeout(this.config.timeoutMs, id, traceId),
          ]);
          return { id, output };
        }),
      );

      for (const result of results) {
        if (result.status === 'rejected') {
          if (this.config.strict) {
            throw new OrchestrationError(String(result.reason), traceId);
          }
          continue;
        }
        const { id, output } = result.value;
        outputs.set(id, output);
        accumulated = mergeContext(accumulated, output.result);
      }
    }

    const status: ExecutionStatus = outputs.size === graph.nodes.size ? 'completed' : 'failed';

    return {
      traceId,
      plan,
      outputs,
      status,
      totalDurationMs: elapsed(start),
      timestamp: Date.now(),
    };
  }

  private timeout(ms: number, roleId: RoleId, traceId: string): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => {
        reject(new OrchestrationError(`Role ${roleId} timed out after ${String(ms)}ms`, traceId));
      }, ms),
    );
  }
}
