const fs = require('fs');
let admin = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const newPricingTab = `        ) : activeTab === 'pricing' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden max-w-4xl mx-auto mb-10">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Service Pricing & Home Visit Charges</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSavePricing} className="mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Mandatory Home Visit Charge (₹)</label>
                  <p className="text-xs text-slate-600 mb-3">This fixed charge will be automatically added to all home service bookings.</p>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      required
                      min="0"
                      value={pricingSettings.homeVisitCharge ?? 250}
                      onChange={(e) => setPricingSettings({ ...pricingSettings, homeVisitCharge: Number(e.target.value) })}
                      className="w-full md:w-1/3 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-0 focus:border-blue-500 outline-none transition-all bg-white font-bold"
                    />
                    <button type="submit" disabled={isSavingPricing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap">
                      {isSavingPricing ? 'Saving...' : 'Save Base Charge'}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-8 border-t pt-8">
                <h4 className="font-bold text-slate-900 mb-4 text-lg">Dynamic Service Rates Management</h4>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h5 className="font-semibold text-slate-700">{editingServiceRate ? 'Edit Service Rate' : 'Add New Service Rate'}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Appliance Category</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. AC, Refrigerator"
                          value={editingServiceRate ? editingServiceRate.applianceCategory : newServiceRate.applianceCategory}
                          onChange={(e) => {
                             const val = e.target.value;
                             editingServiceRate ? setEditingServiceRate({...editingServiceRate, applianceCategory: val}) : setNewServiceRate({...newServiceRate, applianceCategory: val});
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Service Type</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. PCB Repair, Gas Refilling"
                          value={editingServiceRate ? editingServiceRate.serviceType : newServiceRate.serviceType}
                          onChange={(e) => {
                             const val = e.target.value;
                             editingServiceRate ? setEditingServiceRate({...editingServiceRate, serviceType: val}) : setNewServiceRate({...newServiceRate, serviceType: val});
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Base Cost (₹)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            required
                            min="0"
                            value={editingServiceRate ? editingServiceRate.baseRepairingCost : (newServiceRate.baseRepairingCost || '')}
                            onChange={(e) => {
                               const val = Number(e.target.value);
                               editingServiceRate ? setEditingServiceRate({...editingServiceRate, baseRepairingCost: val}) : setNewServiceRate({...newServiceRate, baseRepairingCost: val});
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-blue-500 outline-none"
                          />
                          <button 
                            type="button" 
                            onClick={async () => {
                              try {
                                if (editingServiceRate) {
                                  if (!editingServiceRate.applianceCategory || !editingServiceRate.serviceType) { alert("Missing fields"); return; }
                                  await update(ref(rtdb, 'serviceRates/' + editingServiceRate.id), { ...editingServiceRate });
                                  setEditingServiceRate(null);
                                } else {
                                  if (!newServiceRate.applianceCategory || !newServiceRate.serviceType) { alert("Missing fields"); return; }
                                  await push(ref(rtdb, 'serviceRates'), { ...newServiceRate });
                                  setNewServiceRate({ applianceCategory: '', serviceType: '', baseRepairingCost: 0 });
                                }
                              } catch(err) {
                                console.error(err);
                                alert("Failed to save rate.");
                              }
                            }} 
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                          >
                            {editingServiceRate ? 'Update' : 'Add'}
                          </button>
                          {editingServiceRate && <button type="button" onClick={() => setEditingServiceRate(null)} className="text-slate-500 hover:text-slate-800">Cancel</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-medium">Category</th>
                          <th className="px-4 py-3 font-medium">Service Type</th>
                          <th className="px-4 py-3 font-medium text-right">Cost (₹)</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {serviceRates.map(rate => (
                          <tr key={rate.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-800">{rate.applianceCategory}</td>
                            <td className="px-4 py-3">{rate.serviceType}</td>
                            <td className="px-4 py-3 text-right font-semibold text-blue-600">₹{rate.baseRepairingCost}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => setEditingServiceRate(rate)} className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button onClick={() => {
                                if (window.confirm("Delete this rate?")) {
                                  remove(ref(rtdb, 'serviceRates/' + rate.id)).catch(console.error);
                                }
                              }} className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                        ))}
                        {serviceRates.length === 0 && (
                          <tr><td colSpan={4} className="text-center py-6 text-slate-500">No service rates configured yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;

admin = admin.replace(
  /\) : activeTab === 'pricing' \? \([\s\S]*?\)\s*\) : activeTab === 'analytics'/m,
  newPricingTab + ") : activeTab === 'analytics'"
);

fs.writeFileSync('src/components/Admin.tsx', admin);
