import { describe, it, expect } from 'vitest';
import { RoleRuntime } from '../src/runtime/index.js';

describe('RoleRuntime', () => {
  it('initializes with all 11 agents', () => {
    const runtime = new RoleRuntime();
    expect(runtime.registry.size()).toBe(11);
  });

  it('executes all roles', async () => {
    const runtime = new RoleRuntime();
    const report = await runtime.executeAll({
      context: {},
      params: { vision: 'production', budget: 10000000 },
    });
    expect(report.status).toBe('completed');
    expect(report.outputs.size).toBe(11);
  });

  it('executes subset of roles', async () => {
    const runtime = new RoleRuntime();
    const report = await runtime.executeRoles(['CEO', 'CFO'], {
      context: {},
      params: { budget: 500000 },
    });
    expect(report.status).toBe('completed');
    expect(report.outputs.size).toBe(2);
  });

  it('executor output contains deployed=true after full run', async () => {
    const runtime = new RoleRuntime();
    const report = await runtime.executeAll({ context: {}, params: {} });
    const exec = report.outputs.get('Executor');
    expect(exec?.result['deployed']).toBe(true);
  });
});
