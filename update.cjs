const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  "appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId,",
  "appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId,\n  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || \"https://sachin-electronics-default-rtdb.asia-southeast1.firebasedatabase.app\","
);

fs.writeFileSync('src/lib/firebase.ts', code);
