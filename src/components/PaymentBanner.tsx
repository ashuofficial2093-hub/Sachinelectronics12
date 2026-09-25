import { CreditCard, Smartphone, ShieldCheck, QrCode } from 'lucide-react';

export default function PaymentBanner() {
  return (
    <section className="border-t border-slate-100 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-500" />
          100% Secure Payments Accepted
        </h3>
        <p className="text-slate-500 mb-2 max-w-2xl mx-auto">
          Pay easily for your repairs and product purchases using any of your favorite payment methods.
        </p>
        <p className="text-blue-600 font-bold mb-8 max-w-2xl mx-auto bg-blue-50 py-2 px-4 rounded-full inline-block">
          Official UPI ID: 8381892161@airtel
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-100 p-4 rounded-xl flex gap-2 items-center">
              <Smartphone className="h-8 w-8 text-blue-500" />
              <QrCode className="h-8 w-8 text-slate-700" />
            </div>
            <span className="text-sm font-semibold text-slate-600">UPI & QR</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-center font-bold text-indigo-600 h-16 px-4">
              PhonePe
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-center font-bold text-blue-400 h-16 px-4">
              Paytm
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-center font-bold text-slate-700 h-16 px-4">
              GPay
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-100 p-4 rounded-xl">
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Cards</span>
          </div>
        </div>
      </div>
    </section>
  );
}
