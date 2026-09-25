const fs = require('fs');
let form = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

if (!form.includes("const [selectedServiceRateId, setSelectedServiceRateId] = useState('');")) {
  form = form.replace(
    "const [selectedProduct, setSelectedProduct] = useState('');",
    "const [selectedProduct, setSelectedProduct] = useState('');\n  const [selectedServiceRateId, setSelectedServiceRateId] = useState('');"
  );
}

// Reset selectedServiceRateId when product changes
form = form.replace(
  /onChange=\{\(e\) => setSelectedProduct\(e\.target\.value\)\}/g,
  "onChange={(e) => { setSelectedProduct(e.target.value); setSelectedServiceRateId(''); }}"
);

// Add the Service Rate dropdown UI
const dropdownUI = `
                  {serviceRates.filter(r => r.applianceCategory === selectedProduct || (selectedProduct === 'Other' && r.applianceCategory === customProduct)).length > 0 && (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                      <label htmlFor="serviceRate" className="block text-sm font-semibold text-slate-700 mb-2">Select Specific Service (Optional)</label>
                      <select name="serviceRate" id="serviceRate" value={selectedServiceRateId} onChange={(e) => setSelectedServiceRateId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                        <option value="">General Checking / Other</option>
                        {serviceRates.filter(r => r.applianceCategory === selectedProduct || (selectedProduct === 'Other' && r.applianceCategory === customProduct)).map(rate => (
                          <option key={rate.id} value={rate.id}>{rate.serviceType} - ₹{rate.baseRepairingCost}</option>
                        ))}
                      </select>
                    </div>
                  )}
`;

form = form.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/g,
  dropdownUI + '\n                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
);

// Update breakdown section
// It previously had: {selectedProduct && (... <span>Service Charge ...
// Let's replace the whole breakdown block.

const oldBreakdownRegex = /<h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" \/> Booking Checkout<\/h4>[\s\S]*?<div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">/m;

const newBreakdown = `<h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Booking Checkout</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Mandatory Home Visit Charge</span>
                        <span className="font-medium text-slate-900">₹{pricing.homeVisitCharge}</span>
                      </div>
                      {selectedProduct && (
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Service Charge ({selectedServiceRateId ? serviceRates.find(r => r.id === selectedServiceRateId)?.serviceType : (selectedProduct === 'Other' ? customProduct || 'Other' : selectedProduct)})</span>
                          <span className="font-medium text-slate-900">
                            ₹{selectedServiceRateId ? serviceRates.find(r => r.id === selectedServiceRateId)?.baseRepairingCost : (pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100))}
                          </span>
                        </div>
                      )}
                      {loyaltyCoins > 0 && (
                        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-blue-100 pt-2 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={applyCoins} onChange={(e) => setApplyCoins(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                            <span>Use {loyaltyCoins} Loyalty Coins (₹{Math.floor(loyaltyCoins / 10)})</span>
                          </label>
                          <span className="font-medium text-green-600">
                            {applyCoins ? \`-₹\${Math.floor(loyaltyCoins / 10)}\` : '₹0'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg text-slate-900 border-t border-blue-200 mt-3 pt-3">
                        <span>Estimated Total</span>
                        <span>₹{Math.max(0, pricing.homeVisitCharge + (selectedProduct ? (selectedServiceRateId ? (serviceRates.find(r => r.id === selectedServiceRateId)?.baseRepairingCost || 0) : (pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100))) : 0) - (applyCoins ? Math.floor(loyaltyCoins / 10) : 0))}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">`;

form = form.replace(oldBreakdownRegex, newBreakdown);

fs.writeFileSync('src/components/ComplaintForm.tsx', form);
