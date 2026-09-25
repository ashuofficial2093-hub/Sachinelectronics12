const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Update activeTab type
code = code.replace(
  "useState<'products' | 'complaints' | 'banner' | 'inventory' | 'technicians' | 'promotions' | 'ai-manager' | 'technicianApplications' | 'analytics'>('analytics');",
  "useState<'products' | 'complaints' | 'banner' | 'inventory' | 'technicians' | 'promotions' | 'ai-manager' | 'technicianApplications' | 'analytics' | 'pricing'>('analytics');"
);

// 2. Add Pricing state and fetch function after banner settings
const bannerState = `  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({
    text: '',
    isActive: false,
    type: 'offer'
  });
  const [isSavingBanner, setIsSavingBanner] = useState(false);`;

const pricingState = `  const [pricingSettings, setPricingSettings] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });
  const [isSavingPricing, setIsSavingPricing] = useState(false);`;

code = code.replace(bannerState, bannerState + '\n' + pricingState);

const fetchBanner = `  const fetchBannerSettings = async () => {
    try {
      const bannerDoc = await getDoc(doc(db, 'settings', 'banner'));
      if (bannerDoc.exists()) {
        setBannerSettings(bannerDoc.data() as BannerSettings);
      }
    } catch (error) {
      console.error("Error fetching banner settings:", error);
    }
  };`;

const fetchPricing = `  const fetchPricingSettings = async () => {
    try {
      const pricingDoc = await getDoc(doc(db, 'settings', 'pricing'));
      if (pricingDoc.exists()) {
        setPricingSettings(prev => ({ ...prev, ...pricingDoc.data() }));
      }
    } catch (error) {
      console.error("Error fetching pricing settings:", error);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPricing(true);
    try {
      await setDoc(doc(db, 'settings', 'pricing'), pricingSettings);
      alert('Pricing settings saved successfully!');
    } catch (error) {
      console.error("Error saving pricing:", error);
      alert('Failed to save pricing settings.');
    } finally {
      setIsSavingPricing(false);
    }
  };`;

code = code.replace(fetchBanner, fetchBanner + '\n' + fetchPricing);

// Add to Promise.all
code = code.replace(
  "fetchBannerSettings(), fetchInventory(),",
  "fetchBannerSettings(), fetchPricingSettings(), fetchInventory(),"
);

// Add Tab Button Desktop
code = code.replace(
  "<button onClick={() => setActiveTab('banner')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>Top Banner</button>",
  "<button onClick={() => setActiveTab('banner')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>Top Banner</button>\n                    <button onClick={() => setActiveTab('pricing')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>Pricing</button>"
);

// Add Tab Button Mobile
code = code.replace(
  "<button onClick={() => setActiveTab('banner')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}`}>Top Banner</button>",
  "<button onClick={() => setActiveTab('banner')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}`}>Top Banner</button>\n                 <button onClick={() => setActiveTab('pricing')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}`}>Pricing</button>"
);

// Add Tab Content
const bannerTabUI = `        {activeTab === 'banner' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:border-blue-200/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden max-w-2xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Homepage Banner Settings</h3>
            </div>`;

const pricingTabUI = `        {activeTab === 'pricing' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden max-w-3xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Service Pricing & Home Visit Charges</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSavePricing} className="space-y-6">
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Mandatory Home Visit Charge (₹)</label>
                  <p className="text-xs text-slate-600 mb-3">This fixed charge will be automatically added to all home service bookings.</p>
                  <input
                    type="number"
                    required
                    min="0"
                    value={pricingSettings.homeVisitCharge}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, homeVisitCharge: Number(e.target.value) })}
                    className="w-full md:w-1/2 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-0 focus:border-blue-500 outline-none transition-all bg-white font-bold"
                  />
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">Individual Service Charges (₹)</h4>
                  <p className="text-xs text-slate-600 mb-4">Base prices for different appliance services (excluding spare parts). These are added on top of the home visit charge.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(pricingSettings.serviceFees).map(key => (
                      <div key={key} className="flex flex-col">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{key === 'HouseWiring' ? 'House Wiring' : key === 'WashingMachine' ? 'Washing Machine' : key}</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={pricingSettings.serviceFees[key as keyof typeof pricingSettings.serviceFees]}
                          onChange={(e) => setPricingSettings({ 
                            ...pricingSettings, 
                            serviceFees: { ...pricingSettings.serviceFees, [key]: Number(e.target.value) } 
                          })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-0 focus:border-blue-400 outline-none transition-all bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSavingPricing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 btn-3d btn-3d-blue"
                  >
                    {isSavingPricing ? 'Saving...' : 'Save Pricing Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : activeTab === 'banner' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:border-blue-200/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden max-w-2xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Homepage Banner Settings</h3>
            </div>`;

code = code.replace(bannerTabUI, pricingTabUI);

fs.writeFileSync('src/components/Admin.tsx', code);
