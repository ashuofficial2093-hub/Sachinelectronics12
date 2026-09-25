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
wa = wa.replace(/const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);[\s\S]*?const admins = snap\.docs\.map\(doc => doc\.data\(\)\);/m, `
        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }
`);
fs.writeFileSync('src/components/WhatsAppButton.tsx', wa);

let techDash = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');
techDash = techDash.replace(/import \{ getDocs, query, where, updateDoc, doc \} from 'firebase\/firestore';/, "");
fs.writeFileSync('src/components/TechnicianDashboard.tsx', techDash);

