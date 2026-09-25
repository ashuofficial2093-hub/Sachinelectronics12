import React, { useState } from 'react';
import TaxInvoice, { TaxInvoiceProps } from './TaxInvoice';
import { X, Printer, Share2, Plus, Trash2 } from 'lucide-react';

interface InvoiceGeneratorModalProps {
  complaint: any;
  onClose: () => void;
}

export default function InvoiceGeneratorModal({ complaint, onClose }: InvoiceGeneratorModalProps) {
  const [items, setItems] = useState([{ name: complaint.issue || 'Repair Service', qty: 1, rate: 0, taxPercent: 18 }]);
  const [showPreview, setShowPreview] = useState(false);

  const [invoiceData, setInvoiceData] = useState<TaxInvoiceProps>({
    invoiceNo: Math.floor(1000 + Math.random() * 9000).toString(),
    invoiceDate: new Date().toLocaleString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    customerName: complaint.name || complaint.customerName || 'Customer',
    customerAddress: complaint.address || '',
    customerPhone: complaint.phone || '',
    placeOfSupply: 'Uttar Pradesh',
    items: items
  });

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1, rate: 0, taxPercent: 18 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChangeItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleGenerate = () => {
    setInvoiceData({ ...invoiceData, items });
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const total = items.reduce((acc, curr) => acc + (curr.qty * curr.rate * (1 + curr.taxPercent / 100)), 0);
    const text = `Hello ${invoiceData.customerName}, your tax invoice for Job ${complaint.jobCardNumber || ''} has been generated. Total Amount: ₹${total.toFixed(2)}. Please make the payment via UPI.`;
    window.open(`https://wa.me/91${invoiceData.customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/50 backdrop-blur-sm p-4 print:p-0 print:bg-white overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl flex flex-col print:shadow-none print:rounded-none my-8">
          
          <div className="flex justify-between items-center p-4 border-b border-slate-200 print:hidden bg-slate-50 rounded-t-xl sticky top-0 z-10">
            <h2 className="font-bold text-lg text-slate-800">Invoice Preview</h2>
            <div className="flex items-center gap-3">
              <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
              <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#128C7E] transition-colors">
                <Share2 className="w-4 h-4" /> Send via WhatsApp
              </button>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-auto flex-1">
            <TaxInvoice data={invoiceData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0">
          <h2 className="text-xl font-bold text-slate-900">Generate Tax Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
             <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Name</label>
              <input type="text" value={invoiceData.customerName} onChange={(e) => setInvoiceData({...invoiceData, customerName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Phone</label>
              <input type="text" value={invoiceData.customerPhone} onChange={(e) => setInvoiceData({...invoiceData, customerPhone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Address</label>
              <textarea value={invoiceData.customerAddress} onChange={(e) => setInvoiceData({...invoiceData, customerAddress: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" rows={2}></textarea>
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Card No.</label>
               <input type="text" disabled value={complaint.jobCardNumber || 'N/A'} className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg outline-none text-slate-500" />
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Invoice Items</h3>
            <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                  <input type="text" value={item.name} onChange={(e) => handleChangeItem(idx, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. PCB Repair" />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty</label>
                  <input type="number" min="1" value={item.qty} onChange={(e) => handleChangeItem(idx, 'qty', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-right" />
                </div>
                <div className="w-28">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rate (₹)</label>
                  <input type="number" min="0" value={item.rate} onChange={(e) => handleChangeItem(idx, 'rate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-right" />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax %</label>
                  <select value={item.taxPercent} onChange={(e) => handleChangeItem(idx, 'taxPercent', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18% (GST)</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                {items.length > 1 && (
                  <button onClick={() => handleRemoveItem(idx)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-2xl">
          <div className="text-sm text-slate-500">
            Total Items: <span className="font-bold text-slate-900">{items.length}</span>
          </div>
          <div className="flex gap-3">
             <button onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
             <button onClick={handleGenerate} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
               Preview & Generate
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
