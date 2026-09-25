const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

// Replace localStorage get pricing with RTDB fetch
code = code.replace(/const localPricing = localStorage\.getItem\('app_pricing_settings'\);\s*if \(localPricing\) \{\s*setPricingSettings\(JSON\.parse\(localPricing\)\);\s*\}/, '');
code = code.replace(/localStorage\.setItem\('app_pricing_settings', JSON\.stringify\(newSettings\)\);/, '');

// Replace localStorage get area admins with RTDB fetch inside the handlePincodeChange (or wherever it is)
// We should probably rely on the root `onValue` or just fetch once in ComplaintForm using `get()` from rtdb.
