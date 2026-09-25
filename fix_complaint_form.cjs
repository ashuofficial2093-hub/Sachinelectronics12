const fs = require('fs');
let form = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

// Add ServiceRate to imports
form = form.replace(/import \{ Complaint \} from '\.\.\/types';/, "import { Complaint, ServiceRate } from '../types';");
// Import onValue if not there
if (!form.includes("onValue")) {
    form = form.replace(/import \{ push, ref, set, get \} from 'firebase\/database';/, "import { push, ref, set, get, onValue } from 'firebase/database';");
    form = form.replace(/import \{ ref, get, push \} from 'firebase\/database';/, "import { ref, get, push, onValue } from 'firebase/database';");
}

form = form.replace(
  "const [pricing, setPricing] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });",
  "const [pricing, setPricing] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });\n  const [serviceRates, setServiceRates] = useState<ServiceRate[]>([]);"
);

const oldEffect = /useEffect\(\(\) => \{\s*const fetchPricing = async \(\) => \{[\s\S]*?fetchPricing\(\);\s*\}, \[\]\);/m;
const newEffect = `useEffect(() => {
    const unsubPricing = onValue(ref(rtdb, 'settings/pricing'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPricing(prev => ({ ...prev, ...data, serviceFees: { ...prev.serviceFees, ...(data.serviceFees || {}) } }));
      }
    });

    const unsubServiceRates = onValue(ref(rtdb, 'serviceRates'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setServiceRates(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setServiceRates([]);
      }
    });

    return () => {
      unsubPricing();
      unsubServiceRates();
    };
  }, []);`;

form = form.replace(oldEffect, newEffect);

fs.writeFileSync('src/components/ComplaintForm.tsx', form);
