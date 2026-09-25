const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /bg-white rounded-xl shadow-sm border border-slate-200/g,
  "bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:border-blue-200/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
);

// Also replace navbar background
code = code.replace(
  /bg-white border-b border-slate-200 sticky top-0/g,
  "bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgb(0,0,0,0.03)] sticky top-0"
);

// Replace input focus outlines to use glow
code = code.replace(
  /focus:ring-blue-500 focus:border-blue-500/g,
  "focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
);

fs.writeFileSync('src/components/Admin.tsx', code);
