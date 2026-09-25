const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

// The issue: TechnicianRegistration creates a new document via addDoc, but it also creates a local backup using a custom string ID 'local_'.
// Admin.tsx reads this local backup and tries to update it in Firestore using 'local_...' as the document ID, which doesn't exist in Firestore.

code = code.replace(
  /const application = \{[\s\S]*?id: 'local_' \+ Date\.now\(\),/m,
  (match) => {
    return match.replace(/id: 'local_' \+ Date\.now\(\),/, "id: Date.now().toString(),");
  }
);

// We need to use setDoc so that the ID is deterministic and matches the local ID exactly.
code = code.replace(
  "import { collection, addDoc } from 'firebase/firestore';",
  "import { collection, addDoc, setDoc, doc } from 'firebase/firestore';"
);

code = code.replace(
  /addDoc\(collection\(db, 'technicianApplications'\), application\)\.catch\(err => console\.error\("Firebase save failed:", err\)\);/g,
  `setDoc(doc(db, 'technicianApplications', application.id), application).catch(err => console.error("Firebase save failed:", err));`
);

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
console.log('Patched TechnicianRegistration');
