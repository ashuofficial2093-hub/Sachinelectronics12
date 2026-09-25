const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /if \(role === 'admin' \|\| role === 'technician'\) \{\s*setUser\(\{ email: userEmail, role, id: userId \}\);\s*fetchData\(\);\s*\} else \{\s*setLoading\(false\);\s*\}\s*\}, \[\]\);/,
  `if (role === 'admin' || role === 'technician') {
      setUser({ email: userEmail, role, id: userId });
      fetchData();
    } else {
      setLoading(false);
    }
    
    const intervalId = setInterval(() => {
      if (localStorage.getItem('userRole') === 'admin') {
        fetchTechnicianApplications();
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);`
);

fs.writeFileSync('src/components/Admin.tsx', code);
