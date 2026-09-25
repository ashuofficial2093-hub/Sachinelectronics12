const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

code = code.replace(/import \{ getDocs, query, where, updateDoc, doc \} from 'firebase\/firestore';/, "");

// Replace inventory fetch
code = code.replace(/const snapshot = await getDocs\(inventoryCollection\);\s*setInventory\(snapshot\.docs\.map\(\(d: any\) => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\)\);/m, `
      const snapshot = await get(ref(rtdb, 'inventory'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         setInventory(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
         setInventory([]);
      }
`);

// Replace tracking complaint fetch
code = code.replace(/const q = query\(complaintsCollection, where\('phone', '==', phone\)\);\s*const snapshot = await getDocs\(q\);\s*setTrackedComplaints\(snapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as any\);/m, `
      const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }
`);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
