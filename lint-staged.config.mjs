export default {
  '*.{ts,js,mjs}': ['cspell', 'biome check --write --no-errors-on-unmatched'],
  '*.{json,md}': ['biome format --write --no-errors-on-unmatched'],
};
