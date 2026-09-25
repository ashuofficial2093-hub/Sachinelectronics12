const fs = require('fs');
let content = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const target = `  // Resolution State
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);`;

const replacement = `  // Resolution State
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  
  // Remark State
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [remarkingComplaintId, setRemarkingComplaintId] = useState<string | null>(null);
  const [technicianRemark, setTechnicianRemark] = useState('');
  const [remarkStatus, setRemarkStatus] = useState('Pending - Part Required');`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', content);
