export { CEOAgent } from './ceo.js';
export { CTOAgent } from './cto.js';
export { CFOAgent } from './cfo.js';
export { COOAgent } from './coo.js';
export { CMOAgent } from './cmo.js';
export { AEOAgent } from './aeo.js';
export { ArchitectAgent } from './architect.js';
export { PlannerAgent } from './planner.js';
export { AnalystAgent } from './analyst.js';
export { ReviewerAgent } from './reviewer.js';
export { ExecutorAgent } from './executor.js';

import { CEOAgent } from './ceo.js';
import { CTOAgent } from './cto.js';
import { CFOAgent } from './cfo.js';
import { COOAgent } from './coo.js';
import { CMOAgent } from './cmo.js';
import { AEOAgent } from './aeo.js';
import { ArchitectAgent } from './architect.js';
import { PlannerAgent } from './planner.js';
import { AnalystAgent } from './analyst.js';
import { ReviewerAgent } from './reviewer.js';
import { ExecutorAgent } from './executor.js';
import type { RoleAgent, RoleId } from '../types/index.js';

export function createDefaultAgents(): ReadonlyMap<RoleId, RoleAgent> {
  const agents: [RoleId, RoleAgent][] = [
    ['CEO', new CEOAgent()],
    ['CTO', new CTOAgent()],
    ['CFO', new CFOAgent()],
    ['COO', new COOAgent()],
    ['CMO', new CMOAgent()],
    ['AEO', new AEOAgent()],
    ['Architect', new ArchitectAgent()],
    ['Planner', new PlannerAgent()],
    ['Analyst', new AnalystAgent()],
    ['Reviewer', new ReviewerAgent()],
    ['Executor', new ExecutorAgent()],
  ];
  return new Map(agents);
}
