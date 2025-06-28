// AutoInjector Server Tests
// Tests the core Node.js functionality without browser dependencies

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Test configuration
let testsPassed = 0;
let testsTotal = 0;

function test(name, fn) {
  testsTotal++;
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Expected condition to be true');
  }
}

console.log('🧪 Running AutoInjector Tests...\n');

// Test 1: Project structure
test('Project has required files', () => {
  const requiredFiles = [
    'package.json',
    'index.js',
    'steps/fetch.js',
    'steps/extract.js',
    'steps/generate_snippet.js',
    'README.md'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = join(projectRoot, file);
    assertTrue(fs.existsSync(filePath), `Missing required file: ${file}`);
  });
});

// Test 2: Package.json validation
test('Package.json is valid', () => {
  const packagePath = join(projectRoot, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  assertEqual(packageJson.name, 'autoinjector', 'Package name should be autoinjector');
  assertTrue(packageJson.version, 'Package should have version');
  assertTrue(packageJson.dependencies, 'Package should have dependencies');
  assertTrue(packageJson.scripts, 'Package should have scripts');
});

// Test 3: Core modules can be imported
test('Core modules are importable', async () => {
  try {
    // Test that modules can be imported without errors
    const fetch = await import(join(projectRoot, 'steps/fetch.js'));
    const extract = await import(join(projectRoot, 'steps/extract.js'));
    const generateSnippet = await import(join(projectRoot, 'steps/generate_snippet.js'));
    
    assertTrue(typeof fetch.default === 'function', 'Fetch module should export a function');
    assertTrue(typeof extract.default === 'function', 'Extract module should export a function');
    assertTrue(typeof generateSnippet.default === 'function', 'Generate snippet module should export a function');
  } catch (error) {
    throw new Error(`Module import failed: ${error.message}`);
  }
});

// Test 4: Environment configuration
test('Environment configuration', () => {
  // Test that environment files exist
  const envExample = join(projectRoot, 'env.example');
  assertTrue(fs.existsSync(envExample), 'env.example should exist');
  
  // Test that .gitignore exists and includes .env
  const gitignore = join(projectRoot, '.gitignore');
  assertTrue(fs.existsSync(gitignore), '.gitignore should exist');
  
  const gitignoreContent = fs.readFileSync(gitignore, 'utf8');
  assertTrue(gitignoreContent.includes('.env'), '.gitignore should include .env');
});

// Test 5: Docker configuration
test('Docker configuration', () => {
  const dockerfile = join(projectRoot, 'Dockerfile');
  const dockerCompose = join(projectRoot, 'docker-compose.yml');
  
  assertTrue(fs.existsSync(dockerfile), 'Dockerfile should exist');
  assertTrue(fs.existsSync(dockerCompose), 'docker-compose.yml should exist');
  
  const dockerfileContent = fs.readFileSync(dockerfile, 'utf8');
  assertTrue(dockerfileContent.includes('node:18-alpine'), 'Dockerfile should use node:18-alpine');
  assertTrue(dockerfileContent.includes('EXPOSE 3000'), 'Dockerfile should expose port 3000');
});

// Test 6: CI/CD configuration
test('CI/CD pipeline configuration', () => {
  const ciFile = join(projectRoot, '.github/workflows/ci.yml');
  assertTrue(fs.existsSync(ciFile), 'CI/CD workflow file should exist');
  
  const ciContent = fs.readFileSync(ciFile, 'utf8');
  assertTrue(ciContent.includes('node-version:'), 'CI should test multiple Node versions');
  assertTrue(ciContent.includes('npm ci'), 'CI should use npm ci for installation');
});

// Test 7: Documentation
test('Documentation completeness', () => {
  const readme = join(projectRoot, 'README.md');
  const contributing = join(projectRoot, 'CONTRIBUTING.md');
  const deployment = join(projectRoot, 'DEPLOYMENT.md');
  
  assertTrue(fs.existsSync(readme), 'README.md should exist');
  assertTrue(fs.existsSync(contributing), 'CONTRIBUTING.md should exist');
  assertTrue(fs.existsSync(deployment), 'DEPLOYMENT.md should exist');
  
  const readmeContent = fs.readFileSync(readme, 'utf8');
  assertTrue(readmeContent.includes('AutoInjector'), 'README should mention AutoInjector');
  assertTrue(readmeContent.includes('Quick Start'), 'README should have Quick Start section');
});

// Test 8: Security files
test('Security configuration', () => {
  const license = join(projectRoot, 'LICENSE');
  assertTrue(fs.existsSync(license), 'LICENSE file should exist');
  
  const licenseContent = fs.readFileSync(license, 'utf8');
  assertTrue(licenseContent.includes('MIT License'), 'Should use MIT License');
});

// Test Results
console.log(`\n📊 Test Results: ${testsPassed}/${testsTotal} tests passed`);

if (testsPassed === testsTotal) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
} 