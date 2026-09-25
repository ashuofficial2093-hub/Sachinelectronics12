const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Replace tab navigation for roles
// Replace the whole nav bar chunk
const navRegex = /<nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">.*?<\/nav>/s;
const newNav = `
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight hidden sm:block">
                {user?.role === 'super_admin' ? 'Super Admin Control' : user?.role === 'area_admin' ? \`\${user.name} - Regional Panel\` : 'Staff Dashboard'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <button onClick={() => setActiveTab('complaints')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Complaints</button>
              
              {user?.role === 'super_admin' && (
                <>
                  <button onClick={() => setActiveTab('analytics')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Analytics</button>
                  <button onClick={() => setActiveTab('areaAdmins')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Area Admins</button>
                  <button onClick={() => setActiveTab('products')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Products</button>
                  <button onClick={() => setActiveTab('inventory')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Inventory</button>
                  <button onClick={() => setActiveTab('technicians')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicians' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Technicians</button>
                  <button onClick={() => setActiveTab('technicianApplications')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Pending Techs</button>
                  <button onClick={() => setActiveTab('promotions')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'promotions' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Promotions</button>
                  <button onClick={() => setActiveTab('banner')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Top Banner</button>
                  <button onClick={() => setActiveTab('pricing')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Pricing</button>
                  <button onClick={() => setActiveTab('ai-manager')} className={\`px-3 py-2 rounded-md text-sm font-bold flex items-center gap-1.5 \${activeTab === 'ai-manager' ? 'bg-purple-100 text-purple-700' : 'text-purple-600 hover:bg-purple-50'}\`}>AI Manager</button>
                </>
              )}
              
              {user?.role === 'area_admin' && (
                <>
                  <button onClick={() => setActiveTab('analytics')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Local Analytics</button>
                  <button onClick={() => setActiveTab('inventory')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Local Inventory</button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user?.role === 'super_admin' && (
                 <button onClick={handleExportData} className="hidden md:flex items-center gap-1 text-green-700 font-medium hover:bg-green-50 px-3 py-2 rounded-md transition-colors text-sm">
                   <Download className="h-4 w-4" /> Export
                 </button>
              )}
              <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-2 rounded-md transition-colors">
                <Home className="h-4 w-4" /> <span className="hidden sm:inline">Back to Home</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-2 rounded-md transition-colors">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          <div className="flex md:hidden overflow-x-auto space-x-2 pb-2">
             <button onClick={() => setActiveTab('complaints')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Complaints</button>
             {user?.role === 'super_admin' && (
               <>
                 <button onClick={() => setActiveTab('analytics')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Analytics</button>
                 <button onClick={() => setActiveTab('areaAdmins')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Area Admins</button>
                 <button onClick={() => setActiveTab('products')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Products</button>
                 <button onClick={() => setActiveTab('inventory')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Inventory</button>
                 <button onClick={() => setActiveTab('technicians')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'technicians' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Technicians</button>
                 <button onClick={() => setActiveTab('technicianApplications')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Pending Techs</button>
                 <button onClick={() => setActiveTab('promotions')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'promotions' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Promotions</button>
                 <button onClick={() => setActiveTab('banner')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Top Banner</button>
                 <button onClick={() => setActiveTab('pricing')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'pricing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Pricing</button>
                 <button onClick={() => setActiveTab('ai-manager')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1.5 \${activeTab === 'ai-manager' ? 'bg-purple-100 text-purple-700' : 'text-purple-600 bg-purple-50'}\`}>AI Manager</button>
               </>
             )}
             {user?.role === 'area_admin' && (
                <>
                  <button onClick={() => setActiveTab('analytics')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Local Analytics</button>
                  <button onClick={() => setActiveTab('inventory')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Local Inventory</button>
                </>
             )}
          </div>
        </div>
      </nav>
`;
code = code.replace(navRegex, newNav);
fs.writeFileSync('src/components/Admin.tsx', code);
