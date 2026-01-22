# NPX Installer Design for documentation-skills

## Overview

Add an npx-installable CLI that lets users install the docs-with-mermaid skill interactively.

**Command:** `npx documentation-skills`

## Package Structure

```
claude-code-documentation-skill/
├── package.json
├── bin/
│   └── cli.js              # Interactive installer
├── skills/
│   └── docs-with-mermaid/
│       ├── SKILL.md
│       ├── mermaid-reference.md
│       └── examples.md
├── LICENSE
└── README.md               # Updated with npx instructions
```

## CLI Flow

```
$ npx documentation-skills

┌  documentation-skills
│
◆  Where would you like to install?
│  ● Global (~/.claude/skills/) - Available in all projects
│  ○ Local (./.claude/skills/) - This project only
│
◇  Skill already exists. Overwrite?  (if applicable)
│  Yes
│
◇  Installing docs-with-mermaid skill...
│
└  Done!

Next steps:
  1. Open Claude Code
  2. Use /docs-with-mermaid or ask Claude to document something
```

## package.json

```json
{
  "name": "documentation-skills",
  "version": "1.0.0",
  "description": "Claude Code skill for technical documentation with Mermaid diagrams",
  "type": "module",
  "bin": {
    "documentation-skills": "./bin/cli.js"
  },
  "files": [
    "bin",
    "skills"
  ],
  "keywords": ["claude", "claude-code", "mermaid", "documentation", "skill"],
  "license": "MIT",
  "dependencies": {
    "@clack/prompts": "^0.7.0"
  }
}
```

## CLI Script (bin/cli.js)

```javascript
#!/usr/bin/env node

import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_NAME = 'docs-with-mermaid';

async function main() {
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

  // Check if exists
  if (fs.existsSync(targetDir)) {
    const overwrite = await p.confirm({
      message: 'Skill already exists. Overwrite?',
    });
    if (!overwrite || p.isCancel(overwrite)) {
      p.cancel('Installation cancelled.');
      process.exit(0);
    }
  }

  // Copy files
  const spinner = p.spinner();
  spinner.start('Installing skill...');

  const sourceDir = path.join(__dirname, '..', 'skills', SKILL_NAME);
  fs.mkdirSync(targetDir, { recursive: true });
  copyDir(sourceDir, targetDir);

  spinner.stop('Skill installed!');

  p.outro(`Done! Use /docs-with-mermaid in Claude Code`);
}

function copyDir(src, dest) {
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch(console.error);
```

## Changes Required

1. **Create** `package.json` in project root
2. **Create** `bin/cli.js` with installer script
3. **Move** skill files from `.claude/skills/docs-with-mermaid/` to `skills/docs-with-mermaid/`
4. **Update** `README.md` with new installation instructions
5. **Test** locally with `npm link` before publishing
6. **Publish** to npm with `npm publish`

## Publishing Steps

```bash
# Test locally first
npm link
documentation-skills

# When ready to publish
npm login
npm publish
```
