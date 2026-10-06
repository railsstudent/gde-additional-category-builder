import { defineConfig } from 'cspell';

export default defineConfig({
  version: '0.2',
  ignoreWords: [
    'advocu',
    'filenaming',
    'fugu',
    'googler',
    'googlers',
    'keras',
    'leung',
    'modelcontextprotocol',
    'stdio',
    'wayfinder',
    'wayfinding',
    'worktrees',
  ],
  ignorePaths: ['node_modules', 'dist', 'coverage', '.git', '.vscode', '.idea', '*.spec.ts', 'skills-lock.json'],
});
