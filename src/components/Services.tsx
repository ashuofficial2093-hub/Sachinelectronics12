import React from 'react';
import { Wind, Snowflake, Droplets, Fan, Zap, Laptop, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import TiltCard from './TiltCard';
import acRepairImg from '../assets/images/ac_technician_multimeter_1785870928600.jpg';

const services = [
  {
    id: 'AC',
    name: 'AC Repair',
    icon: <Snowflake className="w-8 h-8 text-blue-500" />,
    image: acRepairImg,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'WashingMachine',
    name: 'Washing Machine',
    icon: <Droplets className="w-8 h-8 text-cyan-500" />,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    id: 'Refrigerator',
    name: 'Refrigerator',
    icon: <Wind className="w-8 h-8 text-indigo-500" />,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=600',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'Cooler',
    name: 'Air Cooler',
    icon: <Fan className="w-8 h-8 text-sky-500" />,
    image: 'https://images.unsplash.com/photo-1579294212563-0c4be5141940?auto=format&fit=crop&q=80&w=600',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'Microwave',
    name: 'Microwave',
    icon: <Laptop className="w-8 h-8 text-orange-500" />,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=600',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'HouseWiring',
    name: 'House Wiring',
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    id: 'Other',
    name: 'Other Repairs',
    icon: <Wrench className="w-8 h-8 text-slate-500" />,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
    color: 'bg-slate-50 text-slate-600',
  },
];

export default function Services() {
  const handleServiceClick = (serviceId: string) => {
    // Dispatch custom event to preselect in the form
    window.dispatchEvent(new CustomEvent('preselectProduct', { detail: serviceId }));
    
    // Scroll to complaint form smoothly
    const complaintSection = document.getElementById('complaint');
    if (complaintSection) {
      complaintSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Expert Repair Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your appliance to book an immediate repair with our certified technicians.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleServiceClick(service.id)}
            >
              <TiltCard className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:border-blue-100 h-full">
                <div className="relative h-32 sm:h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(service.name)}`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className={`absolute -bottom-6 right-4 w-12 h-12 rounded-xl flex items-center justify-center ${service.color} shadow-lg border-2 border-white transform group-hover:-translate-y-2 transition-transform`}>
                    {service.icon}
                  </div>
                </div>
                <div className="p-4 pt-8">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{service.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    Book Now &rarr;
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
