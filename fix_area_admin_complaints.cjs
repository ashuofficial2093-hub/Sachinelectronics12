const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const oldEffect = /useEffect\(\(\) => \{\s*const complaintsRef = ref\(rtdb, 'complaints'\);\s*const unsubscribe = onValue\(complaintsRef, \(snapshot\) => \{[\s\S]*?\}, \(error\) => \{[\s\S]*?\}\);/m;

const newEffect = `useEffect(() => {
    const complaintsRef = ref(rtdb, 'complaints');
    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        let rtdbData = Object.keys(val).map(key => ({ id: key, ...val[key] })) as Complaint[];
        
        const sessionData = safeJSONParse(localStorage.getItem('area_admin_session'), null);
        const adminPincodes = sessionData?.assignedPincodes || sessionData?.pincodes || [];
        
        const filteredComplaints = rtdbData.filter((c: any) => {
           const compPin = String(c.pincode || c.pinCode || '').trim();
           return adminPincodes.some((p: any) => String(p).trim() === compPin);
        });
        
        const sorted = filteredComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComplaints(sorted);
      } else {
        setComplaints([]);
      }
    }, (error) => {
      console.warn('Error fetching area admin complaints', error);
    });

    return () => unsubscribe();
  }, []);`;

code = code.replace(oldEffect, newEffect);

const oldSelect = /<select[\s\S]*?value=\{selectedTechs\[c\.id\] \|\| ""\}[\s\S]*?onChange=\{\(e\) => setSelectedTechs\(\{ \.\.\.selectedTechs, \[c\.id\]: e\.target\.value \}\)\}[\s\S]*?className="px-2 py-1\.5 border border-slate-300 rounded-lg text-sm flex-1 min-w-\[120px\]"[\s\S]*?>[\s\S]*?<option value="">Select Tech\.\.\.<\/option>[\s\S]*?\{technicians\?\.filter\(\(t: any\) => \{[\s\S]*?return matchesPin \|\| matchesTechPin;[\s\S]*?\}\)\.map\(\(t: any\) => \([\s\S]*?<option key=\{t\.id\} value=\{t\.id\}>[\s\S]*?\{t\.name\}[\s\S]*?<\/option>[\s\S]*?\)\}[\s\S]*?<\/select>/m;

const newSelect = `<select
  value={selectedTechs[c.id] || ""}
  onChange={(e) => setSelectedTechs({ ...selectedTechs, [c.id]: e.target.value })}
  className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm flex-1 min-w-[120px]"
>
  <option value="">Select Tech...</option>
  {technicians?.filter((t: any) => {
    const compPin = String(c.pincode || c.pinCode || '').trim();
    if (!compPin) return true;
    
    let tPins = [];
    if (Array.isArray(t.pincodes)) {
      tPins = t.pincodes.map((p) => String(p).trim());
    }
    const techPin = String(t.pinCode || t.pincode || '').trim();
    if (techPin) tPins.push(techPin);

    return tPins.includes(compPin);
  }).map((t: any) => (
    <option key={t.id} value={t.id}>
      {t.name}
    </option>
  ))}
</select>`;

code = code.replace(oldSelect, newSelect);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
