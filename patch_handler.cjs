const fs = require('fs');
let content = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const target = `  const handleResolveComplaint = async (e: React.FormEvent) => {`;

const replacement = `  const handleSaveRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkingComplaintId) return;

    try {
      await update(ref(rtdb, 'complaints/' + remarkingComplaintId), {
        technicianRemark: technicianRemark,
        status: remarkStatus,
        updatedAt: new Date().toISOString()
      });
      setRemarkModalOpen(false);
      setRemarkingComplaintId(null);
      setTechnicianRemark('');
      setRemarkStatus('Pending - Part Required');
    } catch (error) {
      console.error('Error saving remark:', error);
      alert('Failed to save remark. Please try again.');
    }
  };

  const handleResolveComplaint = async (e: React.FormEvent) => {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', content);
