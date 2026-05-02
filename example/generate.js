import { writeFile, readFile } from 'fs/promises';
import { MetadataWriter } from './updater.js';

const OUTPUT_PATH = 'metadata.json';
const SCHEMA_URL = 'https://example.com/metadata.schema.json';

function mapLevel(priority = 50) {
  if (priority >= 80) return 'executive';
  if (priority >= 50) return 'strategic';
  if (priority >= 20) return 'tactical';
  return 'operational';
}

async function readPackageJson() {
  try {
    const raw = await readFile(new URL('./package.json', import.meta.url), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function cloneResult(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

function buildEnterpriseMetadata(pkg, registry, report) {
  const org = {
    name: pkg.name || 'example-organization',
    id: pkg.name ? pkg.name.replace(/[^a-z0-9_-]/gi, '_') : 'org_1',
    domain: pkg.name ? `${pkg.name}.example.com` : 'example.com',
  };

  // choose a focal role (prefer Executor if present)
  const outputsKeys = Array.from(report.outputs.keys());
  const focalRole = outputsKeys.includes('Executor') ? 'Executor' : outputsKeys[0] || null;

  const role = focalRole
    ? {
        name: focalRole,
        id: focalRole,
        description: registry.get(focalRole)?.agent?.metadata?.description || '',
        level: mapLevel(registry.get(focalRole)?.agent?.metadata?.priority),
        reports_to: (registry.get(focalRole)?.agent?.metadata?.dependencies || [null])[0] || null,
        manages: [],
      }
    : null;

  const rolesSection = {};

  for (const [roleId, entry] of registry.getAll()) {
    const meta = entry.agent.metadata || {};
    const output = report.outputs.get(roleId) || null;

    rolesSection[roleId] = {
      id: meta.id || roleId,
      name: meta.name || roleId,
      description: meta.description || '',
      level: mapLevel(meta.priority),
      reports_to: (meta.dependencies && meta.dependencies[0]) || null,
      manages: [],
      identity: {
        owner: pkg.author || 'example-owner',
        team: pkg.name || 'example-team',
        stakeholders: [],
      },
      objectives: [],
      capabilities: {
        core: [],
        advanced: [],
        tools: [],
        dependencies: [...(meta.dependencies || [])],
      },
      decision_framework: {
        inputs: [],
        constraints: [],
        policies: [],
        risk_tolerance: 'medium',
      },
      execution: {
        workflow: [],
        automation_level: '0%',
        manual_overrides: [],
      },
      communication: {
        channels: ['email', 'slack', 'api', 'dashboard'],
        reporting_format: 'json',
        reporting_frequency: 'daily',
      },
      governance: {
        compliance: [],
        audit: { enabled: true, log_level: 'standard', retention_days: 90 },
        access_control: { roles_allowed: [], permissions: ['read', 'write', 'execute', 'approve'] },
      },
      risk_management: { risks: [], fallback_strategy: '' },
      performance: { sla: { availability: '99.9%', latency: '200', throughput: '10' }, monitoring: { metrics: [], alerts: [] } },
      integration: { apis: [], events: [], data_sources: [], data_outputs: [] },
      role_profile: {},
      lifecycle: { status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version_history: [{ version: '1.0.0', changes: ['initial generated metadata'], date: new Date().toISOString() }] },
    };

    // attach lastExecution into role_profile
    rolesSection[roleId].role_profile[roleId] = {
      static: {
        id: meta.id || roleId,
        name: meta.name || roleId,
        version: meta.version || '1.0.0',
        description: meta.description || '',
        dependencies: [...(meta.dependencies || [])],
        priority: meta.priority ?? null,
      },
      lastExecution: output ? cloneResult(output) : null,
    };
  }

  return {
    $schema: SCHEMA_URL,
    version: '1.0.0',
    organization: org,
    role,
    identity: { owner: pkg.author || 'example-owner', team: pkg.name || 'example-team', stakeholders: [] },
    objectives: [],
    capabilities: { core: [], advanced: [], tools: [], dependencies: [] },
    decision_framework: { inputs: [], constraints: [], policies: [], risk_tolerance: 'medium' },
    execution: { workflow: [], automation_level: '0%', manual_overrides: [] },
    communication: { channels: ['email', 'slack', 'api', 'dashboard'], reporting_format: 'json', reporting_frequency: 'daily' },
    governance: { compliance: [], audit: { enabled: true, log_level: 'standard', retention_days: 90 }, access_control: { roles_allowed: [], permissions: ['read', 'write', 'execute', 'approve'] } },
    risk_management: { risks: [], fallback_strategy: '' },
    performance: { sla: { availability: '99.9%', latency: '200', throughput: '10' }, monitoring: { metrics: [], alerts: [] } },
    integration: { apis: [], events: [], data_sources: [], data_outputs: [] },
    role_profile: rolesSection,
    lifecycle: { status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version_history: [{ version: '1.0.0', changes: ['generated from runtime report'], date: new Date().toISOString() }] },
  };
}

async function main() {
  const pkg = await readPackageJson();
  const writer = new MetadataWriter();
  console.log('Executing default roles (this may take a moment)...');
  const report = await writer.executeAll({ params: {} });

  console.log('Building enterprise metadata JSON...');
  const enterprise = buildEnterpriseMetadata(pkg, writer.registry, report);

  await writeFile(OUTPUT_PATH, JSON.stringify(enterprise, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT_PATH} — contains entries for ${Object.keys(enterprise.role_profile).length} roles.`);
}

main().catch(err => {
  console.error('Error generating enterprise metadata:', err);
  process.exit(1);
});
