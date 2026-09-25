const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const fetchAppsOld = /const fetchTechnicianApplications = async \(\) => \{[\s\S]*?const q = query\(collection\(db, 'technicianApplications'\), orderBy\('createdAt', 'desc'\)\);[\s\S]*?const snapshot = await getDocs\(q\);[\s\S]*?const apps = snapshot\.docs\?\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);[\s\S]*?setTechnicianApplications\(merged\);[\s\S]*?\} catch \(e\) \{[\s\S]*?setTechnicianApplications\(Array\.isArray\(localData\) \? localData : \[\]\);[\s\S]*?\}\s*\};/m;

const replaceFetchApps = `const fetchTechnicianApplications = async () => {
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
  };`;

code = code.replace(fetchAppsOld, replaceFetchApps);

const useEffOld = /useEffect\(\(\) => \{\s*fetchTechnicianApplications\(\);\s*const handleStorageChange = \(\) => fetchTechnicianApplications\(\);\s*window\.addEventListener\('applicationSubmitted', handleStorageChange\);\s*window\.addEventListener\('storage', handleStorageChange\);\s*return \(\) => \{\s*window\.removeEventListener\('applicationSubmitted', handleStorageChange\);\s*window\.removeEventListener\('storage', handleStorageChange\);\s*\};\s*\}, \[\]\);/m;
const replaceUseEff = `useEffect(() => {
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
code = code.replace(useEffOld, replaceUseEff);

const regexAppStat = /const docRef = doc\(db, 'technicianApplications', appId\);\s*await updateDoc\(docRef, \{ status: newStatus, reason \}\);/m;
const replaceAppStat = `await update(ref(rtdb, 'technicianApplications/' + appId), { status: newStatus, reason });`;
code = code.replace(regexAppStat, replaceAppStat);

const qAuth = /const \{ query, where, getDocs \} = \(window as any\)\.require && \(window as any\)\.require\('firebase\/firestore'\);\s*const q = query\(technicianApplicationsCollection, where\('email', '==', email\), where\('status', '==', 'approved'\)\);\s*const snap = await getDocs\(q\);/m;
const replAuth = `// Login handled via technicians list`;
code = code.replace(qAuth, replAuth);

const qCust = /const q = query\(complaintsCollection, where\('phone', '==', phone\)\);\s*const snapshot = await getDocs\(q\);/m;
const repCust = `// handled via filtered complaints
      const myComplaints = complaints.filter(c => c.phone === phone);`;
code = code.replace(qCust, repCust);
code = code.replace(/setCustomerHistory\(snapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as Complaint\[\]\);/m, "setCustomerHistory(myComplaints);");

fs.writeFileSync('src/components/Admin.tsx', code);
