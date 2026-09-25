const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// When updating a technician application, it might be entirely local (no Firestore document).
// If the document doesn't exist, updateDoc throws an error. We should use setDoc with merge: true instead.

code = code.replace(
  /await updateDoc\(docRef, \{ status: newStatus, reason \}\);/g,
  `await setDoc(docRef, { status: newStatus, reason }, { merge: true });`
);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched Admin.tsx to use setDoc instead of updateDoc');
