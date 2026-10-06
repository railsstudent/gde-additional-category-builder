# 0001: MCP Server & Plugin Architecture

## Context & Decision

We are building an open-source plugin packaging an MCP server, a Skill, and an Agent for evaluating GDE Additional Category applications.

We decided to:

1. **Runtime & Transport**: Use Node.js ESM and `@modelcontextprotocol/server` (v2.x) with `zod` over `stdio` transport, eliminating legacy v1 monolithic SDK debt.
2. **Bundled Documentation**: Bundle verified Markdown guidebooks (`list_documentation`, `get_documentation`) for categories and best practices since Advocu has no category discovery API.
3. **Empirical Activity Profiling**: Provide factual activity aggregations and gap analysis rather than claiming official Google scoring rubrics, which are confidential.
4. **Code Quality**: Use Biome for sub-100ms linting and formatting, forbidding `console.log` on stdio paths, enforcing max 3 function parameters, and requiring explicit `McpError` handling.
5. **Testing**: Use Vitest with colocated `*.spec.ts` files, mocking `fetch` for Advocu API calls and asserting `McpError` responses for tools.
6. **Security & Tracking**: Maintain zero secrets in the public repository, isolating credentials in `.env`, while keeping `.scratch/` tracked in Git for local issue tracking and specs.
