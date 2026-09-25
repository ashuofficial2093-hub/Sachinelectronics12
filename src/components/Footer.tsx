import { MapPin, Phone, Clock, Wrench, Navigation } from 'lucide-react';

export default function Footer() {
  const mapsUrl = "https://maps.google.com/?q=Shop+No.+42,+Main+Market+Road,+Delhi+110001";

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="font-bold text-xl leading-none text-white">Sachin</h2>
                <span className="text-sm font-medium text-blue-400">Electricals & Repairs</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted partner for all electrical repairs and top-brand appliance sales. Quality service guaranteed.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Repair Services</a></li>
              <li><a href="#shop" className="hover:text-blue-400 transition-colors">Shop Appliances</a></li>
              <li><a href="#complaint" className="hover:text-blue-400 transition-colors">Book a Repair</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Shop No. 42, Main Market Road,<br/>City Center, Delhi 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href="tel:+918381892161" className="hover:text-white transition-colors">+91 83818 92161</a>
              </li>
            </ul>
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors border border-slate-700 hover:border-blue-500 w-full"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </a>
          </div>
          
          {/* Working Hours */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Working Hours</h3>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-white">Mon - Sun</span>
              </div>
              <p className="text-lg font-bold text-blue-400 pl-8">10:00 AM - 10:00 PM</p>
              <p className="text-xs text-slate-400 pl-8 mt-2">Open all 7 days a week</p>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Sachin Electricals & Repairs. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#technician-registration" className="text-blue-400 hover:text-blue-300 font-medium transition-colors border-r border-slate-700 pr-4">Technician Registration</a>
            <a href="#technician" className="text-slate-800 hover:text-slate-600 transition-colors">Technician Login</a>
            <a href="#super-admin" className="text-slate-800 hover:text-slate-600 transition-colors">Super Admin Login</a>
            <a href="#area-admin" className="text-slate-800 hover:text-slate-600 transition-colors">Area Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
