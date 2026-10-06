# 0002: Decoupled Tool Pipeline, Documentation Resources, and Dossier Architecture

## Context & Decision

When designing the feature architecture for `gde-additional-category-builder`, we established the evaluation contracts, tool boundaries, documentation delivery mechanisms, and server integration standards based on real-world GDE evaluation dynamics and the Model Context Protocol (MCP) TypeScript SDK v2 specification.

We decided to:

1. **Dual Documentation Architecture (MCP Tools for Agents and MCP Resources for Host Applications)**:
   - **MCP Resources for Host Applications**: Register bundled Markdown guidebooks (`data/docs/*.md`) using `@modelcontextprotocol/server` (v2.x) `server.registerResource()` with static `gde-docs://{slug}` URIs. This enables MCP host environments (e.g., Claude Desktop, Cursor, Antigravity IDE) to discover and attach documentation directly via native `resources/list` and `resources/read` protocols.
   - **MCP Tools for Agents**: Expose `list_documentation` and `get_documentation` tools so AI agents can autonomously discover, inspect, and retrieve guidance during multi-step evaluation workflows.
   - **Single-Source File Reading**: Share the underlying documentation reading logic between resource callbacks and tool handlers to avoid duplicate file I/O.

2. **3-Tool Decoupled Domain Evaluation Pipeline**:
   - `query_gde_activities`: Handles Advocu authentication, client-side 30 req/min rate limiting, automatic pagination across historical records, and tag/date/category filtering.
   - `assess_gde_category_readiness`: Evaluates empirical cadence across trailing periods, weights reach metrics (treating 100+ attendee regional meetups alongside major conferences), detects active cooling-off period risks, and deterministically maps 100% of candidate activities to target category pillars.
   - `generate_gde_category_report`: Serves as a pure, deterministic Markdown renderer that consumes structured assessment results and outputs the 3-section Evidence Dossier (Candidate Header, 12-Month Activity Profile Table, Criteria-Mapped Activities).

3. **Stdio Server & Registration Integration Pattern**:
   - Centralize MCP registration in `src/server.ts`, instantiating `McpServer` and binding tool handlers and resource providers to `StdioServerTransport`.
   - Enforce runtime parameter validation at the tool boundary using Zod schemas.
   - Transform runtime and upstream errors into standardized `McpError` instances with explicit error codes.
   - Maintain stdio stream safety by forbidding `console.log` on standard output (enforced via Biome `noConsole`), ensuring `stdout` remains strictly reserved for JSON-RPC framing.

4. **Exhaustive Activity Mapping over Curated Subsets**:
   - Map and render 100% of logged qualifying activities under their respective criteria pillars rather than truncating to an arbitrary curated subset, allowing the candidate's complete body of work to speak for itself.

5. **Qualitative Empirical Guidance over Arbitrary Numeric Quotas**:
   - `data/docs/empirical-readiness-guide.md` explicitly avoids rigid numerical thresholds (e.g., "must have 15 talks"), recognizing that GDE evaluations are regional, multi-year, and holistic.
   - Recognizes high-density regional meetups (100+ attendees in Asia and emerging tech hubs) with substantial reach alongside global conferences.
   - Incorporates peer review, GDE mentoring, and Googler endorsement workflows into the pre-submission preparation.

6. **Client-Side Rate Limiting & Auto-Pagination**:
   - Implement an internal pacing throttle (maximum 30 requests/minute) and automatic pagination in `AdvocuService` to comply with Advocu's rate limits and handle HTTP 429 backoff gracefully.

7. **Zero-Dependency Native Subpath Imports (`#/*`)**:
   - Standardize all cross-directory imports on Node.js 24 native `#/*` subpath imports (`package.json` `"imports"` and `tsconfig.json` `"paths"`), eliminating external path-rewriting tools and maintaining a 0-vulnerability dependency tree.
