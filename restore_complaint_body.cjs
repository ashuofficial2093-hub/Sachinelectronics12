const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

const restorePointRegex = /export default function ComplaintForm\(\) \{[\s\S]*?const \[searchTerm, setSearchTerm\] = useState\(''\);/m;

const restoredHooks = `export default function ComplaintForm() {
  const [activeTab, setActiveTab] = useState<'book' | 'track'>('book');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [phone, setPhone] = useState('');
  const [applyCoins, setApplyCoins] = useState(false);
  const [loyaltyCoins, setLoyaltyCoins] = useState(0);
  const [pricing, setPricing] = useState({ homeVisitCharge: 250, serviceFees: { 'AC': 200, 'WashingMachine': 150, 'Refrigerator': 150, 'Cooler': 100, 'Fan': 50, 'Microwave': 150, 'HouseWiring': 150, 'Other': 100 } });
  const [issueImage, setIssueImage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [address, setAddress] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');`;

code = code.replace(restorePointRegex, restoredHooks);

const submitFuncInsert = `const handleTrackComplaint = async (e: React.FormEvent) => {`;
const submitFuncLogic = `const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phoneInput = formData.get('phone') as string;
    const pincode = formData.get('pincode') as string;
    const addressInput = formData.get('address') as string;
    let finalPincode = pincode || '000000';
    const pinMatch = addressInput.match(/\\b\\d{6}\\b/) || pincode.match(/\\b\\d{6}\\b/);
    if (pinMatch) finalPincode = pinMatch[0];

    const baseProduct = formData.get('product') as string;
    const product = baseProduct === 'Other' ? formData.get('customProduct') as string : baseProduct;
    const issue = formData.get('issue') as string;
    const priority = formData.get('priority') as 'Normal' | 'Urgent';
    const timeslot = formData.get('timeslot') as string;

    try {
      let assignedAreaAdminId = null;
      try {
        const localAdmins = safeJSONParse(localStorage.getItem('app_area_admins'), []);
        const localMatch = localAdmins.find((a: any) => a.pincodes && a.pincodes.includes(finalPincode) && a.isActive);
        if (localMatch) assignedAreaAdminId = localMatch.id;
      } catch (err) {}
      
      const serviceFee = pricing.serviceFees[baseProduct] !== undefined ? pricing.serviceFees[baseProduct] : (pricing.serviceFees['Other'] || 100);
      const discount = applyCoins ? Math.floor(loyaltyCoins / 10) : 0;
      const estTotal = Math.max(0, pricing.homeVisitCharge + serviceFee - discount);

      const newComplaintData = {
        assignedAreaAdminId,
        autoRouted: !!assignedAreaAdminId,
        name,
        phone: phoneInput,
        pincode: finalPincode,
        address: addressInput,
        product,
        issue,
        ...(issueImage && { issueImageUrl: issueImage }),
        priority,
        timeslot,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        serviceFee,
        discount,
        estTotal
      };

      const complaintsListRef = ref(rtdb, 'complaints');
      const newComplaintRef = push(complaintsListRef);
      set(newComplaintRef, newComplaintData).catch(err => console.warn('RTDB Error:', err));
      const newComplaintId = newComplaintRef.key || Date.now().toString();

      const localComplaints = safeJSONParse(localStorage.getItem('app_complaints'), []);
      localComplaints.push({ id: newComplaintId, ...newComplaintData });
      localStorage.setItem('app_complaints', JSON.stringify(localComplaints));

      const currentHour = new Date().getHours();
      const isClosed = currentHour < 9 || currentHour >= 21;
      const hoursMessage = isClosed ? '\\n\\n*Note:* Our shop is currently closed. Our technician will connect with you first thing tomorrow morning.' : '';
      const receiptMessage = \`*🛠️ Booking Confirmed!*\\n\\n*Job ID:* \${newComplaintId.substring(0, 8).toUpperCase()}\\n*Name:* \${name}\\n*Appliance:* \${product}\\n*Issue:* \${issue}\\n*Timeslot:* \${timeslot}\\n*Status:* Pending\\n*Location:* \${addressInput}\\n\\n*Cost Estimate:*\\nHome Visit Charge: ₹\${pricing.homeVisitCharge}\\nService Fee: ₹\${serviceFee}\\n\${applyCoins ? \`Coins Discount: -₹\${discount}\\n\` : ''}*Estimated Total: ₹\${estTotal}*\\n(Note: Spare parts/hardware replacement charges are extra if required)\${hoursMessage}\\n\\nThank you for choosing Sachin Electricals!\`;
      
      let adminPhone = "918381892161";
      try {
        const localAdmins = safeJSONParse(localStorage.getItem('app_area_admins'), []);
        const matchingAdmin = localAdmins.find((a: any) => a.pincodes && a.pincodes.includes(finalPincode) && a.isActive);
        if (matchingAdmin && matchingAdmin.phone) {
          adminPhone = matchingAdmin.phone.replace(/[^0-9]/g, '');
          if (adminPhone.length === 10) adminPhone = "91" + adminPhone;
        }
      } catch(e) {}
      
      const whatsappUrl = \`https://wa.me/\${adminPhone}?text=\${encodeURIComponent(receiptMessage)}\`;
      setIsSuccess(true);
      window.open(whatsappUrl, '_blank');
      
      setTimeout(() => setIsSuccess(false), 3000);
      (e.target as HTMLFormElement).reset();
      setIssueText('');
      setCustomProduct('');
      setIssueImage(null);
    } catch (error) {
      console.warn("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackComplaint = async (e: React.FormEvent) => {`;

code = code.replace(submitFuncInsert, submitFuncLogic);

// Add useEffects back
const useEffectsLogic = `
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const localPricing = localStorage.getItem('app_pricing_settings');
        if (localPricing) setPricing(JSON.parse(localPricing));
        const snapshot = await get(ref(rtdb, 'settings/pricing'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPricing(prev => {
            const newSettings = { ...prev, ...data, serviceFees: { ...prev.serviceFees, ...(data.serviceFees || {}) } };
            localStorage.setItem('app_pricing_settings', JSON.stringify(newSettings));
            return newSettings;
          });
        }
      } catch (error) {}
    };
    fetchPricing();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported by your browser"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${position.coords.latitude}&lon=\${position.coords.longitude}&format=json\`);
        const data = await response.json();
        setAddress(data.display_name);
      } catch (error) {}
      setIsLocating(false);
    }, () => {
      setIsLocating(false);
    });
  };

  const handleSubmit = async `;
code = code.replace("const handleSubmit = async ", useEffectsLogic);

fs.writeFileSync('src/components/ComplaintForm.tsx', code);
