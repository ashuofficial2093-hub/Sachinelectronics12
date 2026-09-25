const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Update handleAssignTechnician to also show a success popup and set status to "ALERT SENT / ASSIGNED"
const oldAssign = `      await updateDoc(complaintRef, {
        assignedTechnicianId: technicianId,
        assignedTechnicianName: techName,
        assignedTo: techName,
        status: 'Assigned'
      });
      // Instant React State Update
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, assignedTechnicianId: technicianId, assignedTechnicianName: techName, assignedTo: techName, status: 'Assigned' } : c));`;
      
const newAssign = `      await updateDoc(complaintRef, {
        assignedTechnicianId: technicianId,
        assignedTechnicianName: techName,
        assignedTo: techName,
        status: 'ALERT SENT / ASSIGNED'
      });
      // Instant React State Update
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, assignedTechnicianId: technicianId, assignedTechnicianName: techName, assignedTo: techName, status: 'ALERT SENT / ASSIGNED' } : c));
      
      // Temporary green success popup
      setToastMessage(\`Alert sent to Technician \${techName} successfully!\`);
      setTimeout(() => setToastMessage(''), 4000);`;
      
code = code.replace(oldAssign, newAssign);

// We need to make sure setToastMessage is used, let's check if it exists or use alert/custom toast
// Wait, Admin.tsx does have setToastMessage (I saw it earlier in the handleTechAppAction: setToastMessage(`Technician ${action} Successfully! ✓`);)

// Now, update the modal UI from "Assign Technician" to "Alert Technician"
code = code.replace(
  /<h3 className="text-xl font-bold text-slate-900 mb-4">Assign Technician<\/h3>/g,
  '<h3 className="text-xl font-bold text-slate-900 mb-4">🚨 Alert Technician</h3>'
);

code = code.replace(
  />\s*Assign\s*<\/button>/g,
  '>Confirm Alert & Assign</button>'
);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched Admin.tsx alert logic and modal');
