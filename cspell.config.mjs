import { defineConfig } from 'cspell';

export default defineConfig({
	version: '0.2',
	ignoreWords: ['advocu', 'leung', 'wayfinder', 'wayfinding'],
	ignorePaths: ['node_modules', 'dist', 'coverage', '.git', '.vscode', '.idea', '*.spec.ts', 'skills-lock.json'],
});
