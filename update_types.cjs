const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('AreaAdmin')) {
  content += `

export interface AreaAdmin {
  id?: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  pincodes: string[];
  isActive: boolean;
  permissions: {
    canEditInventory: boolean;
    canAlertTechs: boolean;
    canWA: boolean;
  };
}

export interface CustomerLoyalty {
  id?: string;
  phone: string;
  coins: number;
  bookingsCount: number;
}
`;
}

if (!content.includes('pincode?: string;')) {
    content = content.replace('phone: string;', 'phone: string;\n  pincode?: string;');
}

fs.writeFileSync('src/types.ts', content);
