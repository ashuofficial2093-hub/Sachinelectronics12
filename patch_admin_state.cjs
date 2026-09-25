const fs = require('fs');
let content = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const target = `  const [loginError, setLoginError] = useState('');
  const [resetMessage, setResetMessage] = useState('');`;

const replacement = `  const [loginError, setLoginError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // OTP Login State
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  // Forgot Password State
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState('');
  const [forgotEnteredOtp, setForgotEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Admin.tsx', content);
