import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_DIR = process.cwd();
const WEBSITE_DIR = path.join(WORKSPACE_DIR, 'artifacts/esaora-website');
const ADMIN_DIR = path.join(WORKSPACE_DIR, 'artifacts/esaora-admin');
const CORE_DIR = path.join(WORKSPACE_DIR, 'lib/esaora-core');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        await copyDir(srcPath, destPath);
      }
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function replaceInFiles(dir, match, replacement) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        await replaceInFiles(fullPath, match, replacement);
      }
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = await fs.readFile(fullPath, 'utf8');
      const updated = content.replaceAll(match, replacement);
      if (updated !== content) {
        await fs.writeFile(fullPath, updated, 'utf8');
      }
    }
  }
}

async function run() {
  console.log('1. Setting up @workspace/esaora-core...');
  await fs.mkdir(path.join(CORE_DIR, 'src/lib'), { recursive: true });
  await fs.mkdir(path.join(CORE_DIR, 'src/hooks'), { recursive: true });
  
  // Package JSON for core
  await fs.writeFile(path.join(CORE_DIR, 'package.json'), JSON.stringify({
    name: '@workspace/esaora-core',
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      './lib/*': './src/lib/*.ts',
      './hooks/*': './src/hooks/*.ts'
    },
    dependencies: {
      '@supabase/supabase-js': '^2.103.3'
    }
  }, null, 2));

  // TSConfig for core
  await fs.writeFile(path.join(CORE_DIR, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowJs: true,
      resolveJsonModule: true,
      declaration: true
    },
    include: ['src']
  }, null, 2));

  // Copy lib and hooks
  await copyDir(path.join(WEBSITE_DIR, 'src/lib'), path.join(CORE_DIR, 'src/lib'));
  await copyDir(path.join(WEBSITE_DIR, 'src/hooks'), path.join(CORE_DIR, 'src/hooks'));

  console.log('2. Copying completely to create artifacts/esaora-admin...');
  await copyDir(WEBSITE_DIR, ADMIN_DIR);

  console.log('3. Updating imports to use @workspace/esaora-core...');
  // Find replace imports
  const importReplacements = [
    { match: /'@\/lib\/supabase'/g, replace: "'@workspace/esaora-core/lib/supabase'" },
    { match: /'@\/lib\/auth'/g, replace: "'@workspace/esaora-core/lib/auth'" },
    { match: /'@\/lib\/database.types'/g, replace: "'@workspace/esaora-core/lib/database.types'" },
    { match: /'@\/hooks\/useAuth'/g, replace: "'@workspace/esaora-core/hooks/useAuth'" },
    { match: /'@\/hooks\/useArticles'/g, replace: "'@workspace/esaora-core/hooks/useArticles'" },
    { match: /'@\/hooks\/useData'/g, replace: "'@workspace/esaora-core/hooks/useData'" },
    { match: /'@\/hooks\/usePrograms'/g, replace: "'@workspace/esaora-core/hooks/usePrograms'" },
    { match: /'@\/hooks\/use-auth'/g, replace: "'@workspace/esaora-core/hooks/use-auth'" },
    { match: /from 'lucide-react'/g, replace: "from 'lucide-react'" } // just a placeholder
  ];

  for (const rep of importReplacements) {
    if (rep.match.source.includes('lucide')) continue;
    await replaceInFiles(path.join(WEBSITE_DIR, 'src'), rep.match, rep.replace);
    await replaceInFiles(path.join(ADMIN_DIR, 'src'), rep.match, rep.replace);
  }

  // Also remove lib and hooks from both since we moved them to core
  // Wait, some hooks like use-mobile or use-toast are ui specific maybe?
  console.log('Keeping UI hooks (toast, mobile) in src/hooks...');

  // Update package.jsons
  const webPkg = JSON.parse(await fs.readFile(path.join(WEBSITE_DIR, 'package.json'), 'utf8'));
  webPkg.dependencies['@workspace/esaora-core'] = 'workspace:*';
  await fs.writeFile(path.join(WEBSITE_DIR, 'package.json'), JSON.stringify(webPkg, null, 2));

  const adminPkg = JSON.parse(await fs.readFile(path.join(ADMIN_DIR, 'package.json'), 'utf8'));
  adminPkg.name = '@workspace/esaora-admin';
  adminPkg.dependencies['@workspace/esaora-core'] = 'workspace:*';
  await fs.writeFile(path.join(ADMIN_DIR, 'package.json'), JSON.stringify(adminPkg, null, 2));

  console.log('Done script.');
}

run().catch(console.error);
