const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldHeader = `              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Area Admins</h2>
                <p className="text-sm text-slate-500">Create and manage regional administrators.</p>
              </div>
              <button 
                onClick={() => setAaModal({ isOpen: true, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true })}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Add New Area Admin
              </button>
            </div>`;

const newHeader = `              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Area Admins</h2>
                <p className="text-sm text-slate-500">Create and manage regional administrators.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.confirm("WARNING: This will delete ALL data from localStorage and reset the app. Are you sure?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                  ⚠️ Reset App
                </button>
                <button 
                  onClick={() => setAaModal({ isOpen: true, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  + Add New Area Admin
                </button>
              </div>
            </div>`;

if (code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
    console.log("Patched reset button successfully.");
} else {
    console.log("Failed to patch reset button.");
}

const oldHandleDelete = `  const handleDeleteAdmin = (idToDelete: string) => {
    console.log("Attempting to delete ID:", idToDelete);
    setAreaAdmins((prevAdmins: any[]) => {
      const updatedList = prevAdmins.filter((admin: any) => String(admin.id) !== String(idToDelete));
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
  };`;

const newHandleDelete = `  const handleDeleteById = (idToDelete: string) => {
    console.log("Attempting to delete ID:", idToDelete);
    setAreaAdmins((prev) => {
      const updatedList = prev.filter((admin: any) => String(admin.id) !== String(idToDelete));
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
  };`;

if (code.includes(oldHandleDelete)) {
    code = code.replace(oldHandleDelete, newHandleDelete);
    console.log("Patched handleDeleteAdmin successfully.");
} else {
    console.log("Failed to patch handleDeleteAdmin.");
}

const oldDeleteBtn = `                                if (window.confirm("Are you sure you want to delete this Area Admin?")) {
                                  handleDeleteAdmin(admin.id);
                                }`;

const newDeleteBtn = `                                if (window.confirm("Are you sure you want to delete this Area Admin?")) {
                                  handleDeleteById(admin.id);
                                }`;

if (code.includes(oldDeleteBtn)) {
    code = code.replace(oldDeleteBtn, newDeleteBtn);
    console.log("Patched delete button successfully.");
} else {
    console.log("Failed to patch delete button.");
}

fs.writeFileSync('src/components/Admin.tsx', code);
