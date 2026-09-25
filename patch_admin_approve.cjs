const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// The user wants: "Once a technician is added or status is set to "Approved", automatically add them to the Active Technicians list in localStorage (app_area_techs)."
// The current code adds them to secureStorage.setItem('technicians', parsedTechs); but wait, the user wants `app_area_techs`.
// Also, when approving, let's extract their PIN codes, skills.
// We can see in MasterComplaintsView it expects 'app_area_techs' but the secureStorage 'technicians' might be different. Let's merge both.

const oldApprove = `      if (action === 'Approved') {
        const techs = secureStorage.getItem('technicians');
        const parsedTechs = Array.isArray(techs) ? techs : [];
        const newTech = {
          id: Date.now().toString(),
          name: name,
          phone: phone,
          password: 'pass' + Math.floor(1000 + Math.random() * 9000),
          isActive: true
        };
        parsedTechs.push(newTech);
        secureStorage.setItem('technicians', parsedTechs);
        setTechnicians(parsedTechs);
      }`;

const newApprove = `      if (action === 'Approved') {
        // Also add to app_area_techs for the new assign modal
        const areaTechsRaw = localStorage.getItem('app_area_techs');
        const areaTechs = areaTechsRaw ? JSON.parse(areaTechsRaw) : [];
        
        // Find the application object to get its details (city -> pincode, skills -> skills)
        const appObj = technicianApplications.find(a => a.id === appId);
        
        const newAreaTech = {
          id: 'local_tech_' + Date.now(),
          name: name,
          mobile: phone,
          phone: phone,
          pincodes: appObj ? [appObj.city] : [],
          skills: appObj && appObj.skills ? appObj.skills : [],
          isActive: true,
          role: 'technician',
          createdAt: new Date().toISOString()
        };
        
        areaTechs.push(newAreaTech);
        localStorage.setItem('app_area_techs', JSON.stringify(areaTechs));
        
        // Also update standard technicians if needed
        const techs = secureStorage.getItem('technicians');
        const parsedTechs = Array.isArray(techs) ? techs : [];
        parsedTechs.push({
          id: newAreaTech.id,
          name: name,
          phone: phone,
          password: 'pass' + Math.floor(1000 + Math.random() * 9000),
          isActive: true
        });
        secureStorage.setItem('technicians', parsedTechs);
        fetchTechnicians(); // Refresh state
      }`;

if(code.includes('const techs = secureStorage.getItem(\'technicians\');')) {
  code = code.replace(oldApprove, newApprove);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log("Patched Admin approve logic");
} else {
  console.log("Couldn't find old approve logic");
}
