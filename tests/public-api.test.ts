import { describe, it, expect } from 'vitest';
import {
  BaseRoleAgent,
  CEOAgent,
  RoleRegistry,
  ExecutionEngine,
  Orchestrator,
  RoleRuntime,
  generateTraceId,
  mergeContext,
  RoleError,
  OrchestrationError,
  CyclicDependencyError,
} from '../src/index.js';

describe('public api', () => {
  it('exports main classes and helpers', () => {
    expect(BaseRoleAgent).toBeDefined();
    expect(CEOAgent).toBeDefined();
    expect(RoleRegistry).toBeDefined();
    expect(ExecutionEngine).toBeDefined();
    expect(Orchestrator).toBeDefined();
    expect(RoleRuntime).toBeDefined();
    expect(typeof generateTraceId).toBe('function');
    expect(typeof mergeContext).toBe('function');
    expect(RoleError).toBeDefined();
    expect(OrchestrationError).toBeDefined();
    expect(CyclicDependencyError).toBeDefined();
  });
});
