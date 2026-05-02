import { RoleRuntime } from '../dist/esm/runtime/index.js';

const RUNS = 100;

async function bench(label, fn) {
  const times = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / RUNS;
  const min = Math.min(...times);
  const max = Math.max(...times);
  process.stdout.write(`[${label}] avg=${avg.toFixed(2)}ms min=${min.toFixed(2)}ms max=${max.toFixed(2)}ms runs=${RUNS}\n`);
}

const runtime = new RoleRuntime();

await bench('executeAll', () =>
  runtime.executeAll({ context: {}, params: { vision: 'bench', budget: 1000000 } }),
);

await bench('executeRoles:CEO', () =>
  runtime.executeRoles(['CEO'], { context: {}, params: { vision: 'bench' } }),
);

await bench('executeRoles:CEO+CTO+CFO', () =>
  runtime.executeRoles(['CEO', 'CTO', 'CFO'], { context: {}, params: { budget: 2000000 } }),
);

await bench('executeRoles:Executor-chain', () =>
  runtime.executeRoles(
    ['CEO', 'CTO', 'CFO', 'COO', 'AEO', 'Architect', 'Planner', 'Analyst', 'Reviewer', 'Executor'],
    { context: {}, params: { vision: 'bench', budget: 5000000 } },
  ),
);
