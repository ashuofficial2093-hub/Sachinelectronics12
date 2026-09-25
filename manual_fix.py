import re

def fix(filename):
    with open(filename, 'r') as f:
        code = f.read()

    # Shop.tsx
    if 'Shop.tsx' in filename:
        lines = code.split('\n')
        new_lines = []
        for line in lines:
            if 'const snapshot = await getDocs(productsCollection);' in line:
                new_lines.append("""      const snapshot = await get(ref(rtdb, 'products'));
      let productsData: Product[] = [];
      if (snapshot.exists()) {
         const data = snapshot.val();
         productsData = Object.keys(data).map(k => ({ id: k, ...data[k] })) as Product[];
      }""")
            elif 'const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];' in line or 'const productsData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as Product[];' in line:
                pass
            else:
                new_lines.append(line)
        code = '\n'.join(new_lines)
        code = code.replace("import { ref, get } from 'firebase/database';", "")
        code = code.replace("import { rtdb } from '../lib/firebase';", "")
        code = "import { ref, get } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\n" + code

    # WhatsAppButton.tsx
    if 'WhatsAppButton.tsx' in filename:
        lines = code.split('\n')
        new_lines = []
        skip_next = False
        for i, line in enumerate(lines):
            if skip_next:
                skip_next = False
                continue
            if "const snap = await getDocs(collection(db, 'areaAdmins'));" in line:
                new_lines.append("""        const snap = await get(ref(rtdb, 'areaAdmins'));
        let admins: any[] = [];
        if (snap.exists()) {
           const data = snap.val();
           admins = Object.keys(data).map(k => data[k]);
        }""")
                skip_next = True
            else:
                new_lines.append(line)
        code = '\n'.join(new_lines)
        code = code.replace("import { ref, get } from 'firebase/database';", "")
        code = code.replace("import { rtdb } from '../lib/firebase';", "")
        code = "import { ref, get } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\n" + code

    # TechnicianDashboard.tsx
    if 'TechnicianDashboard.tsx' in filename:
        lines = code.split('\n')
        new_lines = []
        skip = 0
        for i, line in enumerate(lines):
            if skip > 0:
                skip -= 1
                continue
            if "const snapshot = await getDocs(inventoryCollection);" in line:
                new_lines.append("""      const snapshot = await get(ref(rtdb, 'inventory'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         setInventory(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
         setInventory([]);
      }""")
                skip = 1
            elif "const q = query(complaintsCollection, where('phone', '==', phone));" in line:
                new_lines.append("""      const snapshot = await get(ref(rtdb, 'complaints'));
      if (snapshot.exists()) {
         const data = snapshot.val();
         const allComplaints = Object.keys(data).map(k => ({ id: k, ...data[k] }));
         setTrackedComplaints(allComplaints.filter(c => c.phone === phone));
      }""")
                skip = 2
            else:
                new_lines.append(line)
        code = '\n'.join(new_lines)
        code = re.sub(r"import \{ ref, get.*?\} from 'firebase\/database';\n?", "", code)
        code = re.sub(r"import \{ rtdb \} from '\.\.\/lib\/firebase';\n?", "", code)
        code = "import { ref, get, update, push, set } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';\n" + code

    with open(filename, 'w') as f:
        f.write(code)

fix('src/components/Shop.tsx')
fix('src/components/WhatsAppButton.tsx')
fix('src/components/TechnicianDashboard.tsx')
