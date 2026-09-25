const fs = require('fs');

function ensureImport(path) {
  let code = fs.readFileSync(path, 'utf8');
  if (!code.includes("import { ref, get } from 'firebase/database';")) {
     code = "import { ref, get } from 'firebase/database';\n" + code;
  }
  if (!code.includes("import { rtdb } from '../lib/firebase';")) {
     code = "import { rtdb } from '../lib/firebase';\n" + code;
  }
  fs.writeFileSync(path, code);
}

ensureImport('src/components/HeroCarousel.tsx');
ensureImport('src/components/Shop.tsx');
ensureImport('src/components/WhatsAppButton.tsx');
ensureImport('src/components/TechnicianDashboard.tsx');

let shop = fs.readFileSync('src/components/Shop.tsx', 'utf8');
shop = shop.replace(/import \{ getDocs \} from 'firebase\/firestore';/, "");
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
wa = wa.replace(/import \{ collection, getDocs \} from 'firebase\/firestore';/, "");
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
td = td.replace(/import \{ getDocs, query, where, updateDoc, doc \} from 'firebase\/firestore';/, "");
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
