const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const regex = /<select[\s\S]*?onChange=\{\(e\) => setSelectedTechs\(\{ \.\.\.selectedTechs, \[c\.id\]: e\.target\.value \}\)\}[\s\S]*?className="px-2 py-1\.5 border border-slate-300 rounded-lg text-sm flex-1 min-w-\[120px\]"[\s\S]*?>[\s\S]*?<option value="">Select Tech\.\.\.<\/option>[\s\S]*?\{technicians\?\.map\(\(t: any\) => \([\s\S]*?<option key=\{t\.id\} value=\{t\.id\}>[\s\S]*?\{t\.name\}[\s\S]*?<\/option>[\s\S]*?\)\)\}[\s\S]*?<\/select>/;

const replacement = `<select
  value={selectedTechs[c.id] || ""}
  onChange={(e) => setSelectedTechs({ ...selectedTechs, [c.id]: e.target.value })}
  className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm flex-1 min-w-[120px]"
>
  <option value="">Select Tech...</option>
  {technicians?.filter((t: any) => {
    if (!c.pincode && !c.pinCode) return true;
    const matchesPin = t.pincodes && (t.pincodes.includes(c.pincode) || t.pincodes.includes(c.pinCode));
    const matchesTechPin = t.pinCode === c.pincode || t.pinCode === c.pinCode;
    return matchesPin || matchesTechPin;
  }).map((t: any) => (
    <option key={t.id} value={t.id}>
      {t.name}
    </option>
  ))}
</select>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
