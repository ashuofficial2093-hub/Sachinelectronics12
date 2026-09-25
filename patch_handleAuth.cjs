const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldHandleAuthMatch = code.match(/const handleAuth = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\n  \};\n\n  const handleLogout/);

if (oldHandleAuthMatch) {
  const newHandleAuth = `const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setResetMessage('');

    if (email === 'super@app.com' && password === 'super123') {
      localStorage.setItem('userRole', 'super_admin');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('last_active', Date.now().toString());
      setUser({ email, role: 'super_admin', name: 'Super Admin' });
      fetchData();
      return;
    }

    if (email === 'bilhaur@app.com' && password === 'admin123') {
      localStorage.setItem('userRole', 'area_admin');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPincodes', JSON.stringify(['209202']));
      localStorage.setItem('last_active', Date.now().toString());
      setUser({ email, role: 'area_admin', name: 'Bilhaur Admin', pincodes: ['209202'], permissions: { canEditInventory: true, canAlertTechs: true, canWA: true } });
      fetchData();
      return;
    }

    // Check LocalStorage Area Admins first
    const localAdmins = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
    const adminMatch = localAdmins.find((a: any) => a.email === email && a.password === password);
    if (adminMatch) {
      if (!adminMatch.isActive) {
        setLoginError('Account is inactive.');
        return;
      }
      localStorage.setItem('userRole', 'area_admin');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPincodes', JSON.stringify(adminMatch.pincodes || []));
      localStorage.setItem('last_active', Date.now().toString());
      setUser({ email, role: 'area_admin', name: adminMatch.name, pincodes: adminMatch.pincodes || [], permissions: adminMatch.permissions || { canEditInventory: true, canAlertTechs: true, canWA: true } });
      fetchData();
      return;
    }

    // Check Firebase Techs
    try {
      const { query, where, getDocs } = require('firebase/firestore');
      const q = query(technicianApplicationsCollection, where('email', '==', email), where('status', '==', 'approved'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const tData = snap.docs[0].data() as any;
        if (tData.password === password) {
          if (tData.isSuspended) {
            setLoginError('Account is suspended.');
            return;
          }
          localStorage.setItem('userRole', 'technician');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('last_active', Date.now().toString());
          setUser({ email, role: 'technician', name: tData.name });
          fetchData();
          return;
        }
      }
    } catch(e) { console.error(e); }

    // Try firebase super admin login
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userRole', 'super_admin');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('last_active', Date.now().toString());
      setUser({ email, role: 'super_admin', name: 'Super Admin' });
      fetchData();
      return;
    } catch(e) {}

    setLoginError('Invalid email or password');
  };

  const handleLogout`;
  
  code = code.replace(oldHandleAuthMatch[0], newHandleAuth);
  console.log("Replaced handleAuth");
} else {
  console.log("Could not match handleAuth");
}

fs.writeFileSync('src/components/Admin.tsx', code);
