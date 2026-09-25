const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

const buttonPattern = `                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 btn-3d btn-3d-blue"
                  >`;

const checkoutDisplay = `                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Booking Checkout</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Mandatory Home Visit Charge</span>
                        <span className="font-medium text-slate-900">₹{pricing.homeVisitCharge}</span>
                      </div>
                      {selectedProduct && (
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Service Charge ({selectedProduct === 'Other' ? customProduct || 'Other' : selectedProduct})</span>
                          <span className="font-medium text-slate-900">
                            ₹{pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg text-slate-900 border-t border-blue-200 mt-3 pt-3">
                        <span>Estimated Total</span>
                        <span>₹{pricing.homeVisitCharge + (selectedProduct ? (pricing.serviceFees[selectedProduct] !== undefined ? pricing.serviceFees[selectedProduct] : (pricing.serviceFees['Other'] || 100)) : 0)}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Spare parts / hardware component replacement charges will be extra if required during repair.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 btn-3d btn-3d-blue"
                  >`;

code = code.replace(buttonPattern, checkoutDisplay);

fs.writeFileSync('src/components/ComplaintForm.tsx', code);
