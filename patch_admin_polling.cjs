const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /useEffect\(\(\) => \{\s*fetchData\(\);\s*\}, \[\]\);/,
  `useEffect(() => {
    fetchData();
    
    // Polling for real-time localStorage updates
    const interval = setInterval(() => {
      fetchTechnicianApplications();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);`
);

fs.writeFileSync('src/components/Admin.tsx', code);
