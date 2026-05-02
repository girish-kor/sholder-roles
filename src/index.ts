export type {
  RoleId,
  RoleInput,
  RoleOutput,
  RoleMetadata,
  RoleAgent,
  LifecycleHooks,
  LifecyclePhase,
  ExecutionStatus,
  ExecutionNode,
  ExecutionGraph,
  ExecutionPlan,
  ExecutionReport,
  OrchestratorConfig,
  RegistryEntry,
} from './types/index.js';

export { BaseRoleAgent } from './core/index.js';

export {
  CEOAgent,
  CTOAgent,
  CFOAgent,
  COOAgent,
  CMOAgent,
  AEOAgent,
  ArchitectAgent,
  PlannerAgent,
  AnalystAgent,
  ReviewerAgent,
  ExecutorAgent,
  createDefaultAgents,
} from './roles/index.js';

export { RoleRegistry } from './registry/index.js';
export { ExecutionEngine } from './engine/index.js';
export { Orchestrator } from './orchestrator/index.js';
export { RoleRuntime } from './runtime/index.js';

export {
  generateTraceId,
  mergeContext,
  RoleError,
  OrchestrationError,
  CyclicDependencyError,
} from './utils/index.js';
