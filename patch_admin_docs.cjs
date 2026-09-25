const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /\{app\.documents\?\.aadhaar && \([\s\S]*?<\/[a-z]+>\s*\)\s*\}/,
  `{app.documents?.aadhaarFront && (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">Aadhaar Front</p>
      {app.documents.aadhaarFront.startsWith('data:application/pdf') ? (
         <div className="w-full h-32 flex items-center justify-center bg-slate-200 rounded-lg border border-slate-300 text-slate-600 font-bold text-sm">PDF Document</div>
      ) : (
         <img src={app.documents.aadhaarFront} alt="Aadhaar Front" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
      )}
    </div>
  )}
  {app.documents?.aadhaarBack && (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">Aadhaar Back</p>
      {app.documents.aadhaarBack.startsWith('data:application/pdf') ? (
         <div className="w-full h-32 flex items-center justify-center bg-slate-200 rounded-lg border border-slate-300 text-slate-600 font-bold text-sm">PDF Document</div>
      ) : (
         <img src={app.documents.aadhaarBack} alt="Aadhaar Back" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
      )}
    </div>
  )}`
);

code = code.replace(
  /\{app\.documents\?\.pan && \([\s\S]*?<\/[a-z]+>\s*\)\s*\}/,
  `{app.documents?.pan && (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">PAN Card</p>
      {app.documents.pan.startsWith('data:application/pdf') ? (
         <div className="w-full h-32 flex items-center justify-center bg-slate-200 rounded-lg border border-slate-300 text-slate-600 font-bold text-sm">PDF Document</div>
      ) : (
         <img src={app.documents.pan} alt="PAN" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
      )}
    </div>
  )}
  {app.documents?.dl && (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">Driving License</p>
      {app.documents.dl.startsWith('data:application/pdf') ? (
         <div className="w-full h-32 flex items-center justify-center bg-slate-200 rounded-lg border border-slate-300 text-slate-600 font-bold text-sm">PDF Document</div>
      ) : (
         <img src={app.documents.dl} alt="DL" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
      )}
    </div>
  )}`
);

fs.writeFileSync('src/components/Admin.tsx', code);
