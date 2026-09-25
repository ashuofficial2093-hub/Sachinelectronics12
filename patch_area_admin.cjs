const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Add "AI Assistant" button to area_admin menus
code = code.replace(
  '<button onClick={() => setActiveTab(\'analytics\')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === \'analytics\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 hover:bg-slate-100\'}`}>Local Analytics</button>',
  '<button onClick={() => setActiveTab(\'analytics\')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === \'analytics\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 hover:bg-slate-100\'}`}>Local Analytics</button>\n                    <button onClick={() => setActiveTab(\'ai-manager\')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === \'ai-manager\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 hover:bg-slate-100\'}`}>AI Assistant</button>'
);

code = code.replace(
  '<button onClick={() => setActiveTab(\'analytics\')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === \'analytics\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 bg-slate-100\'}`}>Local Analytics</button>',
  '<button onClick={() => setActiveTab(\'analytics\')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === \'analytics\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 bg-slate-100\'}`}>Local Analytics</button>\n                  <button onClick={() => setActiveTab(\'ai-manager\')} className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === \'ai-manager\' ? \'bg-blue-100 text-blue-700\' : \'text-slate-600 bg-slate-100\'}`}>AI Assistant</button>'
);

// We need to find exactly where to insert activeTab === 'inventory'.
// We can insert it right before ") : activeTab === 'analytics' ? ("

const inventoryJSX = `
        ) : activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-900">{isEditingInventory ? 'Edit Part' : 'Add New Part'}</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSaveInventory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select required value={invCategory} onChange={(e) => setInvCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md">
                        <option value="AC">AC</option>
                        <option value="WashingMachine">Washing Machine</option>
                        <option value="Refrigerator">Refrigerator</option>
                        <option value="Cooler">Cooler</option>
                        <option value="Fan">Fan</option>
                        <option value="Microwave">Microwave</option>
                        <option value="HouseWiring">House Wiring</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {invCategory === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Custom Category</label>
                        <input type="text" value={customInvCategory} onChange={(e) => setCustomInvCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Part Name</label>
                      <input required type="text" value={invPartName} onChange={(e) => setInvPartName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
                        <input required type="number" min="0" value={invStockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price (₹)</label>
                        <input required type="number" min="0" value={invCostPrice} onChange={(e) => setInvCostPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                      <input required type="number" min="0" value={invSellingPrice} onChange={(e) => setInvSellingPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md font-bold">{isEditingInventory ? 'Update' : 'Add'} Part</button>
                      {isEditingInventory && (
                        <button type="button" onClick={resetInventoryForm} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-bold">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-900">Inventory Stock</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-6 py-3 text-sm font-bold text-slate-700">Part Info</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-700">Pricing</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-700">Stock</th>
                        <th className="px-6 py-3 text-sm font-bold text-slate-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{item.partName}</div>
                            <div className="text-sm text-slate-500">{item.category}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">Sell: ₹{item.sellingPrice}</div>
                            <div className="text-sm text-slate-500">Cost: ₹{item.costPrice}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={\`px-2 py-1 rounded text-xs font-bold \${item.stockQuantity > 5 ? 'bg-green-100 text-green-800' : item.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}\`}>
                              {item.stockQuantity} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => editInventory(item)} className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded mr-2">Edit</button>
                            <button onClick={() => handleDeleteInventory(item.id!)} className="text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded">Delete</button>
                          </td>
                        </tr>
                      ))}
                      {inventory.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No inventory items found. Add some parts to get started.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>`;

if (!code.includes("activeTab === 'inventory' ? (")) {
  code = code.replace(
    ") : activeTab === 'analytics' ? (",
    inventoryJSX + "\n        ) : activeTab === 'analytics' ? ("
  );
  
  // Also we need to fix the setStockQuantity which is actually setInvStockQuantity
  code = code.replace(/setStockQuantity\(/g, "setInvStockQuantity(");
}

fs.writeFileSync('src/components/Admin.tsx', code);
