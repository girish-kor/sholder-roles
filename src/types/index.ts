export type RoleId =
  | 'CEO'
  | 'CTO'
  | 'CFO'
  | 'COO'
  | 'CMO'
  | 'AEO'
  | 'Architect'
  | 'Planner'
  | 'Analyst'
  | 'Reviewer'
  | 'Executor';

export type LifecyclePhase = 'init' | 'execute' | 'validate';

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface RoleMetadata {
  readonly id: RoleId;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly dependencies: readonly RoleId[];
  readonly priority: number;
}

export interface RoleInput {
  readonly context: Readonly<Record<string, unknown>>;
  readonly params: Readonly<Record<string, unknown>>;
  readonly timestamp: number;
  readonly traceId: string;
}

export interface RoleOutput {
  readonly roleId: RoleId;
  readonly result: Readonly<Record<string, unknown>>;
  readonly status: ExecutionStatus;
  readonly durationMs: number;
  readonly timestamp: number;
  readonly traceId: string;
}

export interface LifecycleHooks {
  init(input: RoleInput): Promise<void>;
  execute(input: RoleInput): Promise<RoleOutput>;
  validate(output: RoleOutput): Promise<boolean>;
}

export interface RoleAgent extends LifecycleHooks {
  readonly metadata: Readonly<RoleMetadata>;
}

export interface ExecutionNode {
  readonly roleId: RoleId;
  readonly input: RoleInput;
  readonly dependsOn: readonly RoleId[];
  status: ExecutionStatus;
  output?: RoleOutput;
}

export interface ExecutionGraph {
  readonly traceId: string;
  readonly nodes: ReadonlyMap<RoleId, ExecutionNode>;
  readonly order: readonly RoleId[];
}

export interface OrchestratorConfig {
  readonly maxConcurrency: number;
  readonly timeoutMs: number;
  readonly retryLimit: number;
  readonly strict: boolean;
}

export interface ExecutionPlan {
  readonly traceId: string;
  readonly stages: readonly (readonly RoleId[])[];
  readonly totalNodes: number;
  readonly estimatedDurationMs: number;
}

export interface ExecutionReport {
  readonly traceId: string;
  readonly plan: ExecutionPlan;
  readonly outputs: ReadonlyMap<RoleId, RoleOutput>;
  readonly status: ExecutionStatus;
  readonly totalDurationMs: number;
  readonly timestamp: number;
}

export interface RegistryEntry {
  readonly agent: RoleAgent;
  readonly registeredAt: number;
}
