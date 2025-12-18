#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Building Flush Framework Documentation...');

try {
  // Build with VitePress
  console.log('📦 Running VitePress build...');
  execSync('vitepress build', { stdio: 'inherit' });
  
  // Verify build output exists
  const buildDir = '.vitepress/dist';
  if (!existsSync(buildDir)) {
    throw new Error(`Build directory ${buildDir} not found`);
  }
  
  console.log('✅ Build completed successfully!');
  console.log(`📁 Output directory: ${buildDir}`);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}