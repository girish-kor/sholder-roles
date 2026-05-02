# `@sholder/roles`

Enterprise role orchestration system. Defines, schedules, and executes CEO, CTO, CFO, COO, CMO, AEO, Architect, Planner, Analyst, Reviewer, and Executor as deterministic first-class agents.

## Install

```bash
npm install @sholder/roles
```

## Quick Start

```typescript
import { RoleRuntime } from '@sholder/roles/runtime';

const runtime = new RoleRuntime();

const report = await runtime.executeAll({
  context: {},
  params: { vision: 'enterprise-scale', budget: 10_000_000 },
});

console.log(report.status);
console.log(report.outputs.get('Executor'));
```

## Execute Specific Roles

```typescript
const report = await runtime.executeRoles(['CEO', 'CTO', 'Architect'], {
  context: {},
  params: { vision: 'platform', stack: ['typescript', 'bun'] },
});
```

## Custom Agent

```typescript
import { BaseRoleAgent } from '@sholder/roles/core';
import type { RoleMetadata, RoleInput } from '';

class CustomCEO extends BaseRoleAgent {
  readonly metadata: RoleMetadata = {
    id: 'CEO',
    name: 'Custom CEO',
    version: '2.0.0',
    description: 'Custom strategic director',
    dependencies: [],
    priority: 100,
  };

  protected async run(input: RoleInput) {
    return { strategy: 'custom', approved: true };
  }
}
```

## API

### `RoleRuntime`

| Method         | Signature                                            | Description            |
| -------------- | ---------------------------------------------------- | ---------------------- |
| `executeAll`   | `(input, traceId?) => Promise<ExecutionReport>`      | Runs all 11 roles      |
| `executeRoles` | `(ids, input, traceId?) => Promise<ExecutionReport>` | Runs selected roles    |
| `registry`     | `RoleRegistry`                                       | Direct registry access |

### `Orchestrator`

| Method | Signature                                            | Description         |
| ------ | ---------------------------------------------------- | ------------------- |
| `run`  | `(ids, input, traceId?) => Promise<ExecutionReport>` | Executes role graph |

### `RoleRegistry`

| Method            | Description              |
| ----------------- | ------------------------ |
| `register(agent)` | Register an agent        |
| `get(id)`         | Retrieve agent by RoleId |
| `unregister(id)`  | Remove agent             |
| `clear()`         | Remove all agents        |

### `ExecutionEngine`

| Method                   | Description                   |
| ------------------------ | ----------------------------- |
| `buildGraph(ids, input)` | Resolve dependency graph      |
| `buildPlan(graph)`       | Compute staged execution plan |

## Role Dependency Graph

```
CEO ─────────────────┬──────────┐
                     │          │
CTO ◄── CEO         CFO ◄── CEO COO ◄── CEO, CFO
 │                              │
AEO ◄── CTO, COO               CMO ◄── CEO, COO
 │
Architect ◄── CTO, AEO
 │
Planner ◄── Architect, COO
 │
Analyst ◄── Planner, CFO
 │
Reviewer ◄── Analyst, Planner
 │
Executor ◄── Reviewer, AEO
```

## Build

```bash
npm run build        # ESM + CJS + types
npm test             # vitest
npm run bench        # benchmark runner (requires build)
npm run lint         # eslint
npm run format       # prettier
```

## License

MIT
