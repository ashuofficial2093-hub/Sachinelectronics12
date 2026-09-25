import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

function safeJSONParse(val: string | null, fallback: any) {
  if (!val) return fallback;
  try {
    return JSON.parse(val) || fallback;
  } catch (e) {
    return fallback;
  }
}

interface GlobalState {
  complaints: any[];
  technicians: any[];
  areaAdmins: any[];
  setComplaints: React.Dispatch<React.SetStateAction<any[]>>;
  setTechnicians: React.Dispatch<React.SetStateAction<any[]>>;
  setAreaAdmins: React.Dispatch<React.SetStateAction<any[]>>;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);


const INITIAL_TECH = [{
  id: 'tech_1',
  name: 'John Technician',
  phone: '9876543210',
  password: '123',
  isActive: true,
  skills: 'AC,Fridge',
  pincodes: ['209202']
}];

const INITIAL_COMPLAINTS = [{
  id: 'comp_1',
  name: 'Alice Smith',
  phone: '9998887776',
  pincode: '209202',
  address: '123 Test Ave',
  product: 'AC',
  issue: 'Not cooling',
  status: 'Pending',
  createdAt: new Date().toISOString()
}];

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaintsState] = useState<any[]>(() => {
    let stored = safeJSONParse(localStorage.getItem('app_complaints'), null);
    if (!stored || stored.length === 0) {
      
      return INITIAL_COMPLAINTS;
    }
    return stored;
  });
  
  const [technicians, setTechniciansState] = useState<any[]>(() => {
    let stored = safeJSONParse(localStorage.getItem('app_active_technicians'), null);
    if (!stored || stored.length === 0) {
      localStorage.setItem('app_active_technicians', JSON.stringify(INITIAL_TECH));
      return INITIAL_TECH;
    }
    return stored;
  });


  const [areaAdmins, setAreaAdminsState] = useState<any[]>(() => {
    return safeJSONParse(localStorage.getItem('app_area_admins'), []);
  });

  
  const setComplaints = (c: any[] | ((prev: any[]) => any[])) => {
    setComplaintsState((prev) => {
      const newVal = typeof c === 'function' ? c(prev) : c;
      const valid = Array.isArray(newVal) ? newVal : [];
      
      return valid;
    });
  };


  
  const setTechnicians = (t: any[] | ((prev: any[]) => any[])) => {
    setTechniciansState((prev) => {
      const newVal = typeof t === 'function' ? t(prev) : t;
      const valid = Array.isArray(newVal) ? newVal : [];
      localStorage.setItem('app_active_technicians', JSON.stringify(valid));
      return valid;
    });
  };


  
  const setAreaAdmins = (a: any[] | ((prev: any[]) => any[])) => {
    setAreaAdminsState((prev) => {
      const newVal = typeof a === 'function' ? a(prev) : a;
      const valid = Array.isArray(newVal) ? newVal : [];
      localStorage.setItem('app_area_admins', JSON.stringify(valid));
      return valid;
    });
  };


  // Sync state if localStorage changes from another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_complaints') setComplaintsState(safeJSONParse(e.newValue, []));
      if (e.key === 'app_active_technicians') setTechniciansState(safeJSONParse(e.newValue, []));
      if (e.key === 'app_area_admins') setAreaAdminsState(safeJSONParse(e.newValue, []));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <GlobalContext.Provider value={{ complaints, technicians, areaAdmins, setComplaints, setTechnicians, setAreaAdmins }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
}
