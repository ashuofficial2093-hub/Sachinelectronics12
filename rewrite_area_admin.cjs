const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

// The second script failed because the replace target was already gone. Let's just find where to inject onValue if it doesn't exist.
if (!code.includes('onValue(complaintsRef')) {
  const newUseEffect = `
  useEffect(() => {
    const complaintsRef = ref(rtdb, 'complaints');
    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        let rtdbData = Object.keys(val).map(key => ({ id: key, ...val[key] })) as Complaint[];
        
        const sessionData = safeJSONParse(localStorage.getItem('area_admin_session'), null);
        const adminPincodes = sessionData?.assignedPincodes || sessionData?.pincodes || [];
        
        const filteredComplaints = rtdbData.filter((c: any) => 
           adminPincodes.includes(c.pincode) || adminPincodes.includes(c.pinCode)
        );
        
        const sorted = filteredComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComplaints(sorted);
      } else {
        setComplaints([]);
      }
    }, (error) => {
      console.warn("Error fetching complaints in realtime:", error);
    });
    return () => unsubscribe();
  }, []);
`;
  code = code.replace(/  useEffect\(\(\) => \{\n    const checkAuth/g, newUseEffect + "\n  useEffect(() => {\n    const checkAuth");
  // If checkAuth was not found, try putting it before fetchData
  if (!code.includes('onValue(complaintsRef')) {
    code = code.replace(/  const fetchData = /g, newUseEffect + "\n  const fetchData = ");
  }
}

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
