const fs = require('fs');

let shop = fs.readFileSync('src/components/Shop.tsx', 'utf8');
shop = shop.replace(/const fetchedProducts = snapshot\.docs\.map\([\s\S]*?\)\) as Product\[\];\s*setProducts\(fetchedProducts\);/m, "");
fs.writeFileSync('src/components/Shop.tsx', shop);

let td = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');
td = td.replace(/import \{ ref, get, update, push, set \} from 'firebase\/database';/, "import { ref, get, update, push, set, onValue } from 'firebase/database';");
td = td.replace(/import \{ rtdb, db, complaintsCollection, techniciansCollection, inventoryCollection \} from '\.\.\/lib\/firebase';/, "import { db, complaintsCollection, techniciansCollection, inventoryCollection } from '../lib/firebase';");

td = td.replace(/setTrackedComplaints\(allComplaints\.filter\(c => c\.phone === phone\)\);\s*\}\s*setCustomerHistory\(history\?\.sort\(\(a, b\) => new Date\(b\.createdAt\)\.getTime\(\) - new Date\(a\.createdAt\)\.getTime\(\)\)\);/m, `
         const userHistory = allComplaints.filter(c => c.phone === phone);
         userHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
         setCustomerHistory(userHistory);
      }
`);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', td);
