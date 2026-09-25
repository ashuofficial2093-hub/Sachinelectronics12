const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('TechnicianApplication')) {
  code = code + `
export interface TechnicianApplication {
  id?: string;
  fullName: string;
  mobile: string;
  whatsapp: string;
  city: string;
  experience: number;
  skills: string[];
  documents: {
    aadhaar?: string;
    pan?: string;
    dl?: string;
    photo?: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hold';
  createdAt: string;
}
`;
  fs.writeFileSync('src/types.ts', code);
}
