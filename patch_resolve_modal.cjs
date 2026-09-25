const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

if (!code.includes("const handleOpenResolveModal")) {
  code = code.replace(
    "const handleUpdateCustomStatus",
    "const handleOpenResolveModal = (id: string) => {\n    setResolvingComplaintId(id);\n    setResolutionModalOpen(true);\n  };\n\n  const handleUpdateCustomStatus"
  );
}

fs.writeFileSync('src/components/Admin.tsx', code);
