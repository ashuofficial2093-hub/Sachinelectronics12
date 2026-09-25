const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldUseEffect = `  useEffect(() => {
    const savedAdmins = localStorage.getItem('app_area_admins');
    if (savedAdmins) {
      const parsed = JSON.parse(savedAdmins);
      let needsSave = false;
      const verified = parsed.map((a: any) => {
        if (!a.id) {
          needsSave = true;
          return { ...a, id: Date.now().toString() + Math.random().toString(36).substring(7) };
        }
        return a;
      });
      if (needsSave) localStorage.setItem('app_area_admins', JSON.stringify(verified));
      setAreaAdmins(verified);
    }
  }, []);`;

const newUseEffect = `  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
    const fixedData = saved.map((admin: any) => ({
      ...admin,
      id: admin.id || Date.now().toString() + Math.random() // Give ID if missing
    }));
    setAreaAdmins(fixedData);
    localStorage.setItem('app_area_admins', JSON.stringify(fixedData));
  }, []);`;

code = code.replace(oldUseEffect, newUseEffect);

const oldFetch = `  const fetchAreaAdmins = async () => {
    try {
      const localAdmins = localStorage.getItem('app_area_admins');
      if (localAdmins) {
        const parsed = JSON.parse(localAdmins);
        let needsSave = false;
        const verified = parsed.map((a: any) => {
          if (!a.id) {
            needsSave = true;
            return { ...a, id: Date.now().toString() + Math.random().toString(36).substring(7) };
          }
          return a;
        });
        if (needsSave) localStorage.setItem('app_area_admins', JSON.stringify(verified));
        setAreaAdmins(verified);
      } else {`;

const newFetch = `  const fetchAreaAdmins = async () => {
    try {
      const localAdmins = localStorage.getItem('app_area_admins');
      if (localAdmins) {
        const saved = JSON.parse(localAdmins);
        const fixedData = saved.map((admin: any) => ({
          ...admin,
          id: admin.id || Date.now().toString() + Math.random() // Give ID if missing
        }));
        setAreaAdmins(fixedData);
        localStorage.setItem('app_area_admins', JSON.stringify(fixedData));
      } else {`;

code = code.replace(oldFetch, newFetch);


// Just to be absolutely safe, let's update handleDeleteById to also allow index if somehow id fails
const oldHandleDelete = `  const handleDeleteById = (idToDelete: string) => {
    console.log("Attempting to delete ID:", idToDelete);
    setAreaAdmins((prev) => {
      const updatedList = prev.filter((admin: any) => String(admin.id) !== String(idToDelete));
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
  };`;

const newHandleDelete = `  const handleDeleteById = (idToDelete: string, index?: number) => {
    console.log("Attempting to delete ID/Index:", idToDelete, index);
    setAreaAdmins((prev) => {
      const updatedList = prev.filter((admin: any, i: number) => {
        if (idToDelete) return String(admin.id) !== String(idToDelete);
        if (index !== undefined) return i !== index;
        return true;
      });
      localStorage.setItem('app_area_admins', JSON.stringify(updatedList));
      return updatedList;
    });
  };`;
code = code.replace(oldHandleDelete, newHandleDelete);

const oldDeleteBtn = `                                if (window.confirm("Are you sure you want to delete this Area Admin?")) {
                                  handleDeleteById(admin.id);
                                }`;
const newDeleteBtn = `                                if (window.confirm("Are you sure you want to delete this Area Admin?")) {
                                  handleDeleteById(admin.id, index);
                                }`;
code = code.replace(oldDeleteBtn, newDeleteBtn);

const oldMap = `{areaAdmins.map(admin => (`;
const newMap = `{areaAdmins.map((admin, index) => (`;
code = code.replace(oldMap, newMap);

fs.writeFileSync('src/components/Admin.tsx', code);
