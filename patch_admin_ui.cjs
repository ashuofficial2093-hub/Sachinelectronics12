const fs = require('fs');
let content = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const target = `            <form className="space-y-6" onSubmit={handleAuth}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all sm:text-sm" />
                </div>
              </div>
              <div>
                <div className="mt-1 flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all sm:text-sm" />
                </div>
              </div>
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              {resetMessage && <div className="text-green-600 text-sm">{resetMessage}</div>}
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign in
                </button>
              </div>
            </form>`;

const replacement = `            <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
              <button 
                onClick={() => setLoginMode('password')}
                className={\`flex-1 py-2 text-sm font-bold rounded-md transition-colors \${loginMode === 'password' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}\`}
              >
                Password Login
              </button>
              <button 
                onClick={() => setLoginMode('otp')}
                className={\`flex-1 py-2 text-sm font-bold rounded-md transition-colors \${loginMode === 'otp' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'}\`}
              >
                OTP Login
              </button>
            </div>

            {loginMode === 'password' ? (
              <form className="space-y-6" onSubmit={handleAuth}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email address / Phone</label>
                  <div className="mt-1">
                    <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all sm:text-sm" placeholder="super@app.com" />
                  </div>
                </div>
                <div>
                  <div className="mt-1 flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="mt-1">
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all sm:text-sm" />
                  </div>
                </div>
                {loginError && <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">{loginError}</div>}
                <div>
                  <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign in with Password
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={otpStep === 'request' ? handleSendOtp : handleVerifyOtp}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Registered Phone / Email</label>
                  <div className="mt-1">
                    <input type="text" required disabled={otpStep === 'verify'} value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 disabled:bg-slate-100 transition-all sm:text-sm" placeholder="super@app.com" />
                  </div>
                </div>
                {otpStep === 'verify' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Enter 6-digit OTP</label>
                    <div className="mt-1">
                      <input type="text" required value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} maxLength={6} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 text-center tracking-widest font-bold text-lg transition-all" placeholder="------" />
                    </div>
                  </div>
                )}
                {loginError && <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">{loginError}</div>}
                <div>
                  {otpStep === 'request' ? (
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Send Login OTP
                    </button>
                  ) : (
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Verify OTP & Login
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Forgot Password Modal */}
            {forgotPasswordModalOpen && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900">Reset Password via OTP</h3>
                      <button onClick={() => setForgotPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>

                    {forgotStep === 'request' && (
                      <form onSubmit={handleForgotSendOtp} className="space-y-4">
                        <p className="text-sm text-slate-600">Enter your Super Admin email or phone to receive a password reset OTP.</p>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Email or Phone</label>
                          <input type="text" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" placeholder="super@app.com" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Send Reset OTP</button>
                      </form>
                    )}

                    {forgotStep === 'verify' && (
                      <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                        <p className="text-sm text-slate-600">Enter the 6-digit OTP sent to {forgotEmail}.</p>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">OTP</label>
                          <input type="text" required value={forgotEnteredOtp} onChange={(e) => setForgotEnteredOtp(e.target.value)} maxLength={6} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 text-center tracking-widest font-bold text-lg" placeholder="------" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Verify OTP</button>
                      </form>
                    )}

                    {forgotStep === 'reset' && (
                      <form onSubmit={handleForgotResetPassword} className="space-y-4">
                        <p className="text-sm text-slate-600">Please set your new Super Admin password.</p>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
                          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700">Update Password</button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Admin.tsx', content);
