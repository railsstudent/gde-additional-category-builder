# Specification: GDE Additional Category Builder MCP Server & Documentation Engine

## Problem Statement

Existing Google Developer Experts (GDEs) who wish to apply for an Additional Category specialization face significant friction when gathering, evaluating, and presenting their contributions:

1. **Scattered Activity History**: Qualifying activities (conference talks, high-density meetups, technical deep-dives, open source, workshops) are logged in Advocu over multiple years, making manual discovery and aggregation tedious.
2. **Opaque and Fragmented Program Knowledge**: Program requirements, recognized categories, and cooling-off period risks are not centralized in a readable, offline-accessible format for AI agents or candidates.
3. **Subjective Preparation & Uncertainty**: Candidates lack a deterministic way to assess their empirical activity cadence, map their entire body of work against target category criteria, and identify potential cooling-off period risks before reaching out to Regional Leads.
4. **Friction in Evidence Presentation**: Regional Leads and Googlers have limited review time and require a concise, high-signal, and easy-to-share Evidence Dossier that highlights total volume and verified reach without administrative noise.

---

## Solution

A Model Context Protocol (MCP) server running over `stdio` that provides an end-to-end evaluation and dossier generation pipeline:

1. **Bundled Documentation Engine**: Serves static, offline-capable Markdown guides for official Categories/Sub-categories, empirical readiness principles, cooling-off policies, and peer endorsement workflows (accessible both as interactive tools for AI agents and as discoverable reference resources for host applications).
2. **Advocu Activity Retrieval**: Authenticates against the Advocu API, auto-paginates across candidate history, applies keyword/tag/date filters, and respects the 30 req/min API rate limit.
3. **Deterministic Readiness Assessment**: Maps 100% of candidate activities to category criteria, assesses trailing activity cadence, and warns against active cooling-off period violations.
4. **High-Signal Evidence Dossier Generator**: Renders a clean, shareable Markdown document (Candidate Header, 12-Month Empirical Profile Table, Exhaustive Criteria-Mapped Qualifying Contributions) ready to share with GDE peers, Regional Leads, and Googlers.

---

## User Stories

1. As an existing GDE, I want to query the available GDE Categories and Sub-categories from the MCP server, so that I can explore valid specialization areas recognized by the program.
2. As an existing GDE, I want to retrieve bundled reference guides on empirical readiness and cooling-off policies, so that I can understand program expectations without needing an active internet connection.
3. As an existing GDE, I want the server to authenticate securely with Advocu using an environment variable, so that my personal API credentials are never hardcoded or leaked.
4. As an existing GDE, I want the server to fall back to default Advocu endpoints and local documentation directories when custom URLs are omitted, so that zero-configuration local runs work effortlessly.
5. As an existing GDE, I want to search and query my logged Advocu activities by category, tag, date range, or keyword, so that I can retrieve all relevant contributions in my target domain.
6. As an existing GDE, I want the activity retrieval service to handle pagination automatically under the hood, so that I receive all matching historical records without missing older activities.
7. As an existing GDE, I want the Advocu client to enforce rate-limiting protections (30 requests per minute), so that batch activity fetching never triggers HTTP 429 errors or account throttling.
8. As an existing GDE, I want to evaluate my logged activities deterministically against target category criteria, so that I know my empirical consistency before contacting Google.
9. As an existing GDE, I want the readiness assessment tool to map all of my logged qualifying activities to category criteria pillars, so that reviewers see the full volume and breadth of my work.
10. As an existing GDE, I want the readiness assessment tool to evaluate both conference talks and high-density community meetups (e.g. 100+ attendees), so that significant regional community reach is properly represented.
11. As an existing GDE, I want the readiness assessment tool to analyze my trailing 12-month activity cadence, so that I know if I have sustained ongoing contributions in the target domain.
12. As an existing GDE, I want the readiness assessment tool to check and warn about active cooling-off periods, so that I avoid premature resubmissions that lead to immediate administrative rejection.
13. As an existing GDE, I want to generate a clean, shareable Markdown Evidence Dossier without boilerplate sign-offs, so that I can easily send it to peer GDEs and Regional Leads for review.
14. As an existing GDE, I want the generated Evidence Dossier to contain a concise Candidate Header and 12-Month Activity Profile summary table, so that Regional Leads can immediately assess my overall reach and distribution.
15. As an existing GDE, I want the Evidence Dossier to display an exhaustive inventory of qualifying activities under each category criterion, so that the evidence speaks for itself.

---

## Functional Capabilities

### 1. Environment & Configuration Surface

- The server loads configuration from standard environment variables with sensible defaults:
  - `ADVOCU_API_KEY`: Required string for Advocu API calls. If missing when invoking activity tools, an informative `McpError` (`InvalidRequest`) is returned.
  - `ADVOCU_BASE_URL`: Optional string, defaults to `https://api.advocu.com/personal-api/v1/gde`.
  - `DOCS_PATH`: Optional string, defaults to `./data/docs`.

### 2. Five Decoupled MCP Tool Contracts

The MCP server exposes five specialized tools:

1. `list_documentation`: Lists available guide titles, slugs, and summaries. Takes no required parameters.
2. `get_documentation`: Accepts a `slug` parameter (e.g., `categories-and-subcategories`, `empirical-readiness-guide`, `cooling-off-policy`, `application-workflow`) and returns full Markdown content.
3. `query_gde_activities`: Accepts optional filtering options (`category`, `subCategory`, `since`, `until`, `tags`, `keyword`, `activityTypes`, `limit`). Transparently paginates, enforces rate limits, and returns a structured array of normalized activity records.
4. `assess_gde_category_readiness`: Accepts candidate activities and target category. Maps 100% of activities to criteria pillars, evaluates cadence and reach, checks cooling-off status, and outputs a typed `ActivityAssessmentResult` containing confidence levels, criteria mappings, and identified gaps.
5. `generate_gde_category_report`: Accepts the structured `ActivityAssessmentResult` (or candidate profile) and returns the rendered 3-section Markdown Evidence Dossier (Header, Profile Table, Criteria-Mapped Activities).

### 3. Advocu Client & Rate-Limiting Engine

- Uses global native Node.js `fetch` (Node 24).
- Paginates through Advocu activity collections automatically.
- Enforces an internal pacing throttle (maximum 30 requests/minute) with retry on HTTP 429.

### 4. Bundled Markdown Documentation Library (`data/docs/`)

- Four bundled guides:
  - `categories-and-subcategories.md`: Matrix of official GDE Categories and recognized Sub-categories.
  - `empirical-readiness-guide.md`: Qualitative community guidance covering sustained multi-year cadence, technical depth, high-density regional meetups vs conferences, peer review, and Googler endorsement strategies (zero arbitrary numeric cutoffs).
  - `cooling-off-policy.md`: Rationale, rules, and recommended actions during the reapplication cooldown window.
  - `application-workflow.md`: Concise submission guide for connecting with Regional Leads.

### 5. Client Integration & MCP Stdio Transport

- The server communicates strictly over standard `stdio` JSON-RPC transport via `@modelcontextprotocol/server`.
- The MCP tools are natively client-agnostic and integrate seamlessly with `antigravity-cli`, Claude Desktop, Cursor, or any standard MCP host.
- The companion Antigravity Skill (`skills/` / `agents/`) provides prompt-level orchestration to guide candidates through the evaluation workflow interactively.

---

## Verification Seams

### 1. External Behavioral Testing at Public Seams

- Tests will strictly target public module seams (`src/tools/` and `src/services/`) without coupling to private implementation internals.
- All tests will use Vitest running against colocated `.spec.ts` files.

### 2. Verification Modules & Seam Contracts

- **Documentation Seam (`list_documentation`, `get_documentation`)**: Verify that available slugs are discovered and valid markdown content is served; verify error handling on non-existent slugs.
- **Advocu Service Seam (`query_gde_activities`)**: Verify API request construction, Bearer authentication headers, transparent pagination accumulation, keyword filtering, and rate-limit throttle handling via mocked `fetch` responses.
- **Readiness Assessment Seam (`assess_gde_category_readiness`)**: Verify deterministic mapping of 100% of input activities to category criteria, cadence analysis, and cooling-off period flag detection.
- **Dossier Generation Seam (`generate_gde_category_report`)**: Verify that the generated Markdown contains exact expected sections (Header, Profile Table, Criteria Mapping) and properly formats activity reach metrics.
- **MCP Server Stdio Seam (`src/server.ts`)**: Verify MCP tool registration and JSON-RPC stdio protocol initialization.

---

## Out of Scope

1. Direct submission or writing to the Advocu API (this tool is strictly read-only for candidate evaluation).
2. Automating Google internal candidate review portals or sending emails directly to Googlers.
3. Real-time web scraping of external conference websites or social media platforms.
4. Publishing to the public npm registry (`"private": true` is enforced).
5. Proprietary, non-standard client protocols or custom client GUI plugins (the server adheres strictly to open MCP stdio transport).

---

## Further Notes

- All cross-directory imports use Node's native `#/*` subpath aliases.
- Stdio stream safety is mechanically enforced via Biome `noConsole` (only `console.error` and `console.warn` allowed for debug logs; `process.stdout` is strictly reserved for MCP JSON-RPC).
