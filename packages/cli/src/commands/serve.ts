import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

export async function serve(options: { port: string; host: string }) {
  const { port, host } = options;
  
  console.log(chalk.blue('🚀 Starting Flush development server...'));
  
  // Look for main application file
  const possibleEntries = ['src/index.ts', 'src/app.ts', 'index.ts', 'app.ts'];
  let entryFile = null;
  
  for (const entry of possibleEntries) {
    if (existsSync(entry)) {
      entryFile = entry;
      break;
    }
  }
  
  if (!entryFile) {
    console.error(chalk.red('❌ No entry file found. Expected one of:'));
    possibleEntries.forEach(file => console.log(chalk.gray(`   - ${file}`)));
    process.exit(1);
  }
  
  console.log(chalk.green(`📁 Using entry file: ${entryFile}`));
  console.log(chalk.green(`🌐 Server will start on http://${host}:${port}`));
  
  // Start bun with watch mode
  const bunProcess = spawn('bun', ['run', '--watch', entryFile], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port,
      HOST: host,
      NODE_ENV: 'development'
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down server...'));
    bunProcess.kill('SIGINT');
    process.exit(0);
  });
  
  bunProcess.on('error', (error) => {
    console.error(chalk.red('❌ Failed to start server:'), error.message);
    process.exit(1);
  });
}