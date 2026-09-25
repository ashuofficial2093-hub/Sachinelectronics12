const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  `  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = ref(rtdb, 'products/' + id);
        remove(productRef).catch(e=>console.warn(e));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };`,
  `  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const productRef = ref(rtdb, 'products/' + id);
        await remove(productRef);
        alert('Deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };`
);

code = code.replace(
  `  const handleDeletePromo = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        remove(ref(rtdb, 'promotions/' + id)).catch(e=>console.warn(e));
        fetchPromotions();
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Failed to delete. Check console.");
      }
    }
  };`,
  `  const handleDeletePromo = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      try {
        await remove(ref(rtdb, 'promotions/' + id));
        alert('Deleted successfully');
        fetchPromotions();
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Failed to delete. Check console.");
      }
    }
  };`
);

fs.writeFileSync('src/components/Admin.tsx', code);
