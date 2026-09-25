const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Fix handleAssignTechnician to use localStorage if technician not in Firebase, or update directly.
// The user asks: "When clicking the "Assign Tech" button on any complaint row, open a clean Modal or Inline Dropdown list containing all active Technicians (from app_area_techs or default technician list like Suraj, Sachin, etc.)."
// And: "Update the complaint's assignedTo field instantly in React State and localStorage."

code = code.replace(
  /const handleAssignTechnician = async \(complaintId: string, technicianId: string\) => \{[\s\S]*?fetchComplaints\(\);\s*\}\s*catch[^\}]+\}\s*\};/m,
  `const handleAssignTechnician = async (complaintId: string, technicianId: string) => {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      const allTechs = [...technicians, ...JSON.parse(localStorage.getItem('app_area_techs') || '[]')];
      const tech = allTechs.find(t => t.id === technicianId);
      const techName = tech ? tech.name : (technicianId || '');
      await updateDoc(complaintRef, {
        assignedTechnicianId: technicianId,
        assignedTechnicianName: techName,
        assignedTo: techName,
        status: 'Assigned'
      });
      // Instant React State Update
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, assignedTechnicianId: technicianId, assignedTechnicianName: techName, assignedTo: techName, status: 'Assigned' } : c));
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician.");
    }
  };`
);

// We need to inject the combined technicians array into the Assign Modal
const oldModalSelect = `                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>
                  ))}`;

const newModalSelect = `                  {[...technicians, ...(JSON.parse(localStorage.getItem('app_area_techs') || '[]'))].map(t => (
                    <option key={t.id || t.phone} value={t.id || t.name}>{t.name} ({t.phone || t.mobile})</option>
                  ))}`;
                  
code = code.replace(oldModalSelect, newModalSelect);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched Assign Modal');
