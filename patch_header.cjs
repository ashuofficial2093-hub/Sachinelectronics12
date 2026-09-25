const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// The original buttons to replace:
const target = `<div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={() => { window.location.hash = ''; window.location.reload(); }} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-2 rounded-md transition-colors">
                <span className="hidden sm:inline">🏠 Home Page</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-2 rounded-md transition-colors">
                <span className="hidden sm:inline">🚪 Logout / Exit</span>
              </button>
            </div>`;

const replacement = `<div className="flex items-center gap-3 shrink-0">
              <button onClick={() => { window.location.hash = ''; window.location.reload(); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2">
                🏠 Home Page
              </button>
              <button onClick={() => { handleLogout(); window.location.hash = ''; window.location.reload(); }} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors flex items-center gap-2">
                🚪 Exit / Logout
              </button>
            </div>`;

if (code.includes('gap-2 sm:gap-4 shrink-0')) {
  // It might not exactly match due to whitespace.
  // We'll replace it using a broader regex or string replacement.
  code = code.replace(/<div className="flex items-center gap-2 sm:gap-4 shrink-0">[\s\S]*?<\/div>/, replacement);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched');
} else {
  console.log('Target not found');
}
