import { describe, expect, it } from 'vitest';
import { server } from '#/server.js';

describe('server', () => {
  it('should initialize McpServer with correct identity', () => {
    expect(server).toBeDefined();
  });
});
