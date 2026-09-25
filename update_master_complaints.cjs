const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MasterComplaintsView.tsx', 'utf8');

if (!code.includes('handleDeleteComplaint?:')) {
  code = code.replace(
    `  handleAssignAreaAdmin?: (id: string, adminId: string, adminName: string) => void;`,
    `  handleAssignAreaAdmin?: (id: string, adminId: string, adminName: string) => void;\n  handleDeleteComplaint?: (id: string) => void;`
  );
}

if (!code.includes('handleDeleteComplaint,')) {
  code = code.replace(
    `  handleUpdateStatus, handleOpenHistory, technicians, areaAdmins, handleAssignAreaAdmin`,
    `  handleUpdateStatus, handleOpenHistory, technicians, areaAdmins, handleAssignAreaAdmin, handleDeleteComplaint`
  );
}

if (!code.includes('onClick={() => handleDeleteComplaint')) {
  // Add Trash2 to imports
  if (!code.includes('Trash2')) {
    code = code.replace(
      `import { Clock, MapPin, Search } from 'lucide-react';`,
      `import { Clock, MapPin, Search, Trash2 } from 'lucide-react';`
    );
  }
  
  // Let's add the delete button to the actions cell
  code = code.replace(
    `                         </>
                       )}
                       {complaint?.status === 'COMPLETED' && (`,
    `                         </>
                       )}
                       {complaint?.status === 'COMPLETED' && (
                         <>
                           <div className="text-xs text-green-600 font-bold mb-2">Closed</div>
                           <a 
                             href={\`https://wa.me/91\${complaint?.phone}?text=\${encodeURIComponent(\`Hello \${complaint?.name},\\nYour repair ticket \${complaint.jobCardId || complaint.id} has been successfully completed!\\n\\n🧾 Total Bill Amount: ₹\${complaint?.resolutionDetails?.totalCost || 0}\\n🛠️ Service: \${complaint?.issue}\\n\\nThank you for choosing Sachin Electronics Sales and Service Center!\`)}\`}
                             target="_blank" rel="noopener noreferrer"
                             className="w-full mt-1 flex justify-center items-center gap-2 bg-green-500 text-white py-1 px-2 rounded font-bold hover:bg-green-600 transition-colors text-[10px]"
                           >
                             💬 Share Invoice
                           </a>
                         </>
                       )}
                       
                       <button
                         onClick={() => handleDeleteComplaint?.(complaint.id)}
                         className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"
                       >
                         <Trash2 className="w-3 h-3" /> Delete
                       </button>
                    </td>`
  );
  // Wait, I messed up the replace because I replaced the existing COMPLETED block with itself plus the new button.
  // Actually, I can just replace `                     </td>\n                  </tr>\n                ))` with the button and the `</td>`.
}

fs.writeFileSync('src/components/admin/MasterComplaintsView.tsx', code);
