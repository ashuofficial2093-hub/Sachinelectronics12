import { Wrench, Phone, Menu, X, Moon, Sun, Fan, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';

interface NavbarProps {
  bannerActive?: boolean;
  onOpenMyOrders?: () => void;
}

export default function Navbar({ bannerActive, onOpenMyOrders }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const handleLogoClick = async () => {
    if (isSpinning) return;
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    
    setIsSpinning(true);
    
    // Spin fast and decelerate
    await controls.start({
      rotate: [0, 1080], // 3 full rotations
      scale: [1, 1.2, 1],
      transition: { 
        duration: 1.5, 
        ease: "circOut",
      }
    });
    
    controls.set({ rotate: 0 });
    setIsSpinning(false);
  };

  // When banner is active, the navbar should be shifted down slightly. 
  // We can achieve this by conditionally setting top.
  // The banner has a rough height of 40-50px (h-10).
  const topClass = bannerActive ? 'top-[40px] sm:top-[44px]' : 'top-0';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${topClass} ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleLogoClick}
            title="Click to spin!"
          >
            <motion.div 
              animate={controls}
              className="bg-blue-600 p-2 rounded-xl relative flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            >
              {isSpinning ? (
                <Fan className="h-6 w-6 text-white" />
              ) : (
                <Wrench className="h-6 w-6 text-white" />
              )}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-bold text-xl md:text-2xl leading-none tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>Sachin</h1>
                {new Date().getHours() >= 9 && new Date().getHours() < 21 ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Open
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Closed
                  </span>
                )}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${scrolled ? 'text-blue-600' : 'text-blue-600'}`}>Electricals & Repairs</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-5 items-center bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Services</a>
            <a href="#shop" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Shop</a>
            <a href="#complaint" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Book Repair</a>
            <a href="#track-complaint" className="text-blue-600 hover:text-blue-700 transition-colors font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">Track Complaint</a>
            <button
              type="button"
              id="navbar-my-orders-btn"
              onClick={() => {
                if (onOpenMyOrders) onOpenMyOrders();
                else window.dispatchEvent(new CustomEvent('open-my-orders'));
              }}
              className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors font-bold text-sm bg-slate-100 hover:bg-blue-50 px-3.5 py-1 rounded-full border border-slate-200/80 cursor-pointer shadow-2xs group"
              title="Track your orders"
            >
              <Package className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>My Orders</span>
            </button>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Contact</a>
            <a href="#technician-registration" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm border-l border-slate-300 pl-4">Partner</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleDark} 
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-blue-600 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="flex gap-3 text-xs font-medium text-slate-500 mr-2">
              <a href="#super-admin" className="hover:text-blue-600 transition-colors">Super Admin Login</a><a href="#area-admin" className="hover:text-blue-600 transition-colors">Area Admin Login</a>
              <a href="#technician" className="hover:text-blue-600 transition-colors">Technician</a>
            </div>
            <a href="tel:+918381892161" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleDark} 
              className="p-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-900 bg-white rounded-full shadow-sm border border-slate-200">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 space-y-2">
          <a href="#services" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Services</a>
          <a href="#shop" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Shop</a>
          <button
            type="button"
            id="mobile-my-orders-btn"
            onClick={() => {
              setIsMenuOpen(false);
              if (onOpenMyOrders) onOpenMyOrders();
              else window.dispatchEvent(new CustomEvent('open-my-orders'));
            }}
            className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-blue-700 bg-blue-50/70 hover:bg-blue-100 rounded-lg font-bold transition-colors border border-blue-100"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>My Orders (Track Order)</span>
          </button>
          <a href="#complaint" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Book Repair</a>
          <a href="#track-complaint" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Track Complaint</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Contact</a>
          <a href="#technician-registration" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors">Become a Partner</a>
          <div className="flex gap-4 px-4 py-2 text-sm font-medium text-slate-500">
            <a href="#super-admin" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Super Admin Login</a><a href="#area-admin" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Area Admin Login</a>
            <a href="#technician" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Technician Login</a>
          </div>
          <div className="pt-2">
             <a href="tel:+918381892161" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              <Phone className="h-4 w-4" />
              Call +91 83818 92161
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
