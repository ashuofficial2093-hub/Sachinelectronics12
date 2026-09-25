const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /await Promise\.all\(\[fetchProducts\(\), fetchComplaints\(\), fetchBannerSettings\(\), fetchInventory\(\), fetchTechnicians\(\), fetchPromotions\(\)\]\);/,
  `await Promise.all([fetchProducts(), fetchComplaints(), fetchBannerSettings(), fetchInventory(), fetchTechnicians(), fetchPromotions(), fetchTechnicianApplications()]);`
);

code = code.replace(
  /const fetchTechnicians = async \(\) => {/,
  `const fetchTechnicianApplications = async () => {
    try {
      const localData = localStorage.getItem('pending_technicians');
      if (localData) {
        setTechnicianApplications(JSON.parse(localData));
      } else {
        setTechnicianApplications([]);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchTechnicians = async () => {`
);

code = code.replace(
  /const updateApplicationStatus = async \(id: string, status: 'Approved' \| 'Rejected' \| 'Hold'\) => {[\s\S]*?};/,
  `const updateApplicationStatus = async (id: string, status: 'Approved' | 'Rejected' | 'Hold') => {
    if(window.confirm(\`Are you sure you want to mark this as \${status}?\`)) {
       try {
         // Update in localStorage
         const localData = localStorage.getItem('pending_technicians');
         if (localData) {
           const parsed = JSON.parse(localData);
           const updated = parsed.map((app: any) => app.id === id ? { ...app, status } : app);
           localStorage.setItem('pending_technicians', JSON.stringify(updated));
           setTechnicianApplications(updated);
         }
         
         // Try to update in Firebase if exists (non-blocking)
         try {
           const docRef = doc(db, 'technicianApplications', id);
           await updateDoc(docRef, { status });
         } catch (e) {}
         
       } catch (err) {
         console.error(err);
         alert("Failed to update status");
       }
    }
  };`
);

fs.writeFileSync('src/components/Admin.tsx', code);
