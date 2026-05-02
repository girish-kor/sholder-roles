import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  generateTraceId,
  now,
  assertNever,
  deepFreeze,
  mergeContext,
  elapsed,
  RoleError,
  OrchestrationError,
  CyclicDependencyError,
} from '../src/utils/index.js';

describe('utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates trace id with expected format', () => {
    const id = generateTraceId();
    expect(id).toMatch(/^trace-[a-z0-9]+-[a-z0-9]+$/);
  });

  it('returns current timestamp', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    expect(now()).toBe(1234);
  });

  it('throws for assertNever', () => {
    expect(() => assertNever('x' as never)).toThrow('Unexpected value: x');
  });

  it('deep freezes nested objects', () => {
    const obj = { a: { b: 1 }, c: 2 };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.a)).toBe(true);
  });

  it('merges and freezes context', () => {
    const merged = mergeContext({ a: 1 }, { b: 2 });
    expect(merged).toEqual({ a: 1, b: 2 });
    expect(Object.isFrozen(merged)).toBe(true);
  });

  it('computes elapsed time', () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000);
    expect(elapsed(4500)).toBe(500);
  });

  it('creates RoleError with metadata', () => {
    const err = new RoleError('boom', 'CEO', 'execute');
    expect(err.name).toBe('RoleError');
    expect(err.message).toContain('[CEO][execute] boom');
    expect(err.roleId).toBe('CEO');
    expect(err.phase).toBe('execute');
  });

  it('creates OrchestrationError with trace id', () => {
    const err = new OrchestrationError('failed', 'trace-123');
    expect(err.name).toBe('OrchestrationError');
    expect(err.message).toContain('[orchestration][trace-123] failed');
    expect(err.traceId).toBe('trace-123');
  });

  it('creates CyclicDependencyError with cycle path', () => {
    const err = new CyclicDependencyError(['A', 'B', 'A']);
    expect(err.name).toBe('CyclicDependencyError');
    expect(err.message).toContain('A -> B -> A');
  });
});
