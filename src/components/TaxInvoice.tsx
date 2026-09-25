import React from 'react';
import QRCode from 'react-qr-code';

interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
  taxPercent: number;
}

export interface TaxInvoiceProps {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGSTIN?: string;
  placeOfSupply: string;
  items: InvoiceItem[];
}

export default function TaxInvoice({ data }: { data: TaxInvoiceProps }) {
  const calculateTotals = () => {
    let taxableAmount = 0;
    let totalTaxAmount = 0;
    let totalQty = 0;

    const processedItems = data.items.map(item => {
      const amount = item.qty * item.rate;
      const taxAmount = (amount * item.taxPercent) / 100;
      const total = amount + taxAmount;
      
      taxableAmount += amount;
      totalTaxAmount += taxAmount;
      totalQty += item.qty;

      return {
        ...item,
        amount,
        taxAmount,
        total
      };
    });

    const finalTotal = taxableAmount + totalTaxAmount;
    
    // Split tax into CGST/SGST if it's 18% (9% each)
    const cgst = totalTaxAmount / 2;
    const sgst = totalTaxAmount / 2;

    return { processedItems, taxableAmount, totalTaxAmount, finalTotal, totalQty, cgst, sgst };
  };

  const { processedItems, taxableAmount, finalTotal, totalQty, cgst, sgst } = calculateTotals();

  const upiLink = `upi://pay?pa=8840634434@okbizaxis&pn=Sachin%20Electronics&am=${finalTotal.toFixed(2)}&cu=INR`;

  // Helper to convert number to words (basic implementation)
  const numberToWords = (num: number) => {
    // A full implementation would be longer, using a simple placeholder for now or a small util
    return "Amount in words: " + num.toFixed(2) + " Rupees Only"; // Simplified for brevity unless full words needed
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border-2 border-[#d4af37] print:border-none print:p-0 font-sans text-slate-800" id="tax-invoice-container">
      <div className="border border-[#d4af37] p-1">
        <div className="border border-[#d4af37] p-6 relative">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b border-[#d4af37] pb-6">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-slate-800 rounded-xl flex flex-col items-center justify-center text-white p-2">
                <div className="w-16 h-16 border-4 border-[#87ceeb] rounded-full flex items-center justify-center mb-1">
                   <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center">
                     <span className="text-xl font-serif italic">S</span>
                   </div>
                </div>
                <h1 className="font-serif italic text-xl">Sachin</h1>
                <p className="text-[8px] text-center mt-1">electronic sales and service centre</p>
              </div>
              
              <div>
                <h1 className="text-3xl font-serif text-[#1e3a8a] uppercase tracking-wide leading-tight">
                  Sachin Electronics<br/>Sales and Services<br/>Center
                </h1>
                <p className="text-sm text-slate-600 mt-1">A-2-Z services</p>
                <div className="flex gap-4 text-sm mt-2 font-medium">
                  <p>Pan No <span className="font-bold">HVUPS7703G</span></p>
                  <p>GSTIN <span className="font-bold">09HVUPS7703G1ZP</span></p>
                </div>
                <div className="flex gap-4 text-sm mt-1 text-slate-700">
                  <p>📞 8922943440</p>
                  <p>✉️ skkushwaha1966@gmail.com</p>
                </div>
                <p className="text-sm mt-1 text-slate-700">
                  📍 Munisuwer Awasthi Nagar Bilhaur Kanpur Nagar , Kanpur , Uttar Pradesh, 209202
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <h2 className="text-xl font-bold text-[#1e3a8a] uppercase">Tax Invoice</h2>
              <p className="text-[10px] border border-slate-300 px-2 py-0.5 inline-block mt-1 uppercase text-slate-500">Original for recipient</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="flex gap-16 mb-6">
            <div>
              <p className="text-xs font-bold text-[#1e3a8a]">Invoice No.</p>
              <p className="font-medium">{data.invoiceNo}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1e3a8a]">Invoice Date</p>
              <p className="font-medium">{data.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1e3a8a]">Due Date</p>
              <p className="font-medium">{data.dueDate}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 border-t border-b border-[#d4af37] mb-6">
            <div className="p-4 border-r border-[#d4af37]">
              <p className="text-sm font-bold text-[#1e3a8a] mb-2">Bill To</p>
              <p className="font-bold">{data.customerName}</p>
              <p className="text-sm whitespace-pre-wrap">{data.customerAddress}</p>
              <p className="text-sm mt-1"><span className="font-bold">Mobile</span> {data.customerPhone}</p>
              {data.customerGSTIN && <p className="text-sm"><span className="font-bold">GSTIN</span> {data.customerGSTIN}</p>}
              <p className="text-sm"><span className="font-bold">Place of Supply</span> {data.placeOfSupply}</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-bold text-[#1e3a8a] mb-2">Ship To</p>
              <p className="font-bold">{data.customerName}</p>
              <p className="text-sm whitespace-pre-wrap">{data.customerAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="py-2 px-2 text-left w-12 border-b border-[#d4af37]">No</th>
                <th className="py-2 px-2 text-left border-b border-[#d4af37]">Items</th>
                <th className="py-2 px-2 text-right border-b border-[#d4af37]">Qty.</th>
                <th className="py-2 px-2 text-right border-b border-[#d4af37]">Rate</th>
                <th className="py-2 px-2 text-right border-b border-[#d4af37]">Tax</th>
                <th className="py-2 px-2 text-right border-b border-[#d4af37]">Total</th>
              </tr>
            </thead>
            <tbody>
              {processedItems.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-3 px-2 text-left align-top">{idx + 1}</td>
                  <td className="py-3 px-2 text-left align-top font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-right align-top">{item.qty} PCS</td>
                  <td className="py-3 px-2 text-right align-top">{item.rate.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right align-top text-xs">
                    {item.taxAmount.toFixed(2)}<br/>
                    <span className="text-slate-500">({item.taxPercent}%)</span>
                  </td>
                  <td className="py-3 px-2 text-right align-top font-medium">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-[#d4af37]">
                <td colSpan={2} className="py-2 px-2 text-left">SUBTOTAL</td>
                <td className="py-2 px-2 text-right">{totalQty}</td>
                <td className="py-2 px-2 text-right"></td>
                <td className="py-2 px-2 text-right">₹ {(cgst + sgst).toFixed(2)}</td>
                <td className="py-2 px-2 text-right">₹ {finalTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            {/* Left Col - Bank Details & QR */}
            <div>
              <div className="mb-6">
                <p className="font-bold text-[#1e3a8a] mb-2">Bank Details</p>
                <div className="grid grid-cols-[100px_1fr] gap-1 text-xs">
                  <span className="text-slate-600">Name</span>
                  <span className="font-medium">Sachin electronic sales and service cent</span>
                  <span className="text-slate-600">IFSC</span>
                  <span className="font-medium">BARB0UPGBX</span>
                  <span className="text-slate-600">Account No</span>
                  <span className="font-medium">51810500002607</span>
                  <span className="text-slate-600">Bank Name</span>
                  <span className="font-medium">Baroda Uttar Pradesh Gramin Bank, Baroda Uttar Pradesh Gramin Bank IMPS</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-2 border border-slate-200 rounded-lg max-w-sm">
                <div className="bg-white p-1">
                   <QRCode value={upiLink} size={80} />
                </div>
                <div>
                  <p className="font-bold text-xs mb-1">Payment QR Code</p>
                  <div className="flex gap-1 mb-1 text-[8px] text-slate-500 font-bold">
                    <span>PhonePe</span>
                    <span>G Pay</span>
                    <span>Paytm</span>
                    <span>UPI</span>
                  </div>
                  <p className="text-[10px]"><span className="font-bold">UPI ID:</span> 8840634434@okbizaxis</p>
                </div>
              </div>
            </div>

            {/* Right Col - Totals & Signature */}
            <div>
              <div className="grid grid-cols-2 gap-2 text-right mb-4">
                <span className="text-slate-600">Taxable Amount</span>
                <span>₹ {taxableAmount.toFixed(2)}</span>
                
                <span className="text-slate-600">CGST @{(processedItems[0]?.taxPercent/2 || 9)}%</span>
                <span>₹ {cgst.toFixed(2)}</span>
                
                <span className="text-slate-600">SGST @{(processedItems[0]?.taxPercent/2 || 9)}%</span>
                <span>₹ {sgst.toFixed(2)}</span>
                
                <span className="font-bold text-[#1e3a8a] text-base pt-2 border-t border-slate-200">Total Amount</span>
                <span className="font-bold text-base pt-2 border-t border-slate-200">₹ {finalTotal.toFixed(2)}</span>
                
                <span className="text-slate-600">Received Amount</span>
                <span>₹ 0</span>
                
                <span className="text-slate-600 pt-2">Current Balance</span>
                <span className="pt-2">₹ {finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="mb-12">
                <p className="font-bold text-xs text-[#1e3a8a] mb-1">Total Amount (in words)</p>
                <p className="text-xs text-slate-600">Rupees {finalTotal.toFixed(2)} Only</p>
              </div>
              
              <div className="border border-[#d4af37] rounded-lg p-4 text-center mt-8 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-50">
                  {/* Fake Signature */}
                  <span className="font-serif italic text-4xl text-blue-900">Sachin</span>
                </div>
                <div className="border-t border-slate-300 pt-1 mt-4">
                  <p className="text-[10px] font-bold uppercase text-slate-600">Signature</p>
                  <p className="text-[9px] uppercase text-[#1e3a8a]">Sachin Electronics Sales and Services Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
