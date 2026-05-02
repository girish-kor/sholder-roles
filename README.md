# _@sholder/roles_

`Roles are first-class agents that can be registered, composed via dependency metadata, planned by the execution engine, and executed by the orchestrator or runtime.`

<p align="center">

[![npm](https://img.shields.io/npm/v/@sholder/roles?style=for-the-badge&color=222222&logo=npm&logoColor=white)](https://www.npmjs.com/package/@sholder/roles)
![node](https://img.shields.io/node/v/@sholder/roles?style=for-the-badge&color=222222&logo=node.js&logoColor=white)
[![build](https://img.shields.io/github/actions/workflow/status/girish-kor/sholder-roles/ci.yml?branch=main&style=for-the-badge&label=build&logo=githubactions&logoColor=white&color=222222)](https://github.com/girish-kor/sholder-roles/actions/workflows/ci.yml)
![last commit](https://img.shields.io/github/last-commit/girish-kor/sholder-roles?style=for-the-badge&logo=git&logoColor=white&color=222222)
[![stars](https://img.shields.io/github/stars/girish-kor/sholder-roles?style=for-the-badge&logo=github&logoColor=white&color=222222)](https://github.com/girish-kor/sholder-roles/stargazers)
[![issues](https://img.shields.io/github/issues/girish-kor/sholder-roles?style=for-the-badge&logo=github&logoColor=white&color=222222)](https://github.com/girish-kor/sholder-roles/issues)
![license](https://img.shields.io/npm/l/@sholder/roles?style=for-the-badge&color=222222)

</p>

`Enterprise role orchestration • workflow automation • deterministic agent framework — CEO, CTO, CFO, COO, CMO, AEO, Architect, Planner, Analyst, Reviewer, Executor`

```
CEO ◄────────────────┬──────────┐
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

## Table of contents

- [Installation](#installation)
- [Role reference](#role-reference-usage-inputs-outputs-examples)
  <!-- detail javascript code examples -->
  - [CEO](#ceo)
  - [CTO](#cto)
  - [CFO](#cfo)
  - [COO](#coo)
  - [CMO](#cmo)
  - [AEO](#aeo-authorization--external-ops)
  - [Architect](#architect)
  - [Planner](#planner)
  - [Analyst](#analyst)
  - [Reviewer](#reviewer)
  - [Executor](#executor)
- [Common patterns](#common-patterns)
<!-- data flow diagram level 3 -->
- [Extending roles (custom agents)](#extending-roles-custom-agents)
- [Troubleshooting & tips](#troubleshooting--tips)
- [About Author](#about-author)

## Installation

`@sholder/roles` targets Node.js 18+ and ships as an ES module with CJS and type declarations in the published package.

```bash
npm install @sholder/roles
```

## Role reference: usage, inputs, outputs, examples

Every role follows the same lifecycle:

1. `init(input)` validates the incoming `RoleInput`.
2. `execute(input)` runs the agent and returns a typed `RoleOutput`.
3. `validate(output)` checks the completed output before it is accepted.

The shared input and output shapes are:

```js
const roleInput = {
  context: {},
  params: {},
  timestamp: Date.now(),
  traceId: 'trace-123',
};

const roleOutput = {
  roleId: 'CEO',
  result: {},
  status: 'completed',
  durationMs: 0,
  timestamp: Date.now(),
  traceId: 'trace-123',
};
```

The public API is centered on these classes and helpers:

```js
import {
  BaseRoleAgent,
  CEOAgent,
  createDefaultAgents,
  RoleRegistry,
  ExecutionEngine,
  Orchestrator,
  RoleRuntime,
  generateTraceId,
  mergeContext,
} from '@sholder/roles';
```

For most consumers, `RoleRuntime` is the simplest entry point because it ships with all 11 default agents pre-registered.

```js
import { RoleRuntime } from '@sholder/roles';

const runtime = new RoleRuntime();

const report = await runtime.executeAll({
  context: {},
  params: { vision: 'enterprise', budget: 10_000_000 },
});

console.log(report.status); // completed
console.log(report.outputs.get('Executor')?.result);
```

The following sections describe each built-in role, its dependencies, and the result fields it produces.

### CEO

- Dependency metadata: none.
- Purpose: defines strategy and approval direction.
- Common inputs: `params.vision`, `params.objectives`.
- Result fields: `strategy`, `approved`, `objectives`, `mandate`, `quarter`.

```js
import { CEOAgent, generateTraceId } from '@sholder/roles';

const report = await new CEOAgent().execute({
  context: {},
  params: { vision: 'growth', objectives: ['revenue'] },
  timestamp: Date.now(),
  traceId: generateTraceId(),
});
```

### CTO

- Dependency metadata: `CEO`.
- Purpose: converts strategy into a technology roadmap.
- Common inputs: `context.strategy`, `params.stack`.
- Result fields: `techRoadmap`, `stack`, `standards`, `scalabilityTarget`.

```js
import { CTOAgent, generateTraceId } from '@sholder/roles';

const output = await new CTOAgent().execute({
  context: { strategy: 'strategic-plan-growth' },
  params: { stack: ['typescript', 'node'] },
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.techRoadmap);
```

### CFO

- Dependency metadata: `CEO`.
- Purpose: approves budgets and financial strategy.
- Common inputs: `context.strategy`, `params.budget`.
- Result fields: `approvedBudget`, `fiscalStrategy`, `riskTolerance`, `burnRateMonthly`, `runway`.

```js
import { CFOAgent, generateTraceId } from '@sholder/roles';

const output = await new CFOAgent().execute({
  context: { strategy: 'strategic-plan-growth' },
  params: { budget: 1_200_000 },
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.burnRateMonthly);
```

### COO

- Dependency metadata: `CEO`, `CFO`.
- Purpose: turns financial approval into operating assumptions.
- Common inputs: `context.strategy`, `context.approvedBudget`.
- Result fields: `operatingModel`, `efficiency`, `headcount`, `processFramework`, `kpis`.

```js
import { COOAgent, generateTraceId } from '@sholder/roles';

const output = await new COOAgent().execute({
  context: {
    strategy: 'strategic-plan-growth',
    approvedBudget: 500_000,
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.headcount);
```

### CMO

- Dependency metadata: `CEO`, `COO`.
- Purpose: shapes brand and go-to-market execution.
- Common inputs: `context.strategy`, `params.segment`.
- Result fields: `brandStrategy`, `targetSegment`, `channels`, `cac`, `ltv`.

```js
import { CMOAgent, generateTraceId } from '@sholder/roles';

const output = await new CMOAgent().execute({
  context: { strategy: 'strategic-plan-growth' },
  params: { segment: 'smb' },
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.channels);
```

### AEO: Authorization & External Ops

- Dependency metadata: `CTO`, `COO`.
- Purpose: coordinates autonomous agent pipelines and execution contracts.
- Common inputs: `context.techRoadmap`, `context.operatingModel`.
- Result fields: `agentPipeline`, `concurrency`, `schedulerMode`, `contractVersion`, `agentCount`.

```js
import { AEOAgent, generateTraceId } from '@sholder/roles';

const output = await new AEOAgent().execute({
  context: {
    techRoadmap: 'roadmap-strategic-plan-growth',
    operatingModel: 'ops-strategic-plan-growth',
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.agentCount);
```

### Architect

- Dependency metadata: `CTO`, `AEO`.
- Purpose: designs system topology and architectural constraints.
- Common inputs: `context.techRoadmap`, `context.agentPipeline`.
- Result fields: `systemDesign`, `topology`, `pipelineArch`, `patterns`, `slaMs`.

```js
import { ArchitectAgent, generateTraceId } from '@sholder/roles';

const output = await new ArchitectAgent().execute({
  context: {
    techRoadmap: 'roadmap-strategic-plan-growth',
    agentPipeline: 'pipeline-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.patterns);
```

### Planner

- Dependency metadata: `Architect`, `COO`.
- Purpose: converts architecture into an executable plan.
- Common inputs: `context.systemDesign`, `context.operatingModel`.
- Result fields: `executionPlan`, `phases`, `sprintCount`, `milestones`, `criticalPath`.

```js
import { PlannerAgent, generateTraceId } from '@sholder/roles';

const output = await new PlannerAgent().execute({
  context: {
    systemDesign: 'arch-roadmap-strategic-plan-growth',
    operatingModel: 'ops-strategic-plan-growth',
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.executionPlan);
```

### Analyst

- Dependency metadata: `Planner`, `CFO`.
- Purpose: produces KPI-oriented analysis and forecast data.
- Common inputs: `context.executionPlan`, `context.approvedBudget`.
- Result fields: `analysisReport`, `roi`, `variance`, `forecast`, `dataPoints`.

```js
import { AnalystAgent, generateTraceId } from '@sholder/roles';

const output = await new AnalystAgent().execute({
  context: {
    executionPlan: 'plan-arch-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
    approvedBudget: 1_000_000,
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.forecast);
```

### Reviewer

- Dependency metadata: `Analyst`, `Planner`.
- Purpose: applies quality gates before release.
- Common inputs: `context.analysisReport`, `context.executionPlan`.
- Result fields: `reviewId`, `approved`, `qualityScore`, `findings`, `gatesPassed`.

```js
import { ReviewerAgent, generateTraceId } from '@sholder/roles';

const output = await new ReviewerAgent().execute({
  context: {
    analysisReport: 'analysis-plan-arch-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
    executionPlan: 'plan-arch-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.approved);
```

### Executor

- Dependency metadata: `Reviewer`, `AEO`.
- Purpose: materializes the approved plan.
- Common inputs: `context.reviewId`, `context.agentPipeline`.
- Result fields: `executionId`, `pipeline`, `deployed`, `checksum`, `artifactsProduced`.

```js
import { ExecutorAgent, generateTraceId } from '@sholder/roles';

const output = await new ExecutorAgent().execute({
  context: {
    reviewId: 'review-analysis-plan-arch-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
    agentPipeline: 'pipeline-roadmap-strategic-plan-growth-ops-strategic-plan-growth',
  },
  params: {},
  timestamp: Date.now(),
  traceId: generateTraceId(),
});

console.log(output.result.deployed);
```

## Common patterns

### Register and run a subset of roles

Use `RoleRegistry` and `Orchestrator` when you want direct control over which agents are available and which subset should execute.

```js
import { Orchestrator, RoleRegistry, createDefaultAgents } from '@sholder/roles';

const registry = new RoleRegistry();
for (const agent of createDefaultAgents().values()) {
  registry.register(agent);
}

const orchestrator = new Orchestrator(registry, {
  maxConcurrency: 4,
  timeoutMs: 30_000,
  retryLimit: 0,
  strict: true,
});

const report = await orchestrator.run(['CEO', 'CTO', 'CFO'], {
  context: {},
  params: { vision: 'platform', budget: 5_000_000 },
});
```

### Inspect the execution graph

`ExecutionEngine` resolves dependencies, then groups ready nodes into deterministic stages.

```js
import { ExecutionEngine, RoleRegistry, createDefaultAgents } from '@sholder/roles';

const registry = new RoleRegistry();
for (const agent of createDefaultAgents().values()) registry.register(agent);

const engine = new ExecutionEngine(registry);
const graph = engine.buildGraph(['CEO', 'CTO', 'AEO'], { context: {}, params: {} });
const plan = engine.buildPlan(graph);

console.log(plan.stages);
```

### Merge deterministic context

The orchestrator carries role output forward by merging `output.result` into the accumulated context.

```js
import { mergeContext } from '@sholder/roles';

const next = mergeContext({ strategy: 'default' }, { approvedBudget: 1_000_000 });
```

### Create your own trace ID

Pass a stable `traceId` when you want to correlate all outputs from a single run.

```js
import { Orchestrator, RoleRegistry, CEOAgent, generateTraceId } from '@sholder/roles';

const registry = new RoleRegistry();
registry.register(new CEOAgent());

const orchestrator = new Orchestrator(registry);
const traceId = generateTraceId();
const report = await orchestrator.run(['CEO'], { context: {}, params: {} }, traceId);
```

## Extending roles (custom agents)

The package exposes a fixed bundled `RoleId` union for the built-in roles, but the execution contract itself is extensible through `BaseRoleAgent`. If you need application-specific roles, define a thin adapter layer in your app that maps your local role identifiers into the same registry/orchestrator flow.

```js
import { BaseRoleAgent } from '@sholder/roles';

class CustomAgent extends BaseRoleAgent {
  metadata = {
    id: 'CEO',
    name: 'Custom Agent',
    version: '1.0.0',
    description: 'Application-specific extension point',
    dependencies: [],
    priority: 10,
  };

  run(input) {
    return Promise.resolve({
      customOutput: true,
      trace: input.traceId,
    });
  }
}
```

Keep custom roles deterministic, side-effect free, and explicit about dependencies so the execution plan stays predictable.

## BASICS TO ADVANCED — FAQ (God of Developers)

Q: What is `@sholder/roles` in one line?

- A: A deterministic role orchestration library with built-in enterprise agents and an engine/orchestrator/runtime to register, plan, and execute dependent roles.

Q: How do I install and which Node version is required?

- A: `npm install @sholder/roles` — requires Node.js 18+; package ships as ESM with a CJS build and type declarations.

Q: Quickstart: run all default roles with minimal code?

- A: Create `new RoleRuntime()` and call `executeAll({ context: {}, params: {} })` for a zero-config run with bundled agents.

Q: I only want a subset of roles — how?

- A: Use `RoleRegistry` + `Orchestrator`: register chosen agents and call `orchestrator.run(['CEO','CTO'], input)` to control scope and concurrency.

Q: How are dependencies resolved and executed deterministically?

- A: Each agent exposes `metadata.dependencies`; `ExecutionEngine` topologically sorts nodes into deterministic stages and the orchestrator executes ready stages in order.

Q: How does context merging work across roles?

- A: The orchestrator merges each `output.result` into accumulated context using `mergeContext`, enabling downstream roles to read required values.

Q: How to author a custom role safely?

- A: Extend `BaseRoleAgent`, declare `metadata` (id, dependencies), keep `run/init/validate` deterministic and side-effect free, then register with `RoleRegistry`.

Q: What about TypeScript typings and `RoleId` union?

- A: The package exports types; built-in `RoleId` covers bundled roles — for custom ids, keep local type adapters or widen your application types.

Q: Can I use this library in both ESM and CJS codebases?

- A: Yes — prefer ESM imports in modern projects; use the CJS build if your environment requires `require()`.

Q: How to test roles and orchestration behavior?

- A: Unit-test individual agents by mocking inputs/outputs; integration-test `ExecutionEngine`/`Orchestrator` with a small `RoleRegistry` and deterministic mock agents (see `tests/`).

Q: How to tune concurrency, timeouts, and retries?

- A: Configure `Orchestrator` with `maxConcurrency`, `timeoutMs`, and `retryLimit`; toggle `strict` to control abort-on-failure behavior.

Q: Any performance best practices?

- A: Avoid CPU-heavy synchronous work in agents, batch large payloads, and size `maxConcurrency` to the runtime's throughput; stage grouping reduces unnecessary waits.

Q: How to bundle for browser or Deno usage?

- A: The library is Node-first; for browser/Deno, create a thin adapter exposing the minimal runtime API and bundle with Rollup/Esbuild, shimming Node APIs as needed.

Q: How are side-effects and secrets handled?

- A: Keep side-effects explicit and audit them; do not store secrets in plain `context`/`params` — use encrypted stores or environment configs.

Q: What about versioning and API compatibility?

- A: Follow semver — breaking changes are released as major versions; pin to a tested minor and read the changelog before upgrading.

Q: Troubleshooting tip: missing/duplicate role errors?

- A: `RoleError` commonly means a registration or metadata issue — ensure each `metadata.id` is unique and all declared dependencies are registered.

Q: Where to get help or contribute?

- A: Open an issue or PR in the repository and follow `CONTRIBUTING.md` for guidelines.

### metadata.json FAQ (`@sholder/roles`)

Q: What should a basic `metadata.json` include for role execution?

- A: Include execution targets, shared params, and an initial context object. Keep it small and deterministic.

```json
{
  "roles": [
    "CEO",
    "CTO",
    "CFO",
    "COO",
    "AEO",
    "Architect",
    "Planner",
    "Analyst",
    "Reviewer",
    "Executor"
  ],
  "params": {
    "vision": "enterprise-platform",
    "budget": 5000000
  },
  "context": {},
  "options": {
    "maxConcurrency": 4,
    "strict": true,
    "timeoutMs": 30000,
    "retryLimit": 0
  }
}
```

Q: How do I run `@sholder/roles` using values from `metadata.json`?

- A: Read the JSON, create a `RoleRegistry` + `Orchestrator` (or `RoleRuntime`), then pass `context` and `params` into `run`/`executeAll`.

```js
import { readFile } from 'node:fs/promises';
import { Orchestrator, RoleRegistry, createDefaultAgents } from '@sholder/roles';

const metadata = JSON.parse(await readFile('./metadata.json', 'utf8'));

const registry = new RoleRegistry();
for (const agent of createDefaultAgents().values()) registry.register(agent);

const orchestrator = new Orchestrator(registry, metadata.options ?? {});
const report = await orchestrator.run(metadata.roles, {
  context: metadata.context ?? {},
  params: metadata.params ?? {},
});

console.log(report.status);
```

Q: Can `metadata.json` define only a subset of roles?

- A: Yes. Provide a subset in `roles`; dependencies are resolved by the engine. Ensure all required dependency agents are registered.

Q: Should I store secrets in `metadata.json`?

- A: No. Keep secrets in environment variables or a secret manager; inject into `params` at runtime only when required.

Q: How do I validate `metadata.json` before running orchestration?

- A: Check JSON parsing, ensure `roles` is a non-empty array, and validate option types (`maxConcurrency`, `timeoutMs`, `retryLimit`, `strict`) before execution.

Q: What common mistakes break metadata-driven runs?

- A: Invalid role IDs, missing dependencies in registry, malformed JSON, and passing non-object `context`/`params`.

## Troubleshooting & tips

- `RoleError` usually means a role was missing, duplicated, or given invalid lifecycle input.
- `CyclicDependencyError` means your dependency metadata forms a loop and the engine cannot produce a valid plan.
- `OrchestrationError` covers deadlocks, timeouts, and strict-mode failures during execution.
- `RoleRuntime` already registers the bundled agents, so use it when you want the fastest possible path to a complete run.
- If you need reproducible logs or downstream correlation, pass your own `traceId` instead of relying on the generated value.
- In strict mode, a single rejected role aborts the orchestration; set `strict: false` if you want partial progress to continue.

## About Author

`@sholder/roles` is maintained by Girish Kor.

Repository: [girish-kor/sholder-roles](https://github.com/girish-kor/sholder-roles)
