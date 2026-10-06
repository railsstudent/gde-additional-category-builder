import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';

export const server = new McpServer({
  name: 'gde-additional-category-builder',
  version: '0.0.1',
});

export async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GDE Additional Category Builder MCP Server running on stdio');
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error('Fatal server error:', error);
    process.exit(1);
  });
}
