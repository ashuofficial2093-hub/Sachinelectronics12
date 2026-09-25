const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

// Replace the old useEffect and fetches with a single robust one
const oldEffect = /useEffect\(\(\) => \{[\s\S]*?setCurrentMonthDays\(days\);[\s\S]*?if \(tech\) \{[\s\S]*?unsubAtt\(\);\s*unsubLeaves\(\);\s*\}\s*\}\s*\}, \[tech\]\);/m;

const newEffect = `useEffect(() => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      status: 'pending' as const
    }));
    setCurrentMonthDays(days);
    
    if (tech) {
      const attRef = ref(rtdb, 'attendance');
      const unsubAtt = onValue(attRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const allAttendance = Object.keys(val).map(key => ({ id: key, ...val[key] }));
          setAttendance(allAttendance.filter(a => a.techId === tech.id));
        }
      });
      const leavesRef = ref(rtdb, 'leaves');
      const unsubLeaves = onValue(leavesRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const allLeaves = Object.keys(val).map(key => ({ id: key, ...val[key] }));
          setLeaves(allLeaves.filter(l => l.techId === tech.id));
        }
      });
      
      const compRef = ref(rtdb, 'complaints');
      const unsubComp = onValue(compRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const rtdbData = Object.keys(val).map(key => ({ id: key, ...val[key] }));
          setComplaints(rtdbData.filter((c: any) => c.assignedTechnicianId === tech.id));
        }
      });
      
      const invRef = ref(rtdb, 'inventory');
      const unsubInv = onValue(invRef, (snapshot) => {
         if (snapshot.exists()) {
           const val = snapshot.val();
           setInventory(Object.keys(val).map(key => ({ id: key, ...val[key] })));
         } else {
           setInventory([]);
         }
      });

      return () => {
        unsubAtt();
        unsubLeaves();
        unsubComp();
        unsubInv();
      }
    }
  }, [tech]);`;

code = code.replace(oldEffect, newEffect);

// Remove the old fetch functions
code = code.replace(/const fetchInventory = async \(\) => \{[\s\S]*?console\.error\("Error fetching inventory:", error\);\s*\}\s*\};/m, "");
code = code.replace(/const fetchTechDetails = async \(id: string\) => \{[\s\S]*?\};/m, "");
code = code.replace(/const fetchAssignedComplaints = async \(techData: any\) => \{[\s\S]*?console\.warn\('Error fetching complaints from RTDB:', error\);\s*\}\s*\};/m, "");
code = code.replace(/fetchAssignedComplaints\(techData\);/g, "");
code = code.replace(/fetchInventory\(\);/g, "");
code = code.replace(/fetchAssignedComplaints\(foundTech\);/g, "");
code = code.replace(/fetchAssignedComplaints\(tech\?.id\);/g, "");

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
