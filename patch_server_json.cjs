const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'res.json(JSON.parse(response.text || "{}"));',
  'const text = (response.text || "{}").replace(/^```json\\n?/g, "").replace(/\\n?```$/g, "").trim();\n    res.json(JSON.parse(text));'
);

fs.writeFileSync('server.ts', code);
console.log("Patched JSON parsing");
