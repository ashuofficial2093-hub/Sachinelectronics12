const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

code = code.replace(
  `import { ref, get, update } from 'firebase/database';`,
  `import { ref, get, update, remove } from 'firebase/database';`
);

code = code.replace(
  `      import('firebase/database').then(({ ref, remove }) => {
        remove(ref(rtdb, 'complaints/' + id)).then(() => {
          alert('Deleted successfully');
        }).catch(e => {
          console.warn('Error deleting complaint', e);
          alert('Failed to delete complaint');
        });
      });`,
  `      remove(ref(rtdb, 'complaints/' + id)).then(() => {
        alert('Deleted successfully');
      }).catch(e => {
        console.warn('Error deleting complaint', e);
        alert('Failed to delete complaint');
      });`
);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
