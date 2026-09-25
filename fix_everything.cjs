const fs = require('fs');

function replaceFile(path, regex, replacement) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(regex, replacement);
  fs.writeFileSync(path, code);
}

replaceFile('src/components/Features.tsx', /rtdb/g, 'rtdb'); // Wait, "Cannot find name 'rtdb'". I need to import it.
let feat = fs.readFileSync('src/components/Features.tsx', 'utf8');
if (!feat.includes("import { rtdb }")) {
  feat = feat.replace(/import \{ push, ref \} from 'firebase\/database';/, "import { push, ref } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';");
  fs.writeFileSync('src/components/Features.tsx', feat);
}

let hero = fs.readFileSync('src/components/HeroCarousel.tsx', 'utf8');
if (!hero.includes("import { rtdb }")) {
  hero = hero.replace(/import \{ ref, get \} from 'firebase\/database';/, "import { ref, get } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';");
  fs.writeFileSync('src/components/HeroCarousel.tsx', hero);
}

let chat = fs.readFileSync('src/components/LiveChat.tsx', 'utf8');
chat = chat.replace(/docRef\.id/g, "docRef.key"); // Firebase Realtime database ref returns .key not .id
fs.writeFileSync('src/components/LiveChat.tsx', chat);

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
if (!shop.includes("import { ref, get }")) {
  shop = shop.replace(/import React/, "import { ref, get } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\nimport React");
}
fs.writeFileSync('src/components/Shop.tsx', shop);

let wa = fs.readFileSync('src/components/WhatsAppButton.tsx', 'utf8');
wa = wa.replace(/import \{ collection, getDocs \} from 'firebase\/firestore';/, "");
wa = wa.replace(/const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);[\s\S]*?const admins = snap\.docs\.map\(doc => doc\.data\(\)\);/m, `
        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }
`);
if (!wa.includes("import { ref, get }")) {
  wa = wa.replace(/import React/, "import { ref, get } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\nimport React");
}
fs.writeFileSync('src/components/WhatsAppButton.tsx', wa);

let techDash = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');
techDash = techDash.replace(/import \{ getDocs, query, where, updateDoc, doc \} from 'firebase\/firestore';/, "import { ref, get } from 'firebase/database';");
techDash = techDash.replace(/const snapshot = await getDocs\(inventoryCollection\);[\s\S]*?setInventory\(snapshot\.docs\.map\(\(d: any\) => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\)\);/m, `
      const snapshot = await get(ref(rtdb, 'inventory'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         setInventory(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
         setInventory([]);
      }
`);
techDash = techDash.replace(/const q = query\(complaintsCollection, where\('phone', '==', phone\)\);[\s\S]*?const snapshot = await getDocs\(q\);[\s\S]*?setTrackedComplaints\(snapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as any\);/m, `
      const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }
`);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', techDash);

