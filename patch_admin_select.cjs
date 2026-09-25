const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const selectStart = '{[...technicians, ...(JSON.parse(localStorage.getItem(\'app_area_techs\') || \'[]\'))].map(t => (';
const newSelectStart = '{[...new Map([...technicians, ...(JSON.parse(localStorage.getItem(\'app_area_techs\') || \'[]\'))].map(item => [item.id || item.phone, item])).values()].map(t => (';

code = code.replace(selectStart, newSelectStart);
fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Fixed assign dropdown deduplication');
