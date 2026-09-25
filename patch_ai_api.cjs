const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/\/api\/ai-manager\/dashboard/g, '/api/assistant/dash');
serverCode = serverCode.replace(/\/api\/ai-manager\/command/g, '/api/assistant/cmd');
fs.writeFileSync('server.ts', serverCode);

let clientCode = fs.readFileSync('src/components/AIManager.tsx', 'utf8');
clientCode = clientCode.replace(/\/api\/ai-manager\/dashboard/g, '/api/assistant/dash');
clientCode = clientCode.replace(/\/api\/ai-manager\/command/g, '/api/assistant/cmd');
// Also slice the payload to avoid large payloads
clientCode = clientCode.replace(/body: JSON.stringify\(\{ complaints, inventory \}\)/g, "body: JSON.stringify({ complaints: complaints.slice(0, 100), inventory: inventory.slice(0, 100) })");
clientCode = clientCode.replace(/context: \{ complaints, inventory \}/g, "context: { complaints: complaints.slice(0, 100), inventory: inventory.slice(0, 100) }");
fs.writeFileSync('src/components/AIManager.tsx', clientCode);
console.log('Patched API endpoints');
