const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

// We will use standard string replacements to inject loyalty logic

// 1. imports
code = code.replace(
  "import { db, complaintsCollection } from '../lib/firebase';",
  "import { db, complaintsCollection, loyaltyCollection } from '../lib/firebase';\nimport { query, where, getDocs, updateDoc } from 'firebase/firestore';"
);

// 2. states
code = code.replace(
  "  const [phoneText, setPhoneText] = useState('');", // wait, there is no phoneText state!
  "" 
);

const stateInsert = `
  const [phoneText, setPhoneText] = useState('');
  const [pincodeText, setPincodeText] = useState('');
  const [loyaltyCoins, setLoyaltyCoins] = useState(0);
  const [applyCoins, setApplyCoins] = useState(false);
  const [loyaltyDocId, setLoyaltyDocId] = useState<string | null>(null);
  
  const checkLoyalty = async (phone: string) => {
    if(phone.length !== 10) { setLoyaltyCoins(0); setLoyaltyDocId(null); setApplyCoins(false); return; }
    try {
      const q = query(loyaltyCollection, where("phone", "==", phone));
      const snap = await getDocs(q);
      if(!snap.empty) {
        setLoyaltyCoins(snap.docs[0].data().coins || 0);
        setLoyaltyDocId(snap.docs[0].id);
      } else {
        setLoyaltyCoins(0);
        setLoyaltyDocId(null);
      }
    } catch(e) {}
  };
`;
code = code.replace("const [isSuccess, setIsSuccess] = useState(false);", "const [isSuccess, setIsSuccess] = useState(false);" + stateInsert);

// 3. input replacements
code = code.replace(
  'id="phone" minLength={10} maxLength={10} pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Enter your 10-digit number" />',
  'id="phone" value={phoneText} onChange={(e) => { setPhoneText(e.target.value); if(e.target.value.length === 10) checkLoyalty(e.target.value); }} minLength={10} maxLength={10} pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Enter your 10-digit number" />'
);

const pincodeInsert = `
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-semibold text-slate-700 mb-2">PIN Code</label>
                    <input required type="text" name="pincode" id="pincode" value={pincodeText} onChange={(e) => setPincodeText(e.target.value)} minLength={6} maxLength={6} pattern="[0-9]{6}" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Enter 6-digit PIN code" />
                  </div>
`;
code = code.replace(
  '<div>\n                    <label htmlFor="phone"',
  pincodeInsert + '\n                  <div>\n                    <label htmlFor="phone"'
);

// 4. handleSubmit extraction
code = code.replace(
  "const phone = DOMPurify.sanitize(formData.get('phone') as string);",
  "const phone = DOMPurify.sanitize(formData.get('phone') as string);\n    const pincode = DOMPurify.sanitize(formData.get('pincode') as string);"
);
code = code.replace(
  "phone,",
  "phone,\n        pincode,"
);

// 5. checkout section update for coins
const checkoutDisplayRegex = /<div className="flex justify-between text-sm text-slate-600">\s*<span>Service Charge.*?\s*<span className="font-medium text-slate-900">\s*₹.*?\s*<\/span>\s*<\/div>\s*\)}/s;
const checkoutMatch = code.match(checkoutDisplayRegex);
if(checkoutMatch) {
  const loyaltyUI = `
                      {loyaltyCoins > 0 && (
                        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-blue-100 pt-2 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={applyCoins} onChange={(e) => setApplyCoins(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                            <span>Use {loyaltyCoins} Loyalty Coins (₹{Math.floor(loyaltyCoins / 10)})</span>
                          </label>
                          <span className="font-medium text-green-600">
                            {applyCoins ? \`-₹\${Math.floor(loyaltyCoins / 10)}\` : '₹0'}
                          </span>
                        </div>
                      )}
  `;
  code = code.replace(checkoutMatch[0], checkoutMatch[0] + loyaltyUI);
  
  // modify estimated total
  code = code.replace(
    "<span>₹{pricing.homeVisitCharge + (selectedProduct ? (pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100)) : 0)}</span>",
    "<span>₹{Math.max(0, pricing.homeVisitCharge + (selectedProduct ? (pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100)) : 0) - (applyCoins ? Math.floor(loyaltyCoins / 10) : 0))}</span>"
  );
  
  // handle coins in handleSubmit
  code = code.replace(
    "const estTotal = pricing.homeVisitCharge + serviceFee;",
    "const discount = applyCoins ? Math.floor(loyaltyCoins / 10) : 0;\n      const estTotal = Math.max(0, pricing.homeVisitCharge + serviceFee - discount);"
  );
  
  code = code.replace(
    "Service Fee: ₹${serviceFee}\\n",
    "Service Fee: ₹${serviceFee}\\n${applyCoins ? `Coins Discount: -₹${discount}\\n` : ''}"
  );
  
  // add loyalty logic after addDoc
  const addDocEndRegex = /const docRef = await addDoc\(complaintsCollection, \{[\s\S]*?\}\);/;
  const addDocMatch = code.match(addDocEndRegex);
  if(addDocMatch) {
    const postSaveLogic = `
      // Handle Loyalty Update
      try {
        if(loyaltyDocId) {
          const lRef = doc(db, 'loyalty', loyaltyDocId);
          await updateDoc(lRef, {
            coins: (applyCoins ? loyaltyCoins - discount * 10 : loyaltyCoins) + 100,
            bookingsCount: (loyaltyCoins > 0 ? 2 : 1) // simplificaton
          });
        } else {
          await addDoc(loyaltyCollection, {
            phone,
            coins: 500, // 1st booking bonus
            bookingsCount: 1
          });
        }
      } catch(e) { console.error("Loyalty error", e); }
    `;
    code = code.replace(addDocMatch[0], addDocMatch[0] + postSaveLogic);
  }
}

fs.writeFileSync('src/components/ComplaintForm.tsx', code);
