const fs = require('fs');

function processFile(path) {
  let code = fs.readFileSync(path, 'utf8');
  if (path.includes('TechnicianRegistration.tsx')) {
    code = code.replace(/import \{ collection, addDoc, setDoc, doc \} from 'firebase\/firestore';/, "");
  }
  if (path.includes('Features.tsx')) {
    code = code.replace(/import \{ addDoc, collection \} from 'firebase\/firestore';/, "");
    code = code.replace(/await addDoc\(collection\(db, 'feedback'\), \{/g, "await push(ref(rtdb, 'feedback'), {");
    if (!code.includes("import { push, ref } from 'firebase/database';")) {
       code = code.replace(/import React/, "import { push, ref } from 'firebase/database';\nimport React");
    }
    code = code.replace(/db, /g, "rtdb, ");
  }
  if (path.includes('HeroCarousel.tsx')) {
    code = code.replace(/import \{ getDocs, query, where, orderBy \} from 'firebase\/firestore';/, "");
    code = code.replace(/const q = query\(promotionsCollection, where\('isActive', '==', true\), orderBy\('order', 'asc'\)\);\s*const snapshot = await getDocs\(q\);\s*const activePromos = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as Promotion\[\];/m, `
        const snapshot = await get(ref(rtdb, 'promotions'));
        let activePromos: Promotion[] = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          activePromos = Object.keys(data).map(k => ({ id: k, ...data[k] })).filter(p => p.isActive) as Promotion[];
          activePromos.sort((a, b) => a.order - b.order);
        }
    `);
    if (!code.includes("import { ref, get } from 'firebase/database';")) {
       code = code.replace(/import React/, "import { ref, get } from 'firebase/database';\nimport React");
    }
  }
  if (path.includes('LiveChat.tsx')) {
    code = code.replace(/import \{ addDoc \} from 'firebase\/firestore';/, "");
    code = code.replace(/addDoc\(complaintsCollection, newComplaint\)\.then\(docRef => \{/g, "push(ref(rtdb, 'complaints'), newComplaint).then(docRef => {");
    code = code.replace(/const docRef = await addDoc\(complaintsCollection, newComplaint\);/g, "const docRef = await push(ref(rtdb, 'complaints'), newComplaint);");
    if (!code.includes("import { push, ref } from 'firebase/database';")) {
       code = code.replace(/import React/, "import { push, ref } from 'firebase/database';\nimport React");
    }
  }
  if (path.includes('Shop.tsx')) {
    code = code.replace(/import \{ getDocs \} from 'firebase\/firestore';/, "");
    code = code.replace(/const snapshot = await getDocs\(productsCollection\);\s*const productsData = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as Product\[\];/m, `
      const snapshot = await get(ref(rtdb, 'products'));
      let productsData: Product[] = [];
      if (snapshot.exists()) {
         const data = snapshot.val();
         productsData = Object.keys(data).map(k => ({ id: k, ...data[k] })) as Product[];
      }
    `);
    if (!code.includes("import { ref, get } from 'firebase/database';")) {
       code = code.replace(/import React/, "import { ref, get } from 'firebase/database';\nimport React");
    }
  }
  if (path.includes('WhatsAppButton.tsx')) {
    code = code.replace(/import \{ collection, getDocs \} from 'firebase\/firestore';/, "");
    code = code.replace(/const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);\s*const admins = snap\.docs\.map\(doc => doc\.data\(\)\);/m, `
        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }
    `);
    if (!code.includes("import { ref, get } from 'firebase/database';")) {
       code = code.replace(/import React/, "import { ref, get } from 'firebase/database';\nimport React");
    }
  }
  if (path.includes('ComplaintForm.tsx')) {
    code = code.replace(/import \{ addDoc, getDocs, query, where, doc, getDoc, updateDoc \} from 'firebase\/firestore';/, "");
    code = code.replace(/const q = query\(loyaltyCollection, where\("phone", "==", phoneNumber\)\);\s*const snap = await getDocs\(q\);/m, `
      const snap = await get(ref(rtdb, 'loyalty'));
      let loyaltyData = null;
      if (snap.exists()) {
         const allLoyalty = snap.val();
         const match = Object.keys(allLoyalty).find(k => allLoyalty[k].phone === phoneNumber);
         if (match) loyaltyData = allLoyalty[match];
      }
      const pseudoSnap = { empty: !loyaltyData, docs: loyaltyData ? [{ data: () => loyaltyData }] : [] };
      const snapObj = pseudoSnap;
    `);
    code = code.replace(/snap\.empty/g, "snapObj.empty");
    code = code.replace(/snap\.docs\[0\]/g, "snapObj.docs[0]");
  }
  
  fs.writeFileSync(path, code);
}

['src/components/Features.tsx', 'src/components/HeroCarousel.tsx', 'src/components/LiveChat.tsx', 'src/components/Shop.tsx', 'src/components/WhatsAppButton.tsx', 'src/components/ComplaintForm.tsx', 'src/components/TechnicianRegistration.tsx'].forEach(processFile);
