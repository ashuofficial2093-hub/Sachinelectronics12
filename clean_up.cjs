const fs = require('fs');

let shop = fs.readFileSync('src/components/Shop.tsx', 'utf8');
shop = shop.replace(/const snapshot = await getDocs\(productsCollection\);[\s\S]*?setProducts\(productsData\);/m, `
      const snapshot = await get(ref(rtdb, 'products'));
      let productsData: Product[] = [];
      if (snapshot.exists()) {
         const data = snapshot.val();
         productsData = Object.keys(data).map(k => ({ id: k, ...data[k] })) as Product[];
      }
      setProducts(productsData);
`);
fs.writeFileSync('src/components/Shop.tsx', shop);

let wa = fs.readFileSync('src/components/WhatsAppButton.tsx', 'utf8');
wa = wa.replace(/const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);[\s\S]*?const admins = snap\.docs\.map\(\(doc: any\) => doc\.data\(\)\);/m, `
        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }
`);
wa = wa.replace(/const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);[\s\S]*?const admins = snap\.docs\.map\(doc => doc\.data\(\)\);/m, `
        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }
`);
fs.writeFileSync('src/components/WhatsAppButton.tsx', wa);

let td = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');
// Fix duplicate imports
td = td.replace(/import \{ ref, get \} from 'firebase\/database';\nimport \{ ref, get \} from 'firebase\/database';\n/, "import { ref, get } from 'firebase/database';\n");
td = td.replace(/import \{ rtdb \} from '\.\.\/lib\/firebase';\nimport \{ rtdb \} from '\.\.\/lib\/firebase';\n/, "import { rtdb } from '../lib/firebase';\n");
td = td.replace(/import \{ rtdb \} from '\.\.\/lib\/firebase';\n/, ""); // Just remove all and add 1
td = td.replace(/import \{ ref, get \} from 'firebase\/database';\n/, ""); // Just remove all and add 1
td = td.replace(/import \{ ref, get \} from 'firebase\/database';\n/, ""); // Just remove all and add 1
td = "import { ref, get, update, push, set } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\n" + td;

td = td.replace(/const snapshot = await getDocs\(inventoryCollection\);[\s\S]*?setInventory\(snapshot\.docs\.map\(\(d: any\) => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\)\);/m, `
      const snapshot = await get(ref(rtdb, 'inventory'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         setInventory(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
         setInventory([]);
      }
`);
td = td.replace(/const q = query\(complaintsCollection, where\('phone', '==', phone\)\);[\s\S]*?const snapshot = await getDocs\(q\);[\s\S]*?setTrackedComplaints\(snapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as any\);/m, `
      const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }
`);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', td);
