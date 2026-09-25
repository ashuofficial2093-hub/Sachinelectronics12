const fs = require('fs');
let admin = fs.readFileSync('src/components/Admin.tsx', 'utf8');

admin = admin.replace(
  "const [pricingSettings, setPricingSettings] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });",
  "const [pricingSettings, setPricingSettings] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });\n  const [serviceRates, setServiceRates] = useState<ServiceRate[]>([]);\n  const [newServiceRate, setNewServiceRate] = useState<ServiceRate>({ applianceCategory: '', serviceType: '', baseRepairingCost: 0 });\n  const [editingServiceRate, setEditingServiceRate] = useState<ServiceRate | null>(null);"
);

// Add fetch logic
admin = admin.replace(
  /const unsubPricing = onValue\(pricingRef, \(snapshot\) => \{/g,
  `const serviceRatesRef = ref(rtdb, 'serviceRates');
    const unsubServiceRates = onValue(serviceRatesRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setServiceRates(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setServiceRates([]);
      }
    });

    const unsubPricing = onValue(pricingRef, (snapshot) => {`
);

admin = admin.replace(
  /unsubPricing\(\);/g,
  `unsubServiceRates();\n      unsubPricing();`
);

// Add the pricing button to the tabs menu for SuperAdmin
admin = admin.replace(
  /<button onClick=\{\(\) => setActiveTab\('products'\)\} className=\{`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \$\{activeTab === 'products' \? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'\}`\}>📦 Products<\/button>/g,
  `<button onClick={() => setActiveTab('products')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>📦 Products</button>\n                    <button onClick={() => setActiveTab('pricing')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>💰 Service Pricing Setup</button>`
);
// Also for mobile view
admin = admin.replace(
  /<button onClick=\{\(\) => setActiveTab\('products'\)\} className=\{`shrink-0 px-3 py-1\.5 rounded-md text-sm font-medium \$\{activeTab === 'products' \? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'\}`\}>📦 Products<\/button>/g,
  `<button onClick={() => setActiveTab('products')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>📦 Products</button>\n                 <button onClick={() => setActiveTab('pricing')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>💰 Service Pricing</button>`
);

fs.writeFileSync('src/components/Admin.tsx', admin);
