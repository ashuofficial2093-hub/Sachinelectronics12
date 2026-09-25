const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const regex = /const fetchTechnicianApplications = async \(\) => \{[\s\S]*?\}\s*\}, \[\]\);/m;
const replace = `const fetchTechnicianApplications = async () => {
    try {
      const snapshot = await get(ref(rtdb, 'technicianApplications'));
      if (snapshot.exists()) {
        const val = snapshot.val();
        const apps = Object.keys(val).map(key => ({ id: key, ...val[key] }));
        apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTechnicianApplications(apps);
      } else {
        setTechnicianApplications([]);
      }
    } catch (e) {
      console.error('Error fetching applications', e);
    }
  };

  useEffect(() => {
    fetchTechnicianApplications();
    const appRef = ref(rtdb, 'technicianApplications');
    const unsubscribe = onValue(appRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const apps = Object.keys(val).map(key => ({ id: key, ...val[key] }));
        apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTechnicianApplications(apps);
      }
    });
    return () => unsubscribe();
  }, []);`;
code = code.replace(regex, replace);

fs.writeFileSync('src/components/Admin.tsx', code);
