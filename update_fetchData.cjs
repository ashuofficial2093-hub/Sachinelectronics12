const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Update fetchComplaints to support scoping
const fetchComplaintsOld = /const fetchComplaints = async \(\) => \{[\s\S]*?\}\s*catch \(error\) \{/s;
const fetchComplaintsNew = `
  const fetchComplaints = async () => {
    try {
      let q = query(complaintsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      
      // If Area Admin, filter by assigned pincodes
      if (user?.role === 'area_admin' && user.pincodes && user.pincodes.length > 0) {
        data = data.filter(c => c.pincode && user.pincodes!.includes(c.pincode));
      }
      
      setComplaints(data);
    } catch (error) {
`;

code = code.replace(fetchComplaintsOld, fetchComplaintsNew);

// Add fetchAreaAdmins
const fetchAreaAdminsStr = `
  const fetchAreaAdmins = async () => {
    try {
      const snapshot = await getDocs(areaAdminsCollection);
      setAreaAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };
`;
code = code.replace("const fetchTechnicians = async () => {", fetchAreaAdminsStr + "\n  const fetchTechnicians = async () => {");

// Call fetchAreaAdmins in useEffect if super_admin
code = code.replace(
  "fetchPromotions();\n    fetchPricingSettings();\n  }, []);",
  "fetchPromotions();\n    fetchPricingSettings();\n    fetchAreaAdmins();\n  }, [user]);"
); // well we need it inside fetchData

// Update tabs based on role
code = code.replace(/user\.role === 'admin'/g, "user.role === 'super_admin'");

fs.writeFileSync('src/components/Admin.tsx', code);
