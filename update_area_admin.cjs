const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

// Add Trash2 to imports
if (!code.includes('Trash2')) {
  code = code.replace(
    `import { LogOut, CheckCircle, Package, Users, Plus, FileTextIcon, MapPin, Search, Clock, CalendarIcon } from "lucide-react";`,
    `import { LogOut, CheckCircle, Package, Users, Plus, FileTextIcon, MapPin, Search, Clock, CalendarIcon, Trash2 } from "lucide-react";`
  );
}

// Add handleDeleteComplaint function
if (!code.includes('handleDeleteComplaint')) {
  const deleteFunc = `
  const handleDeleteComplaint = (id: string) => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      import('firebase/database').then(({ ref, remove }) => {
        remove(ref(rtdb, 'complaints/' + id)).then(() => {
          alert('Deleted successfully');
        }).catch(e => {
          console.warn('Error deleting complaint', e);
          alert('Failed to delete complaint');
        });
      });
    }
  };
`;
  code = code.replace(/  const handleAssignTech = /g, deleteFunc + "\n  const handleAssignTech = ");
}

// Add delete button inside the "Actions" cell (td at the end)
// The last td is around line 496 or 516. It contains "Gen Invoice" and "Share Invoice".
// Let's find the closing div of that td.
code = code.replace(
  `                              </button>
                            </div>
                          </td>`,
  `                              </button>
                              <button
                                onClick={() => handleDeleteComplaint(c.id)}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 font-bold rounded-lg text-sm hover:bg-red-100 transition-colors mt-2 w-full"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </td>`
);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
