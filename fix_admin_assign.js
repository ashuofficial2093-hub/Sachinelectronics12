const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const targetFunction = `  const handleOpenAssignModal = (id: string) => {
    setSelectedComplaintId(id);
    setIsAssignModalOpen(true);
  };`;

const newFunction = `  const handleOpenAssignModal = (id: string) => {
    setSelectedComplaintId(id);
    setIsAssignModalOpen(true);
  };

  const handleAssignTechnician = (complaintId: string, techId: string) => {
    const tech = technicians?.find(t => t.id === techId);
    if (!tech) return;

    const updated = (Array.isArray(complaints) ? complaints : []).map(c => 
      c.id === complaintId 
        ? { 
            ...c, 
            assignedTechnicianId: techId, 
            assignedTechnicianName: tech.name,
            assignedTo: tech.name,
            status: 'ALERT SENT / ASSIGNED'
          }
        : c
    );
    setComplaints(updated);
  };`;

code = code.replace(targetFunction, newFunction);

// Pass it to MasterComplaintsView
code = code.replace(/handleOpenAssignModal=\{handleOpenAssignModal\}/, 'handleOpenAssignModal={handleOpenAssignModal}\n            handleAssignTechnician={handleAssignTechnician}');

fs.writeFileSync('src/components/Admin.tsx', code);
