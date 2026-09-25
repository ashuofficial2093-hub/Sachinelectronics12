const fs = require('fs');
let code = fs.readFileSync('src/components/HeroCarousel.tsx', 'utf8');

code = code.replace(/const q = query\(promotionsCollection, where\('isActive', '==', true\), orderBy\('order', 'asc'\)\);\s*const snapshot = await getDocs\(q\);\s*const data = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \} as Promotion\)\);\s*setPromotions\(data\);/m, `
        const snapshot = await get(ref(rtdb, 'promotions'));
        let activePromos: Promotion[] = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          activePromos = Object.keys(data).map(k => ({ id: k, ...data[k] })).filter(p => p.isActive) as Promotion[];
          activePromos.sort((a, b) => a.order - b.order);
        }
        setPromotions(activePromos);
`);

fs.writeFileSync('src/components/HeroCarousel.tsx', code);
