import { describe, it, expect } from 'vitest';
import { CEOAgent } from '../src/roles/ceo.js';
import { CTOAgent } from '../src/roles/cto.js';
import { CFOAgent } from '../src/roles/cfo.js';
import { COOAgent } from '../src/roles/coo.js';
import { CMOAgent } from '../src/roles/cmo.js';
import { AEOAgent } from '../src/roles/aeo.js';
import { ArchitectAgent } from '../src/roles/architect.js';
import { PlannerAgent } from '../src/roles/planner.js';
import { AnalystAgent } from '../src/roles/analyst.js';
import { ReviewerAgent } from '../src/roles/reviewer.js';
import { ExecutorAgent } from '../src/roles/executor.js';
import type { RoleInput } from '../src/types/index.js';

function makeInput(overrides: Partial<RoleInput> = {}): RoleInput {
  return {
    context: {},
    params: {},
    timestamp: Date.now(),
    traceId: 'test-trace-001',
    ...overrides,
  };
}

describe('CEOAgent', () => {
  it('has correct metadata', () => {
    const agent = new CEOAgent();
    expect(agent.metadata.id).toBe('CEO');
    expect(agent.metadata.dependencies).toEqual([]);
    expect(agent.metadata.priority).toBe(100);
  });

  it('executes and returns strategy', async () => {
    const agent = new CEOAgent();
    const output = await agent.execute(
      makeInput({ params: { vision: 'growth', objectives: ['revenue'] } }),
    );
    expect(output.roleId).toBe('CEO');
    expect(output.status).toBe('completed');
    expect(output.result['strategy']).toContain('growth');
    expect(output.result['approved']).toBe(true);
  });

  it('validates output correctly', async () => {
    const agent = new CEOAgent();
    const output = await agent.execute(makeInput());
    const valid = await agent.validate(output);
    expect(valid).toBe(true);
  });
});

describe('CTOAgent', () => {
  it('has CEO as dependency', () => {
    const agent = new CTOAgent();
    expect(agent.metadata.dependencies).toContain('CEO');
  });

  it('produces techRoadmap in output', async () => {
    const agent = new CTOAgent();
    const output = await agent.execute(makeInput({ context: { strategy: 'scale' } }));
    expect(output.result['techRoadmap']).toContain('scale');
    expect(Array.isArray(output.result['stack'])).toBe(true);
  });
});

describe('CFOAgent', () => {
  it('calculates burn rate from budget', async () => {
    const agent = new CFOAgent();
    const output = await agent.execute(makeInput({ params: { budget: 1200000 } }));
    expect(output.result['burnRateMonthly']).toBe(100000);
    expect(output.result['approvedBudget']).toBe(1200000);
  });
});

describe('COOAgent', () => {
  it('depends on CEO and CFO', () => {
    const agent = new COOAgent();
    expect(agent.metadata.dependencies).toContain('CEO');
    expect(agent.metadata.dependencies).toContain('CFO');
  });

  it('returns headcount proportional to budget', async () => {
    const agent = new COOAgent();
    const output = await agent.execute(makeInput({ context: { approvedBudget: 500000 } }));
    expect(output.result['headcount']).toBe(5);
  });
});

describe('CMOAgent', () => {
  it('returns channel array', async () => {
    const agent = new CMOAgent();
    const output = await agent.execute(makeInput({ params: { segment: 'smb' } }));
    expect(output.result['targetSegment']).toBe('smb');
    expect(Array.isArray(output.result['channels'])).toBe(true);
  });
});

describe('AEOAgent', () => {
  it('depends on CTO and COO', () => {
    const agent = new AEOAgent();
    expect(agent.metadata.dependencies).toContain('CTO');
    expect(agent.metadata.dependencies).toContain('COO');
  });

  it('returns agentCount of 11', async () => {
    const agent = new AEOAgent();
    const output = await agent.execute(makeInput());
    expect(output.result['agentCount']).toBe(11);
  });
});

describe('ArchitectAgent', () => {
  it('returns patterns array', async () => {
    const agent = new ArchitectAgent();
    const output = await agent.execute(makeInput());
    expect(Array.isArray(output.result['patterns'])).toBe(true);
    expect((output.result['patterns'] as string[]).length).toBeGreaterThan(0);
  });
});

describe('PlannerAgent', () => {
  it('returns phases array', async () => {
    const agent = new PlannerAgent();
    const output = await agent.execute(makeInput());
    expect(Array.isArray(output.result['phases'])).toBe(true);
    expect((output.result['phases'] as string[]).includes('init')).toBe(true);
  });
});

describe('AnalystAgent', () => {
  it('returns roi as string', async () => {
    const agent = new AnalystAgent();
    const output = await agent.execute(makeInput({ context: { approvedBudget: 1000000 } }));
    expect(typeof output.result['roi']).toBe('string');
    expect(output.result['forecast']).toBe('positive');
  });
});

describe('ReviewerAgent', () => {
  it('returns approved true', async () => {
    const agent = new ReviewerAgent();
    const output = await agent.execute(makeInput());
    expect(output.result['approved']).toBe(true);
    expect(output.result['qualityScore'] as number).toBeGreaterThan(0.9);
  });
});

describe('ExecutorAgent', () => {
  it('returns deployed true', async () => {
    const agent = new ExecutorAgent();
    const output = await agent.execute(makeInput());
    expect(output.result['deployed']).toBe(true);
    expect(typeof output.result['executionId']).toBe('string');
  });
});
