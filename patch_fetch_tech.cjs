const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldFetch = `  const fetchTechnicians = async () => {
    try {
      const snapshot = await getDocs(techniciansCollection);
      const fetchedTechs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Technician[];
      setTechnicians(fetchedTechs);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };`;

const newFetch = `  const fetchTechnicians = async () => {
    try {
      const snapshot = await getDocs(techniciansCollection);
      const fetchedTechs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Technician[];
      
      const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
      // Deduplicate by ID and Phone
      const combined = [...existing, ...fetchedTechs];
      const deduped = [...new Map(combined.map(item => [item.id || item.phone, item])).values()];
      
      setTechnicians(deduped);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };`;

if(code.includes('const fetchTechnicians = async () => {')) {
  code = code.replace(oldFetch, newFetch);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched fetchTechnicians to include local techs');
} else {
  console.log('Could not find fetchTechnicians');
}
