const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldHandleDeleteAdmin = /const handleDeleteAdmin = \(id: string\) => \{[\s\S]*?localStorage\.setItem\('app_area_admins', JSON\.stringify\(updatedAdmins\)\);\n    \}\n  \};/;
const newHandleDeleteAdmin = `const handleDeleteAdmin = (targetId: string) => {
    if (window.confirm("Are you sure you want to delete this Area Admin?")) {
      const saved = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
      const updated = saved.filter((admin: any) => String(admin.id) !== String(targetId));
      localStorage.setItem('app_area_admins', JSON.stringify(updated));
      setAreaAdmins(updated);
    }
  };`;

if (oldHandleDeleteAdmin.test(code)) {
    code = code.replace(oldHandleDeleteAdmin, newHandleDeleteAdmin);
    console.log("Patched handleDeleteAdmin successfully.");
} else {
    console.log("Regex for handleDeleteAdmin failed.");
}

const oldButton = /<button\s+onClick=\{\(\) => handleDeleteAdmin\(admin\.id\)\}\s+className="flex-1 sm:flex-none flex items-center justify-center gap-1\.5 px-3 py-2 bg-white border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"\s*>\s*🗑️ Delete\s*<\/button>/;

const newButton = `<button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAdmin(admin.id);
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                            >
                              🗑️ Delete
                            </button>`;

if (oldButton.test(code)) {
    code = code.replace(oldButton, newButton);
    console.log("Patched button successfully.");
} else {
    console.log("Regex for button failed.");
}

fs.writeFileSync('src/components/Admin.tsx', code);
