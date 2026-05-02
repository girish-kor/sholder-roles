/**
 * metadata-updater.js
 *
 * Wraps RoleRuntime/Orchestrator and automatically writes metadata.json
 * after every execution. Merges static agent metadata (id, name, version,
 * description, dependencies, priority) with live execution output
 * (status, durationMs, result, traceId) per role.
 *
 * metadata.json schema:
 * {
 *   schemaVersion: string,
 *   lastUpdated:   ISO string,
 *   traceId:       string,
 *   status:        ExecutionStatus,
 *   totalDurationMs: number,
 *   stages:        RoleId[][],
 *   roles: {
 *     [RoleId]: {
 *       id, name, version, description, dependencies, priority,   ← static
 *       lastExecution: { status, durationMs, timestamp, result }  ← dynamic
 *     }
 *   }
 * }
 */

import { writeFile, readFile } from 'fs/promises';
import { RoleRuntime, RoleRegistry, Orchestrator, createDefaultAgents, generateTraceId } from '@sholder/roles';

const SCHEMA_VERSION = '1.0.0';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds the roles section by merging agent metadata (from registry)
 * with execution output (from report.outputs).
 */
function buildRolesSection(registry, report) {
  const roles = {};

  for (const [roleId, entry] of registry.getAll()) {
    const { id, name, version, description, dependencies, priority } = entry.agent.metadata;

    const output = report.outputs.get(roleId);

    roles[roleId] = {
      id,
      name,
      version,
      description,
      dependencies: [...dependencies],
      priority,
      lastExecution: output
        ? {
            status:     output.status,
            durationMs: output.durationMs,
            timestamp:  output.timestamp,
            result:     { ...output.result },
          }
        : null,
    };
  }

  return roles;
}

/**
 * Serialises an ExecutionReport + registry into the metadata.json shape.
 */
function buildMetadata(registry, report) {
  return {
    schemaVersion:   SCHEMA_VERSION,
    lastUpdated:     new Date(report.timestamp).toISOString(),
    traceId:         report.traceId,
    status:          report.status,
    totalDurationMs: report.totalDurationMs,
    stages:          report.plan.stages.map(stage => [...stage]),
    roles:           buildRolesSection(registry, report),
  };
}

// ─── MetadataWriter ───────────────────────────────────────────────────────────

export class MetadataWriter {
  #outputPath;
  #runtime;

  /**
   * @param {string} outputPath  - file path for metadata.json
   * @param {object} [config]    - optional OrchestratorConfig overrides
   */
  constructor(outputPath = 'metadata.json', config = {}) {
    this.#outputPath = outputPath;
    this.#runtime    = new RoleRuntime(config);
  }

  get registry() {
    return this.#runtime.registry;
  }

  /**
   * Runs all 11 built-in roles and writes metadata.json on completion.
   */
  async executeAll(input = {}, traceId) {
    const report = await this.#runtime.executeAll(
      { context: {}, params: {}, ...input },
      traceId,
    );
    await this.#flush(report);
    return report;
  }

  /**
   * Runs a subset of roles and writes metadata.json on completion.
   */
  async executeRoles(roleIds, input = {}, traceId) {
    const report = await this.#runtime.executeRoles(
      roleIds,
      { context: {}, params: {}, ...input },
      traceId,
    );
    await this.#flush(report);
    return report;
  }

  /**
   * Reads and parses the current metadata.json (returns null if absent).
   */
  async read() {
    try {
      const raw = await readFile(this.#outputPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // ── private ─────────────────────────────────────────────────────────────────

  async #flush(report) {
    const metadata = buildMetadata(this.#runtime.registry, report);
    await writeFile(this.#outputPath, JSON.stringify(metadata, null, 2), 'utf8');
  }
}

// ─── standalone helper ────────────────────────────────────────────────────────

/**
 * One-shot: run all roles and write metadata.json, returns parsed metadata.
 */
export async function runAndUpdateMetadata(outputPath = 'metadata.json', params = {}) {
  const writer = new MetadataWriter(outputPath);
  await writer.executeAll({ params });
  return writer.read();
}
