#!/usr/bin/env node

import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_NAME = 'docs-with-mermaid';

async function main() {
  console.log('');
  p.intro('documentation-skills');

  const location = await p.select({
    message: 'Where would you like to install?',
    options: [
      { value: 'global', label: 'Global (~/.claude/skills/)', hint: 'Available in all projects' },
      { value: 'local', label: 'Local (./.claude/skills/)', hint: 'This project only' },
    ],
  });

  if (p.isCancel(location)) {
    p.cancel('Installation cancelled.');
    process.exit(0);
  }

  const targetDir = location === 'global'
    ? path.join(process.env.HOME, '.claude', 'skills', SKILL_NAME)
    : path.join(process.cwd(), '.claude', 'skills', SKILL_NAME);

  // Check if skill already exists
  if (fs.existsSync(targetDir)) {
    const overwrite = await p.confirm({
      message: 'Skill already exists. Overwrite?',
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Installation cancelled.');
      process.exit(0);
    }

    // Remove existing directory
    fs.rmSync(targetDir, { recursive: true });
  }

  // Copy files
  const spinner = p.spinner();
  spinner.start('Installing skill...');

  try {
    const sourceDir = path.join(__dirname, '..', 'skills', SKILL_NAME);

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy all files
    copyDir(sourceDir, targetDir);

    spinner.stop('Skill installed!');

    p.note(
      `Use /docs-with-mermaid in Claude Code\nor ask Claude to document something`,
      'Next steps'
    );

    p.outro('Happy documenting!');
  } catch (error) {
    spinner.stop('Installation failed.');
    p.log.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function copyDir(src, dest) {
  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
