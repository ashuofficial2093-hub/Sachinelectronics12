const fs = require('fs');
let td = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

td = td.replace(/setTrackedComplaints\(data\);/m, ""); // Or maybe it was setTrackedComplaints(snapshot.docs.map...)? Let's see.

fs.writeFileSync('src/components/TechnicianDashboard.tsx', td);
