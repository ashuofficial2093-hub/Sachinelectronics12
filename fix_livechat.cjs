const fs = require('fs');
let code = fs.readFileSync('src/components/LiveChat.tsx', 'utf8');

code = code.replace(/import \{ useState, useRef, useEffect \} from 'react';/, "import { useState, useRef, useEffect } from 'react';\nimport { push, ref } from 'firebase/database';\nimport { rtdb } from '../lib/firebase';");

fs.writeFileSync('src/components/LiveChat.tsx', code);
