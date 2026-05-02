export function generateTraceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `trace-${timestamp}-${random}`;
}

export function now(): number {
  return Date.now();
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((name) => {
    const val = (obj as Record<string, unknown>)[name];
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });
  return obj;
}

export function mergeContext(
  base: Readonly<Record<string, unknown>>,
  additions: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  return Object.freeze({ ...base, ...additions });
}

export function elapsed(startMs: number): number {
  return Date.now() - startMs;
}

export class RoleError extends Error {
  constructor(
    message: string,
    public readonly roleId: string,
    public readonly phase: string,
  ) {
    super(`[${roleId}][${phase}] ${message}`);
    this.name = 'RoleError';
  }
}

export class OrchestrationError extends Error {
  constructor(
    message: string,
    public readonly traceId: string,
  ) {
    super(`[orchestration][${traceId}] ${message}`);
    this.name = 'OrchestrationError';
  }
}

export class CyclicDependencyError extends Error {
  constructor(cycle: readonly string[]) {
    super(`Cyclic dependency detected: ${cycle.join(' -> ')}`);
    this.name = 'CyclicDependencyError';
  }
}
