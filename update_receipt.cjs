const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

const oldReceipt = "const receiptMessage = `*🛠️ Booking Confirmed!*\\n\\n*Job ID:* ${docRef.id.substring(0, 8).toUpperCase()}\\n*Name:* ${name}\\n*Appliance:* ${product}\\n*Issue:* ${issue}\\n*Timeslot:* ${timeslot}\\n*Status:* Pending\\n*Location:* ${address}${hoursMessage}\\n\\nThank you for choosing Sachin Electricals!`;";

const newReceipt = `const serviceFee = pricing.serviceFees[baseProduct] !== undefined ? pricing.serviceFees[baseProduct] : (pricing.serviceFees['Other'] || 100);
      const estTotal = pricing.homeVisitCharge + serviceFee;
      const receiptMessage = \`*🛠️ Booking Confirmed!*\\n\\n*Job ID:* \${docRef.id.substring(0, 8).toUpperCase()}\\n*Name:* \${name}\\n*Appliance:* \${product}\\n*Issue:* \${issue}\\n*Timeslot:* \${timeslot}\\n*Status:* Pending\\n*Location:* \${address}\\n\\n*Cost Estimate:*\\nHome Visit Charge: ₹\${pricing.homeVisitCharge}\\nService Fee: ₹\${serviceFee}\\n*Estimated Total: ₹\${estTotal}*\\n(Note: Spare parts/hardware replacement charges are extra if required)\${hoursMessage}\\n\\nThank you for choosing Sachin Electricals!\`;`;

code = code.replace(oldReceipt, newReceipt);
fs.writeFileSync('src/components/ComplaintForm.tsx', code);
