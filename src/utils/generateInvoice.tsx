import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Complaint } from '../types';
import QRCode from 'react-qr-code';

const InvoiceTemplate = ({ complaint }: { complaint: Complaint }) => {
  const { resolutionDetails, name, phone, address, product, issue, id } = complaint;
  const invoiceNo = (id || 'INV').substring(0, 8).toUpperCase();
  const date = resolutionDetails?.resolutionDate ? new Date(resolutionDetails.resolutionDate) : new Date();
  
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 7);
  const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const totalAmount = resolutionDetails?.totalCost || 0;
  const taxableAmount = +(totalAmount / 1.18).toFixed(2);
  const cgst = +((taxableAmount * 9) / 100).toFixed(2);
  const sgst = +((taxableAmount * 9) / 100).toFixed(2);
  const finalTotal = (taxableAmount + cgst + sgst).toFixed(2);

  return (
    <div style={{ width: '800px', backgroundColor: '#ffffff', padding: '2rem', fontFamily: 'sans-serif', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box' }}>
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '2px solid #1e40af', paddingBottom: '1rem' }}>
        <div>
          <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
            TAX INVOICE
          </span>
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original For Recipient</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.02em', margin: 0 }}>SACHIN ELECTRONICS</h1>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', margin: '4px 0' }}>SALES AND SERVICES CENTER</h2>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', margin: 0 }}>A-2-Z services</p>
        </div>
      </div>

      {/* Company Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>PAN No: <span style={{ fontWeight: 'normal', color: '#334155' }}>HVUPS7703G</span></p>
          <p style={{ fontWeight: '600', color: '#0f172a', margin: 0 }}>GSTIN: <span style={{ fontWeight: 'normal', color: '#334155' }}>09HVUPS7703G1ZP</span></p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>Phone: <span style={{ fontWeight: 'normal' }}>8922943440</span></p>
          <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>Email: <span style={{ fontWeight: 'normal' }}>skkushwaha1996@gmail.com</span></p>
          <p style={{ color: '#475569', marginTop: '4px', maxWidth: '250px', marginLeft: 'auto', marginBottom: 0 }}>
            Munisuwer Awashti Nagar Bilhaur Kanpur Nagar, Kanpur, Uttar Pradesh, 209202
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', marginTop: 0 }}>INVOICE NO.</p>
          <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{invoiceNo}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', marginTop: 0 }}>INVOICE DATE</p>
          <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{formattedDate}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', marginTop: 0 }}>DUE DATE</p>
          <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{formattedDueDate}</p>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontWeight: 'bold', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '8px', borderLeft: '4px solid #2563eb', margin: '0 0 8px 0' }}>BILL TO</h3>
          <div style={{ fontSize: '14px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b', margin: '0 0 4px 0' }}>{name}</p>
            <p style={{ color: '#475569', margin: '0 0 8px 0' }}>{address || 'Address Not Provided'}</p>
            <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: '600', color: '#334155' }}>Mobile:</span> {phone}</p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>Place of Supply:</span> Uttar Pradesh (09)</p>
          </div>
        </div>
        <div>
          <h3 style={{ fontWeight: 'bold', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '8px', borderLeft: '4px solid #2563eb', margin: '0 0 8px 0' }}>SHIP TO</h3>
          <div style={{ fontSize: '14px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b', margin: '0 0 4px 0' }}>{name}</p>
            <p style={{ color: '#475569', margin: '0 0 8px 0' }}>{address || 'Address Not Provided'}</p>
            <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: '600', color: '#334155' }}>Mobile:</span> {phone}</p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>Place of Supply:</span> Uttar Pradesh (09)</p>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8' }}>No.</th>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8' }}>Item / Service Description</th>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8', textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8', textAlign: 'right' }}>Rate</th>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8', textAlign: 'right' }}>Tax (18%)</th>
            <th style={{ padding: '12px', border: '1px solid #1d4ed8', textAlign: 'right' }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>1</td>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', fontWeight: '600' }}>
              {product} Repair - {resolutionDetails?.replacedPartName || 'General Service'}
              {issue && <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', margin: '4px 0 0 0' }}>{issue}</p>}
            </td>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>1</td>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', textAlign: 'right' }}>Rs. {taxableAmount}</td>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', textAlign: 'right' }}>Rs. {(cgst + sgst).toFixed(2)}</td>
            <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold' }}>Rs. {totalAmount}</td>
          </tr>
          {/* Empty rows to fill space if needed */}
          {[...Array(3)].map((_, i) => (
             <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', height: '40px' }}>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
               <td style={{ padding: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}></td>
             </tr>
          ))}
        </tbody>
      </table>

      {/* Financials & Bank */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontWeight: 'bold', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '8px', borderLeft: '4px solid #2563eb', margin: '0 0 8px 0' }}>BANK DETAILS</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>Account Name:</span> Sachin electronic sales and service cent</p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>IFSC Code:</span> BARB0BUPGBX</p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>Account No:</span> 51810500002607</p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: '600', color: '#334155' }}>Bank Name:</span> Baroda Uttar Pradesh Gramin Bank</p>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '4px' }}>
              <QRCode value="upi://pay?pa=8840634434@okbizaxis&pn=Sachin%20Electronics" size={64} />
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px', margin: '0 0 4px 0' }}>Scan to Pay via UPI</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>PhonePe, GPay, Paytm</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', margin: 0 }}>8840634434@okbizaxis</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#475569' }}>Subtotal:</span>
            <span style={{ fontWeight: '600' }}>Rs. {taxableAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#475569' }}>Taxable Amount:</span>
            <span style={{ fontWeight: '600' }}>Rs. {taxableAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569', fontSize: '14px' }}>
            <span>CGST @9%:</span>
            <span>Rs. {cgst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 8px 0', color: '#475569', fontSize: '14px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
            <span>SGST @9%:</span>
            <span>Rs. {sgst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', fontSize: '18px' }}>
            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Total Amount:</span>
            <span style={{ fontWeight: '800', color: '#1d4ed8' }}>Rs. {finalTotal}</span>
          </div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #1e40af', paddingTop: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>This is a computer generated invoice and does not require a physical signature.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ height: '48px', borderBottom: '1px solid #94a3b8', marginBottom: '8px', width: '256px', marginLeft: 'auto', marginRight: 'auto' }}></div>
          <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px', margin: '0 0 4px 0' }}>Signature</p>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>SACHIN ELECTRONICS SALES AND SERVICES CENTER</p>
        </div>
      </div>
    </div>
  );
};

export const generateInvoice = async (complaint: Complaint) => {
  if (!complaint.resolutionDetails || complaint.status !== 'Resolved') return;

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const root = createRoot(container);
  
  root.render(<InvoiceTemplate complaint={complaint} />);
  
  // Wait for React to mount and render
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Tax_Invoice_${complaint.id?.substring(0, 8) || 'receipt'}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    root.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
