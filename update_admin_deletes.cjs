const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. handleDeleteActiveTech -> add remove(ref(rtdb, 'technicians/' + id))
code = code.replace(
`  const handleDeleteActiveTech = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      let activeTechs = safeJSONParse(localStorage.getItem('app_active_technicians'), []);
      activeTechs = activeTechs.filter((t: any) => t.id !== id && t.phone !== id);
      localStorage.setItem('app_active_technicians', JSON.stringify(activeTechs));
      setActiveTechnicians(activeTechs);
      setTechnicians(activeTechs);
    }
  };`,
`  const handleDeleteActiveTech = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technician? This action cannot be undone.')) {
      let activeTechs = safeJSONParse(localStorage.getItem('app_active_technicians'), []);
      activeTechs = activeTechs.filter((t: any) => t.id !== id && t.phone !== id);
      localStorage.setItem('app_active_technicians', JSON.stringify(activeTechs));
      setActiveTechnicians(activeTechs);
      setTechnicians(activeTechs);
      // Remove from Firebase
      remove(ref(rtdb, 'technicians/' + id)).then(() => {
        alert('Deleted successfully');
      }).catch(e => console.warn(e));
    }
  };`
);

// 2. handleDeleteById (Area Admins) -> add remove(ref(rtdb, 'areaAdmins/' + idToDelete))
code = code.replace(
`  const handleDeleteById = (idToDelete: string, index?: number) => {
    console.log("Attempting to delete ID/Index:", idToDelete, index);
    setAreaAdmins((prev) => {
      const updatedList = prev?.filter((admin: any, i: number) => {
        if (idToDelete) return String(admin.id) !== String(idToDelete);
        if (index !== undefined) return i !== index;
        return true;
      });
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
  };`,
`  const handleDeleteById = (idToDelete: string, index?: number) => {
    console.log("Attempting to delete ID/Index:", idToDelete, index);
    setAreaAdmins((prev) => {
      const updatedList = prev?.filter((admin: any, i: number) => {
        if (idToDelete) return String(admin.id) !== String(idToDelete);
        if (index !== undefined) return i !== index;
        return true;
      });
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
    if (idToDelete) {
      remove(ref(rtdb, 'areaAdmins/' + idToDelete)).then(() => {
        alert('Deleted successfully');
      }).catch(e => console.warn(e));
    } else {
      alert('Deleted successfully');
    }
  };`
);

// 3. handleDeleteInventory -> add alert
code = code.replace(
`  const handleDeleteInventory = async (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        const invRef = ref(rtdb, 'inventory/' + id);
        remove(invRef).catch(e=>console.warn(e));
        fetchInventory();
      } catch (error) {
        console.error("Error deleting inventory item:", error);
      }
    }
  };`,
`  const handleDeleteInventory = async (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item? This action cannot be undone.')) {
      try {
        const invRef = ref(rtdb, 'inventory/' + id);
        await remove(invRef);
        alert('Deleted successfully');
        fetchInventory();
      } catch (error) {
        console.error("Error deleting inventory item:", error);
      }
    }
  };`
);

// 4. add handleDeleteComplaint to Admin.tsx
if (!code.includes('handleDeleteComplaint')) {
  const deleteComplaintFunc = `
  const handleDeleteComplaint = (id: string) => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      remove(ref(rtdb, 'complaints/' + id)).then(() => {
        alert('Deleted successfully');
      }).catch(e => {
        console.warn('Error deleting complaint', e);
        alert('Failed to delete complaint');
      });
    }
  };
`;
  code = code.replace(/  const handleAssignAreaAdmin = /g, deleteComplaintFunc + "\n  const handleAssignAreaAdmin = ");
}

// Pass handleDeleteComplaint to MasterComplaintsView
code = code.replace(
`          <MasterComplaintsView
            areaAdmins={areaAdmins}
            handleAssignAreaAdmin={handleAssignAreaAdmin}`,
`          <MasterComplaintsView
            areaAdmins={areaAdmins}
            handleAssignAreaAdmin={handleAssignAreaAdmin}
            handleDeleteComplaint={handleDeleteComplaint}`
);

fs.writeFileSync('src/components/Admin.tsx', code);
