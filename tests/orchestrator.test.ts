import { describe, it, expect, beforeEach } from 'vitest';
import { Orchestrator } from '../src/orchestrator/index.js';
import { RoleRegistry } from '../src/registry/index.js';
import { createDefaultAgents } from '../src/roles/index.js';

function buildRegistry(): RoleRegistry {
  const registry = new RoleRegistry();
  for (const agent of createDefaultAgents().values()) {
    registry.register(agent);
  }
  return registry;
}

describe('Orchestrator', () => {
  let orchestrator: Orchestrator;

  beforeEach(() => {
    orchestrator = new Orchestrator(buildRegistry());
  });

  it('runs CEO alone', async () => {
    const report = await orchestrator.run(['CEO'], { context: {}, params: { vision: 'test' } });
    expect(report.status).toBe('completed');
    expect(report.outputs.has('CEO')).toBe(true);
  });

  it('runs CEO and CTO in order', async () => {
    const report = await orchestrator.run(['CEO', 'CTO'], { context: {}, params: {} });
    expect(report.status).toBe('completed');
    expect(report.outputs.size).toBe(2);
  });

  it('propagates context between stages', async () => {
    const report = await orchestrator.run(['CEO', 'CTO'], {
      context: {},
      params: { vision: 'alpha' },
    });
    const ctoOutput = report.outputs.get('CTO');
    expect(ctoOutput?.result['techRoadmap']).toContain('alpha');
  });

  it('runs all 11 roles end to end', async () => {
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
    const report = await orchestrator.run(allIds, {
      context: {},
      params: { vision: 'enterprise', budget: 5000000 },
    });
    expect(report.status).toBe('completed');
    expect(report.outputs.size).toBe(11);
    expect(report.totalDurationMs).toBeGreaterThanOrEqual(0);
  });

  it('returns consistent traceId', async () => {
    const report = await orchestrator.run(['CEO'], { context: {}, params: {} }, 'fixed-trace');
    expect(report.traceId).toBe('fixed-trace');
    expect(report.outputs.get('CEO')?.traceId).toBe('fixed-trace');
  });
});
