/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Shop from './components/Shop';
import ComplaintForm from './components/ComplaintForm';
import TrackComplaint from './components/TrackComplaint';
import LoadCalculator from './components/LoadCalculator';
import PaymentBanner from './components/PaymentBanner';
import Footer from './components/Footer';
import Admin from './components/Admin';
import AreaAdminDashboard from './components/AreaAdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import TechnicianRegistration from './components/TechnicianRegistration';
import WhatsAppButton from './components/WhatsAppButton';
import LiveChat from './components/LiveChat';
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BannerSettings } from './types';
import { AlertTriangle, Tag, Package } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import MyOrdersModal from './components/MyOrdersModal';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAreaAdmin, setIsAreaAdmin] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [isTechnicianRegistration, setIsTechnicianRegistration] = useState(false);
  const [banner, setBanner] = useState<BannerSettings | null>(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin' || window.location.hash === '#super-admin');
      setIsAreaAdmin(window.location.hash === '#area-admin');
      setIsTechnician(window.location.hash === '#technician');
      setIsTechnicianRegistration(window.location.hash === '#technician-registration');
      if (window.location.hash === '#my-orders' || window.location.hash === '#track-order') {
        setIsOrdersModalOpen(true);
      }
    };
    
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleOpenMyOrders = (e: any) => {
      const orderId = e?.detail?.orderId;
      if (orderId) {
        setTrackingOrderId(orderId);
      }
      setIsOrdersModalOpen(true);
    };
    window.addEventListener('open-my-orders', handleOpenMyOrders);
    return () => window.removeEventListener('open-my-orders', handleOpenMyOrders);
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerDoc = await getDoc(doc(db, 'settings', 'banner'));
        if (bannerDoc.exists()) {
          setBanner(bannerDoc.data() as BannerSettings);
        }
      } catch (error: any) {
        if (error?.message?.includes('offline')) {
          // Ignore offline error
          return;
        }
        console.warn("Could not fetch banner:", error);
      }
    };
    if (!isAdmin && !isAreaAdmin && !isTechnician && !isTechnicianRegistration) {
      fetchBanner();
    }
  }, [isAdmin, isAreaAdmin, isTechnician, isTechnicianRegistration]);

  if (isAdmin) {
    return <Admin />;
  }
  if (isAreaAdmin) {
    return <AreaAdminDashboard />;
  }
  
  if (isTechnician) {
    return <TechnicianDashboard />;
  }

  if (isTechnicianRegistration) {
    return (
      <>
        {/* Render a minimal navbar or the full navbar? Full navbar is fine. */}
        <Navbar bannerActive={false} />
        <TechnicianRegistration />
      </>
    );
  }

  const renderBanner = () => {
    if (!banner || !banner.isActive || !banner.text) return null;
    
    let bgColor = 'bg-blue-600';
    let icon = <Tag className="w-5 h-5 text-white" />;
    
    if (banner.type === 'discount') {
      bgColor = 'bg-green-600';
    } else if (banner.type === 'emergency') {
      bgColor = 'bg-red-600';
      icon = <AlertTriangle className="w-5 h-5 text-white" />;
    }
    
    return (
      <div id="dynamic-banner" className={`fixed top-0 left-0 ${bgColor} text-white py-2 px-4 w-full z-[60] flex justify-center items-center gap-3 text-center`}>
        {icon}
        <span className="font-bold text-sm sm:text-base">{banner.text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-200 flex flex-col">
      {renderBanner()}
      <div className={banner?.isActive ? 'pt-[40px] sm:pt-[44px]' : ''}>
        <Navbar 
          bannerActive={banner?.isActive} 
          onOpenMyOrders={() => {
            setTrackingOrderId(undefined);
            setIsOrdersModalOpen(true);
          }}
        />
        <main>
          <Hero />
          <Services />
          <Features />
          <Shop />
          <LoadCalculator />
          <ComplaintForm />
          <TrackComplaint />
          <PaymentBanner />
        </main>
        <Footer />
        <WhatsAppButton />
        <LiveChat />

        {/* Dedicated Floating "My Orders" Quick Action Pill */}
        <button
          type="button"
          id="floating-my-orders-btn"
          onClick={() => {
            setTrackingOrderId(undefined);
            setIsOrdersModalOpen(true);
          }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl backdrop-blur-md border border-slate-700 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Track My Orders"
        >
          <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <Package className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="pr-1 font-bold">My Orders</span>
        </button>

        {/* Global My Orders Tracking Modal */}
        <MyOrdersModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
          initialOrderId={trackingOrderId}
        />
      </div>
    </div>
  );
}


export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
