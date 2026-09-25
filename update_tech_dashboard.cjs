const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

// Add icons
code = code.replace(
  "import { LogOut, Check, Camera, Wrench, Search, Package, FileText, Download, MapPin, MessageCircle, ScanLine } from 'lucide-react';",
  "import { LogOut, Check, Camera, Wrench, Search, Package, FileText, Download, MapPin, MessageCircle, ScanLine, Clock, PlayCircle, Square, Briefcase } from 'lucide-react';\nimport { secureStorage } from '../lib/security';"
);

// Add Shift States
const shiftStates = `
  // Shift Tracker State
  const [isOnShift, setIsOnShift] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<number | null>(null);
  const [shiftDuration, setShiftDuration] = useState(0); // in seconds
  
  useEffect(() => {
    if (tech) {
      const shiftData = secureStorage.getItem(\`shift_\${tech.id}\`);
      if (shiftData && shiftData.isOnShift) {
        setIsOnShift(true);
        setShiftStartTime(shiftData.startTime);
      }
    }
  }, [tech]);

  useEffect(() => {
    let interval: any;
    if (isOnShift && shiftStartTime) {
      interval = setInterval(() => {
        setShiftDuration(Math.floor((Date.now() - shiftStartTime) / 1000));
      }, 1000);
    } else {
      setShiftDuration(0);
    }
    return () => clearInterval(interval);
  }, [isOnShift, shiftStartTime]);

  const handleToggleShift = () => {
    if (!tech) return;
    
    if (isOnShift) {
      // Check out
      if (window.confirm("Are you sure you want to end your shift?")) {
        setIsOnShift(false);
        setShiftStartTime(null);
        secureStorage.setItem(\`shift_\${tech.id}\`, { isOnShift: false, startTime: null });
      }
    } else {
      // Check in
      const now = Date.now();
      setIsOnShift(true);
      setShiftStartTime(now);
      secureStorage.setItem(\`shift_\${tech.id}\`, { isOnShift: true, startTime: now });
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };
  
  const jobsCompletedToday = complaints.filter(c => c.status === 'Resolved' && new Date(c.updatedAt || c.createdAt).toDateString() === new Date().toDateString()).length;
  const estimatedEarnings = jobsCompletedToday * 150; // assuming 150 INR base payout per job for dummy stats
`;

code = code.replace(
  "// History Modal State",
  shiftStates + "\n  // History Modal State"
);

// Add Shift Widget inside main
const shiftWidget = `
        {/* Shift & Attendance Widget */}
        <div className="mb-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-5 lg:p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative">
                <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center \${isOnShift ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-slate-200 to-slate-300'} shadow-lg text-white transition-all duration-300\`}>
                  <Clock className="w-7 h-7" />
                </div>
                {isOnShift && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Shift Status
                  <span className={\`text-xs px-2 py-0.5 rounded-full font-bold uppercase \${isOnShift ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}\`}>
                    {isOnShift ? 'Active' : 'Offline'}
                  </span>
                </h3>
                {isOnShift ? (
                  <div className="text-emerald-600 font-mono font-bold text-xl tracking-wider mt-1">{formatDuration(shiftDuration)}</div>
                ) : (
                  <div className="text-slate-500 text-sm mt-1">Ready for work? Check in below.</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="hidden sm:flex gap-4 mr-4">
                <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Jobs Today</p>
                  <p className="text-lg font-bold text-slate-700 flex items-center justify-center gap-1"><Briefcase className="w-4 h-4 text-blue-500" /> {jobsCompletedToday}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Est. Earnings</p>
                  <p className="text-lg font-bold text-emerald-600">₹{estimatedEarnings}</p>
                </div>
              </div>

              <button
                onClick={handleToggleShift}
                className={\`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg \${
                  isOnShift 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/25' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
                }\`}
              >
                {isOnShift ? (
                  <><Square className="w-5 h-5 fill-current" /> End Shift</>
                ) : (
                  <><PlayCircle className="w-5 h-5" /> Start Shift</>
                )}
              </button>
            </div>
          </div>
        </div>
`;

code = code.replace(
  "<main className=\"max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8\">",
  "<main className=\"max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8\">\n" + shiftWidget
);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
