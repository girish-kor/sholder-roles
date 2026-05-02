import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionEngine } from '../src/engine/index.js';
import { RoleRegistry } from '../src/registry/index.js';
import { createDefaultAgents } from '../src/roles/index.js';

function buildRegistry(): RoleRegistry {
  const registry = new RoleRegistry();
  for (const agent of createDefaultAgents().values()) {
    registry.register(agent);
  }
  return registry;
}

describe('ExecutionEngine', () => {
  let engine: ExecutionEngine;

  beforeEach(() => {
    engine = new ExecutionEngine(buildRegistry());
  });

  it('builds graph with correct node count', () => {
    const graph = engine.buildGraph(['CEO'], { context: {}, params: {} });
    expect(graph.nodes.size).toBe(1);
    expect(graph.order).toContain('CEO');
  });

  it('resolves transitive dependencies', () => {
    const graph = engine.buildGraph(['COO'], { context: {}, params: {} });
    expect(graph.nodes.has('CEO')).toBe(true);
    expect(graph.nodes.has('CFO')).toBe(true);
    expect(graph.nodes.has('COO')).toBe(true);
  });

  it('builds plan with correct stages', () => {
    const graph = engine.buildGraph(['CTO'], { context: {}, params: {} });
    const plan = engine.buildPlan(graph);
    expect(plan.stages.length).toBeGreaterThan(0);
    expect(plan.stages[0]).toContain('CEO');
  });

  it('builds full plan for all roles', () => {
    const allIds = [
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
    ] as const;
    const graph = engine.buildGraph(allIds, { context: {}, params: {} });
    const plan = engine.buildPlan(graph);
    expect(plan.totalNodes).toBe(11);
    expect(plan.stages.length).toBeGreaterThan(0);
  });

  it('ensures CEO is in first stage of full plan', () => {
    const allIds = [
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
    ] as const;
    const graph = engine.buildGraph(allIds, { context: {}, params: {} });
    const plan = engine.buildPlan(graph);
    expect(plan.stages[0]).toContain('CEO');
  });

  it('ensures Executor is in last stage', () => {
    const allIds = [
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
    ] as const;
    const graph = engine.buildGraph(allIds, { context: {}, params: {} });
    const plan = engine.buildPlan(graph);
    const lastStage = plan.stages[plan.stages.length - 1];
    expect(lastStage).toContain('Executor');
  });
});
