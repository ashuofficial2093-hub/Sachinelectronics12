const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Inside useEffect for complaints, let's add listeners for others.
const listeners = `
    const techniciansRef = ref(rtdb, 'technicians');
    const unsubTech = onValue(techniciansRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setTechnicians(Object.keys(val).map(key => ({ id: key, ...val[key] })));
        setActiveTechnicians(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setTechnicians([]);
        setActiveTechnicians([]);
      }
    });

    const areaAdminsRef = ref(rtdb, 'areaAdmins');
    const unsubAdmins = onValue(areaAdminsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setAreaAdmins(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setAreaAdmins([]);
      }
    });

    const inventoryRef = ref(rtdb, 'inventory');
    const unsubInv = onValue(inventoryRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setInventory(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setInventory([]);
      }
    });

    const productsRef = ref(rtdb, 'products');
    const unsubProducts = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setProducts(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setProducts([]);
      }
    });

    const promosRef = ref(rtdb, 'promotions');
    const unsubPromos = onValue(promosRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setPromotions(Object.keys(val).map(key => ({ id: key, ...val[key] })));
      } else {
        setPromotions([]);
      }
    });
`;

code = code.replace(
  `  useEffect(() => {
    const complaintsRef = ref(rtdb, 'complaints');`,
  `  useEffect(() => {\n${listeners}\n    const complaintsRef = ref(rtdb, 'complaints');`
);

code = code.replace(
  `    return () => unsubscribe();
  }, []);`,
  `    return () => {
      unsubscribe();
      unsubTech();
      unsubAdmins();
      unsubInv();
      unsubProducts();
      unsubPromos();
    };
  }, []);`
);

// We can remove the old fetch functions from fetchData
code = code.replace(
  `await Promise.all([fetchProducts(),  fetchBannerSettings(), fetchPricingSettings(), fetchInventory(), fetchTechnicians(), fetchPromotions(), fetchTechnicianApplications()]);`,
  `await Promise.all([fetchBannerSettings(), fetchPricingSettings(), fetchTechnicianApplications()]);`
);

fs.writeFileSync('src/components/Admin.tsx', code);
