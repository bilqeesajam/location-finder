const fs = require('fs');

console.log('🔍 Checking ALL required files exist...\n');

// ALL FILES FROM YOUR LIST - MUST EXIST
const allRequiredFiles = [
  // GitHub templates
  '.github/ISSUE_TEMPLATE/feature-ticket.md',
  '.github/ISSUE_TEMPLATE/testing-qa.md',
  '.github/ISSUE_TEMPLATE/bug-report.md',
  '.github/ISSUE_TEMPLATE/pull_request_template.md',
  
  // Public assets
  'public/favicon.ico',
  'public/placeholder.svg',
  'public/robots.txt',
  
  // Map components
  'src/components/map/AddLocationForm.tsx',
  'src/components/map/LocationPopup.tsx',
  'src/components/map/MapControls.tsx',
  'src/components/map/MapView.tsx',
  
  // UI components (ALL shadcn files)
  'src/components/ui/accordion.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/alert.tsx',
  'src/components/ui/aspect-ratio.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/checkbox.tsx',
  'src/components/ui/collapsible.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/drawer.tsx',
  'src/components/ui/dropdown-menu.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/hover-card.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/popover.tsx',
  'src/components/ui/progress.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/resizable.tsx',
  'src/components/ui/scroll-area.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/separator.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/skeleton.tsx',
  'src/components/ui/slider.tsx',
  'src/components/ui/sonner.tsx',
  'src/components/ui/switch.tsx',
  'src/components/ui/table.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/ui/toast.tsx',
  'src/components/ui/toaster.tsx',
  'src/components/ui/toggle-group.tsx',
  'src/components/ui/toggle.tsx',
  'src/components/ui/tooltip.tsx',
  'src/components/ui/use-toast.ts',
  
  // Core components
  'src/components/AdminDashboard.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/NavLink.tsx',
  'src/components/Sidebar.tsx',
  
  // Hooks
  'src/hooks/use-mobile.tsx',
  'src/hooks/use-toast.ts',
  'src/hooks/useAuth.ts',
  'src/hooks/useLiveLocations.ts',
  'src/hooks/useLocations.ts',
  'src/hooks/useMap.ts',
  
  // Supabase integration
  'src/integrations/supabase/client.ts',
  'src/integrations/supabase/types.ts',
  
  // Pages
  'src/pages/Admin.tsx',
  'src/pages/Auth.tsx',
  'src/pages/Index.tsx',
  'src/pages/NotFound.tsx',
  
  // Services
  'src/services/api/authApi.ts',
  'src/services/api/baseApi.ts',
  'src/services/api/index.ts',
  'src/services/api/liveLocationsApi.ts',
  'src/services/index.ts',
  'src/services/types.ts',
  
  // Test files
  'src/test/example.test.ts',
  'src/test/setup.ts',
  
  // App files
  'src/App.css',
  'src/App.tsx',
  'src/index.css',
  'src/main.tsx',
  'src/vite-env.d.ts',
  
  // Supabase functions
  'supabase/functions/auth/index.ts',
  'supabase/functions/get-maptiler-key/index.ts',
  'supabase/functions/live-locations/index.ts',
  'supabase/functions/locations/index.ts',
  
  // Supabase migrations
  'supabase/migrations/20260128104851_8413118f-ac74-4c37-bc6f-2a12ebac40c5.sql',
  
  // Supabase config
  'supabase/config.toml',
  
  // Environment
  '.env',
  
  // Git
  '.gitignore',
  
  // Package management
  'bun.lockb',
  'package-lock.json',
  'package.json',
  
  // Config files
  'components.json',
  'eslint.config.js',
  'index.html',
  'postcss.config.js',
  'README.md',
  'tailwind.config.ts',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'vitest.config.ts'
];

// Check EVERY file exists
let missingFiles = [];
let existingFiles = 0;

allRequiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    existingFiles++;
  } else {
    missingFiles.push(file);
  }
});

// Report results
console.log(`📊 Files checked: ${allRequiredFiles.length}`);
console.log(`✅ Files found: ${existingFiles}`);

if (missingFiles.length > 0) {
  console.log(`❌ Files missing: ${missingFiles.length}\n`);
  
  // Group missing files by category
  const categories = {
    'GitHub Templates': missingFiles.filter(f => f.includes('.github/')),
    'Public Assets': missingFiles.filter(f => f.includes('public/')),
    'Map Components': missingFiles.filter(f => f.includes('components/map/')),
    'UI Components': missingFiles.filter(f => f.includes('components/ui/')),
    'Core Components': missingFiles.filter(f => f.includes('components/') && !f.includes('ui/') && !f.includes('map/')),
    'Hooks': missingFiles.filter(f => f.includes('hooks/')),
    'Supabase Integration': missingFiles.filter(f => f.includes('integrations/')),
    'Pages': missingFiles.filter(f => f.includes('pages/')),
    'Services': missingFiles.filter(f => f.includes('services/')),
    'Test Files': missingFiles.filter(f => f.includes('test/')),
    'App Files': missingFiles.filter(f => f.startsWith('src/') && !f.includes('components/') && !f.includes('hooks/') && !f.includes('integrations/') && !f.includes('pages/') && !f.includes('services/') && !f.includes('test/')),
    'Supabase Backend': missingFiles.filter(f => f.includes('supabase/')),
    'Config Files': missingFiles.filter(f => !f.includes('src/') && !f.includes('public/') && !f.includes('.github/') && !f.includes('supabase/'))
  };
  
  // Show missing files by category
  Object.entries(categories).forEach(([category, files]) => {
    if (files.length > 0) {
      console.log(`📁 ${category}:`);
      files.forEach(file => {
        console.log(`   ❌ ${file.replace(`${category.toLowerCase().replace(' ', '/')}/`, '')}`);
      });
      console.log('');
    }
  });
  
  console.log('🚨 All files from the template must exist!');
  process.exit(1);
}

console.log('\n🎉 SUCCESS: All template files are present!\n');

// Quick tech stack verification
console.log('🔧 Verifying tech stack...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for key technologies
  const techStack = {
    'React': deps.react,
    'TypeScript': deps.typescript,
    'Tailwind CSS': deps.tailwindcss,
    'Supabase': deps['@supabase/supabase-js'],
    'Vite': deps.vite,
    'shadcn/ui': Object.keys(deps).some(k => k.includes('@radix-ui'))
  };
  
  console.log('✅ Tech stack confirmed:');
  Object.entries(techStack).forEach(([tech, present]) => {
    console.log(`   ${present ? '✓' : '⚠'} ${tech}`);
  });
  
  // Count file types
  const countFilesByExtension = (dir, ext) => {
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      return files.filter(f => typeof f === 'string' && f.endsWith(ext)).length;
    } catch {
      return 0;
    }
  };
  
  console.log('\n📁 File type summary:');
  console.log(`   TypeScript (.ts/.tsx): ${countFilesByExtension('src', '.ts') + countFilesByExtension('src', '.tsx')}`);
  console.log(`   JavaScript/JSX (.js/.jsx): ${countFilesByExtension('src', '.js') + countFilesByExtension('src', '.jsx')}`);
  console.log(`   Supabase Functions: ${countFilesByExtension('supabase/functions', '.ts')}`);
  
} catch (error) {
  console.error('⚠️  Could not analyze package.json:', error.message);
}

console.log('\n🚀 Project is ready for CI/CD testing!');
console.log('💡 Files can be modified, but must not be deleted');