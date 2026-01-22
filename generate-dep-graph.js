// This script generates a visual dependency graph for the project using dependency-cruiser and outputs it as an SVG file.
// Run this script with: node generate-dep-graph.cjs

const { execSync } = require('child_process');
const path = require('path');

try {
  // Install dependency-cruiser if not installed
  execSync('npm install --no-save dependency-cruiser', { stdio: 'inherit' });

  // Generate the dependency graph as SVG
  execSync('npx depcruise --include-only "^src" --output-type dot src | npx dot -T svg -o dependency-graph.svg', { stdio: 'inherit' });

  console.log('Dependency graph generated: dependency-graph.svg');
} catch (error) {
  console.error('Error generating dependency graph:', error);
}
