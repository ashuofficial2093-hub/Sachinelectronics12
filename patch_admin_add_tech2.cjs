const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const techAppTabCode = `              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Technician Applications
              </h2>`;

const newTechAppTabCode = `              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Technician Applications
                </h2>
                <button 
                  onClick={() => setNewTechModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm w-fit"
                >
                  + Add New Technician
                </button>
              </div>`;

if (code.includes(techAppTabCode) && !code.includes('+ Add New Technician')) {
  code = code.replace(techAppTabCode, newTechAppTabCode);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched Add New Technician Button');
} else {
  console.log('Button already patched or not found');
}
