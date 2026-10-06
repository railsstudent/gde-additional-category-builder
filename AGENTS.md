# Agent Guidelines: gde-additional-category-builder

This file provides context, rules, and technical constraints for AI assistants working on this codebase.

## Project Overview

`gde-additional-category-builder` is an open-source plugin combining:

1. **MCP Server**: Stdio-based Node.js service exposing tools to query Advocu activities, analyze category readiness, and serve bundled GDE documentation.
2. **Skill (`skills/`)**: Prompt-driven workflow guiding the agent to discover categories, evaluate evidence, warn about the cooling-off period, and draft application dossiers.
3. **Agent (`agents/`)**: Specialized "GDE Evaluation Mentor" system prompt.

---

## Project Structure & Architecture

Follow this directory layout when adding or modifying files:

- **`src/`**: TypeScript source code for the MCP server and clients.
  - **`src/server.ts`**: Entry point orchestrating MCP tool registration and stdio transport.
  - **`src/tools/`**: Individual tool handlers with explicit Zod parameter schemas.
  - **`src/services/`**: External API integration (Advocu client) and data retrieval logic.
  - **`src/interfaces/`**: TypeScript domain and API contract interfaces.
  - **`src/types/`**: Zod-inferred types and type aliases.
- **`data/docs/`**: Bundled static Markdown guides served by `list_documentation` / `get_documentation`.
- **`skills/`**: Agent skill instructions, references, and workflows (`SKILL.md`).
- **`agents/`**: Pre-configured agent definitions and prompt templates.
- **`docs/adr/`**: Architectural Decision Records documenting engineering choices.
- **`.scratch/`**: Tracked in Git. Holds project feature specs (`spec.md`), tickets (`issues/`), and development wayfinding maps.

---

## Core Coding Style & Constraints

1. **Biome Compliance (`biome.json`)**:
   - All code must strictly adhere to the formatting and linting rules in `biome.json` (enforced via `npm run lint` and `npm run format`).

2. **Stdio Stream Safety (Critical for MCP)**:
   - NEVER use `console.log()` in `src/` (mechanically enforced via Biome `noConsole`). Standard output is strictly reserved for JSON-RPC messages. Always write debug logs to stderr using `console.error()`.

3. **Error Handling via `McpError`**:
   - Tool errors must throw `McpError` from `@modelcontextprotocol/server` (or `@modelcontextprotocol/core`) with standard `ErrorCode` enums. Do not throw raw unhandled JavaScript `Error` objects.

4. **Tool Schemas & Type Safety**:
   - Every MCP tool definition must use a **Zod** schema for runtime parameter validation.
   - Parameter lists follow the 3-argument limit (`useMaxParams: 3`); functions requiring >= 3 arguments must accept a typed `options` object.

5. **Security & Privacy Hygiene**:
   - Never commit API keys or private candidate notes. Load secrets via `process.env.ADVOCU_API_KEY`.
   - Unit tests must use sanitized mock data.

---

## Testing Strategy (Vitest)

- **Colocated Spec Files**: Colocate unit test files alongside their implementations using the `.spec.ts` suffix (e.g. `src/services/advocu.service.spec.ts`, `src/tools/query-advocu-activities.tool.spec.ts`).
- **Mocking**: Mock external network calls (`fetch`) using Vitest spies (`vi.fn()`).
- **Tool Verification**: Test Zod schema validation failures (`ErrorCode.InvalidParams`) and expected JSON-RPC response structures.

---

## Development Workflow

- **Planning**: `/to-spec` → `.scratch/<feature>/spec.md` → `/to-tickets` → `.scratch/<feature>/issues/`
  - **Behavioral PRD Purity**: `spec.md` must strictly contain behavioral specifications and user stories ("what and why"). Architecture, SDK methods, data schemas, and technical trade-offs belong in `docs/adr/` ("how").
  - **Phased Progression**: Never jump ahead to ticket creation (`/to-tickets`) or implementation without explicit user review and confirmation.
- **Implementation Options**:
  - `/implement`: Single-agent, iterative step-by-step implementation using `tdd` at public seams (ideal for focused tickets, tight feedback loops, and learning-by-doing).
  - `/implement-spec`: Multi-subagent task-graph orchestrator running parallel worktrees (ideal for large independent task graphs).
  - *Recommendation*: The agent evaluates task scope and proposes the suitable workflow (`/implement` vs `/implement-spec`) to the user before starting.
- **Retrospective**: `/retro` to review what went well, bad, or awful in a coding session and suggest concrete improvements to the environment, guardrails, and navigation.

---

## Agent skills

### Issue tracker

Local markdown files in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context (`GLOSSARY.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.

---

## Documentation & Research Protocols

1. **Domain Terms & Vocabulary**:
   - Read `GLOSSARY.md` before naming new types, variables, or dossier sections. Use canonical terms (`Category`, `Sub-category`, `Qualifying Activity`, `Activity Profile`, `Evidence Dossier`, `Cooling-off Period`).
2. **Architectural Decisions**:
   - Inspect `docs/adr/` to ensure new changes do not contradict settled architectural choices.

---

## Verification Loop

1. **Targeted Testing with Vitest**:
   - Run tests against specifically modified test files using `npx vitest run <path/to/spec.ts>`.
2. **Full Suite Verification**:
   - Run `npm run lint && npm run format && npm test` at the end of task milestones.
