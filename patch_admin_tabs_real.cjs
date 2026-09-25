const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldDesktopTabs = `                {user.role === 'super_admin' && (
                  <>
                    <button onClick={() => setActiveTab('complaints')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Global Complaints</button>
                    <button onClick={() => setActiveTab('areaAdmins')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Manage Area Admins</button>
                    <button onClick={() => setActiveTab('technicianApplications')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Pending Technicians</button>
                    <button onClick={() => setActiveTab('analytics')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>System Analytics</button>
                    <button onClick={() => setActiveTab('products')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Products</button>
                  </>
                )}`;

const newDesktopTabs = `                {user.role === 'super_admin' && (
                  <>
                    <button onClick={() => setActiveTab('analytics')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>📊 System Analytics</button>
                    <button onClick={() => setActiveTab('complaints')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>📋 Global Complaints</button>
                    <button onClick={() => setActiveTab('areaAdmins')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>👥 Manage Area Admins</button>
                    <button onClick={() => setActiveTab('technicianApplications')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>👨‍🔧 Pending Techs</button>
                    <button onClick={() => setActiveTab('ai-manager')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'ai-manager' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>🤖 AI Command Center</button>
                    <button onClick={() => setActiveTab('banner')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>🏷️ Banner & Offers</button>
                    <button onClick={() => setActiveTab('products')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>📦 Products</button>
                  </>
                )}`;

const oldMobileTabs = `             {user.role === 'super_admin' && (
               <>
                 <button onClick={() => setActiveTab('complaints')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Global Complaints</button>
                 <button onClick={() => setActiveTab('areaAdmins')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Manage Area Admins</button>
                 <button onClick={() => setActiveTab('technicianApplications')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Pending Techs</button>
                 <button onClick={() => setActiveTab('analytics')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>System Analytics</button>
               </>
             )}`;

const newMobileTabs = `             {user.role === 'super_admin' && (
               <>
                 <button onClick={() => setActiveTab('analytics')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>📊 Analytics</button>
                 <button onClick={() => setActiveTab('complaints')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>📋 Complaints</button>
                 <button onClick={() => setActiveTab('areaAdmins')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'areaAdmins' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>👥 Area Admins</button>
                 <button onClick={() => setActiveTab('technicianApplications')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>👨‍🔧 Pending Techs</button>
                 <button onClick={() => setActiveTab('ai-manager')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'ai-manager' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>🤖 AI Center</button>
                 <button onClick={() => setActiveTab('banner')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'banner' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>🏷️ Banners</button>
                 <button onClick={() => setActiveTab('products')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>📦 Products</button>
               </>
             )}`;

if (code.includes('Global Complaints') && !code.includes('🤖 AI Command Center')) {
  code = code.replace(oldDesktopTabs, newDesktopTabs);
  code = code.replace(oldMobileTabs, newMobileTabs);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Successfully patched tabs.');
} else {
  console.log('Tabs already patched or pattern not found.');
}
