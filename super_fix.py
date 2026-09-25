import re

def fix_file(filename):
    with open(filename, 'r') as f:
        code = f.read()

    if 'Shop.tsx' in filename:
        code = re.sub(r'const snapshot = await getDocs\(productsCollection\);\s*const productsData = snapshot\.docs\.map\(\(doc: any\) => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as Product\[\];', 
        """const snapshot = await get(ref(rtdb, 'products'));
      let productsData: Product[] = [];
      if (snapshot.exists()) {
         const data = snapshot.val();
         productsData = Object.keys(data).map(k => ({ id: k, ...data[k] })) as Product[];
      }""", code)
        code = re.sub(r'const snapshot = await getDocs\(productsCollection\);\s*const productsData = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as Product\[\];', 
        """const snapshot = await get(ref(rtdb, 'products'));
      let productsData: Product[] = [];
      if (snapshot.exists()) {
         const data = snapshot.val();
         productsData = Object.keys(data).map(k => ({ id: k, ...data[k] })) as Product[];
      }""", code)

    if 'WhatsAppButton.tsx' in filename:
        code = re.sub(r"const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);\s*const admins = snap\.docs\.map\(\(doc: any\) => doc\.data\(\)\);",
        """const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }""", code)
        code = re.sub(r"const snap = await getDocs\(collection\(db, 'areaAdmins'\)\);\s*const admins = snap\.docs\.map\(doc => doc\.data\(\)\);",
        """const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }""", code)

    if 'TechnicianDashboard.tsx' in filename:
        code = re.sub(r"const snapshot = await getDocs\(inventoryCollection\);\s*setInventory\(snapshot\.docs\.map\(\(d: any\) => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\)\);",
        """const snapshot = await get(ref(rtdb, 'inventory'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         setInventory(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
         setInventory([]);
      }""", code)
        code = re.sub(r"const q = query\(complaintsCollection, where\('phone', '==', phone\)\);\s*const snapshot = await getDocs\(q\);\s*setTrackedComplaints\(snapshot\.docs\.map\(\(d: any\) => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as any\);",
        """const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }""", code)
        code = re.sub(r"const q = query\(complaintsCollection, where\('phone', '==', phone\)\);\s*const snapshot = await getDocs\(q\);\s*setTrackedComplaints\(snapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\) as any\);",
        """const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }""", code)
        
        # Deduplicate imports
        code = re.sub(r"import \{ ref, get \} from 'firebase\/database';\n", "", code)
        code = re.sub(r"import \{ ref, get, update, push, set \} from 'firebase\/database';\n", "", code)
        code = re.sub(r"import \{ rtdb \} from '\.\.\/lib\/firebase';\n", "", code)
        code = "import { ref, get, update, push, set } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\n" + code

    with open(filename, 'w') as f:
        f.write(code)

for f in ['src/components/Shop.tsx', 'src/components/WhatsAppButton.tsx', 'src/components/TechnicianDashboard.tsx']:
    fix_file(f)
