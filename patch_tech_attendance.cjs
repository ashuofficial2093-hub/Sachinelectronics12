const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

// Add Calendar icon
code = code.replace(/import \{ LogOut, Check, Camera, Wrench, Search, Package, FileText, Download, MapPin, MessageCircle, ScanLine, Clock, PlayCircle, Square, Briefcase \} from 'lucide-react';/,
"import { LogOut, Check, Camera, Wrench, Search, Package, FileText, Download, MapPin, MessageCircle, ScanLine, Clock, PlayCircle, Square, Briefcase, Calendar } from 'lucide-react';");

code = code.replace(/const \[activeTab, setActiveTab\] = useState\<'tasks' \| 'inventory'\>\('tasks'\);/,
"const [activeTab, setActiveTab] = useState<'tasks' | 'inventory' | 'attendance'>('tasks');");

// Inject new states
const stateInjection = `  // Attendance State
  const [attendance, setAttendance] = useState<any[]>([]);
  const [currentMonthDays, setCurrentMonthDays] = useState<Date[]>([]);
  const [showSelfieCamera, setShowSelfieCamera] = useState(false);
  const [selfieProcessing, setSelfieProcessing] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    // Generate current month days
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    setCurrentMonthDays(days);
    
    // Load attendance & leaves
    if (tech) {
      const allAttendance = JSON.parse(localStorage.getItem('app_attendance') || '[]');
      setAttendance(allAttendance.filter((a: any) => a.techId === tech.id));
      const allLeaves = JSON.parse(localStorage.getItem('app_leaves') || '[]');
      setLeaves(allLeaves.filter((l: any) => l.techId === tech.id));
    }
  }, [tech]);

  const handleCaptureSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tech) return;
    
    setSelfieProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Compress < 30KB
        
        // Save Check-In
        const allAttendance = JSON.parse(localStorage.getItem('app_attendance') || '[]');
        const todayStr = new Date().toLocaleString('en-CA', {timeZone: 'Asia/Kolkata'}).split(',')[0];
        
        if (allAttendance.find((a: any) => a.techId === tech.id && a.date === todayStr)) {
          alert('Already checked in today!');
        } else {
          const newRecord = {
            id: 'att_' + Date.now(),
            techId: tech.id,
            techName: tech.name,
            date: todayStr,
            status: 'Present',
            photoUrl: dataUrl,
            timestamp: new Date().toISOString()
          };
          allAttendance.push(newRecord);
          localStorage.setItem('app_attendance', JSON.stringify(allAttendance));
          setAttendance(allAttendance.filter((a: any) => a.techId === tech.id));
          alert('Check-in successful!');
        }
        setShowSelfieCamera(false);
        setSelfieProcessing(false);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleApplyLeave = () => {
     if (!tech) return;
     const todayStr = new Date().toLocaleString('en-CA', {timeZone: 'Asia/Kolkata'}).split(',')[0];
     const dateStr = prompt("Enter leave date (YYYY-MM-DD):", todayStr);
     if (!dateStr) return;
     const reason = prompt("Reason for leave:");
     
     const allLeaves = JSON.parse(localStorage.getItem('app_leaves') || '[]');
     const newLeave = {
        id: 'lv_' + Date.now(),
        techId: tech.id,
        techName: tech.name,
        date: dateStr,
        reason: reason || 'Personal',
        status: 'Pending',
        timestamp: new Date().toISOString()
     };
     allLeaves.push(newLeave);
     localStorage.setItem('app_leaves', JSON.stringify(allLeaves));
     setLeaves(allLeaves.filter((l: any) => l.techId === tech.id));
     alert("Leave request submitted to Admin.");
  };`;

code = code.replace(/const \[isOnShift, setIsOnShift\] = useState\(false\);/, `${stateInjection}\n  const [isOnShift, setIsOnShift] = useState(false);`);

// Fix 24-hour shift timer
const oldShiftEffect = /useEffect\(\(\) => \{\n\s+if \(tech\) \{\n\s+const shiftData = secureStorage\.getItem\(\`shift_\$\{tech\.id\}\`\);\n\s+if \(shiftData && shiftData\.isOnShift\) \{\n\s+setIsOnShift\(true\);\n\s+setShiftStartTime\(shiftData\.startTime\);\n\s+\}\n\s+\}\n\s+\}, \[tech\]\);/m;

const newShiftEffect = `useEffect(() => {
    if (tech) {
      const shiftData = secureStorage.getItem(\`shift_\${tech.id}\`);
      if (shiftData && shiftData.isOnShift) {
        const now = Date.now();
        if (now - shiftData.startTime > 24 * 60 * 60 * 1000) {
           // Reset automatically if shift is older than 24h
           setIsOnShift(false);
           setShiftStartTime(null);
           secureStorage.setItem(\`shift_\${tech.id}\`, { isOnShift: false, startTime: null });
        } else {
           setIsOnShift(true);
           setShiftStartTime(shiftData.startTime);
        }
      }
    }
  }, [tech]);`;
code = code.replace(oldShiftEffect, newShiftEffect);

// Add Tab Button
const oldTab = /<button\n\s+onClick=\{\(\) => setActiveTab\('inventory'\)\}\n\s+className=\{\`py-4 px-2 border-b-2 font-medium text-sm transition-colors \$\{\n\s+activeTab === 'inventory' \? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'\n\s+\}\`\}\n\s+>\n\s+Parts Inventory\n\s+<\/button>/;

const newTab = `<button
              onClick={() => setActiveTab('inventory')}
              className={\`py-4 px-2 border-b-2 font-medium text-sm transition-colors \${
                activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }\`}
            >
              Parts Inventory
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={\`py-4 px-2 border-b-2 font-medium text-sm transition-colors \${
                activeTab === 'attendance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }\`}
            >
              Attendance & Salary
            </button>`;

code = code.replace(oldTab, newTab);

// Add Attendance View
const attendanceView = `
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-600" /> Monthly Attendance</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleApplyLeave}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 font-bold rounded-xl hover:bg-yellow-200 transition-colors shadow-sm text-sm"
                >
                  Apply Leave
                </button>
                <label className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm cursor-pointer inline-flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Daily Check-In
                  <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleCaptureSelfie} disabled={selfieProcessing} />
                </label>
              </div>
            </div>
            
            {selfieProcessing && <p className="text-blue-600 font-bold text-center">Processing check-in selfie...</p>}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-lg mb-4">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase">{day}</div>
                ))}
                
                {Array.from({ length: currentMonthDays[0].getDay() }).map((_, i) => (
                  <div key={'empty-'+i} className="aspect-square"></div>
                ))}
                
                {currentMonthDays.map(date => {
                  const dateStr = date.toLocaleString('en-CA', {timeZone: 'Asia/Kolkata'}).split(',')[0];
                  const att = attendance.find(a => a.date === dateStr);
                  const lv = leaves.find(l => l.date === dateStr);
                  
                  let bgClass = "bg-slate-50 border-slate-100";
                  let label = "-";
                  let textClass = "text-slate-400";
                  
                  if (att && att.status === 'Present') {
                    bgClass = "bg-green-100 border-green-200";
                    label = "✔";
                    textClass = "text-green-700 font-bold";
                  } else if (lv && lv.status === 'Approved') {
                    bgClass = "bg-yellow-100 border-yellow-200";
                    label = "L";
                    textClass = "text-yellow-700 font-bold";
                  } else if (lv && lv.status === 'Pending') {
                    bgClass = "bg-orange-50 border-orange-100";
                    label = "?";
                    textClass = "text-orange-400";
                  } else if (date < new Date()) {
                    bgClass = "bg-red-50 border-red-100";
                    label = "A";
                    textClass = "text-red-500 font-bold";
                  }
                  
                  // Highlight today
                  const isToday = dateStr === new Date().toLocaleString('en-CA', {timeZone: 'Asia/Kolkata'}).split(',')[0];
                  if (isToday) {
                    bgClass += " ring-2 ring-blue-400 ring-offset-1";
                  }
                  
                  return (
                    <div key={dateStr} className={\`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 \${bgClass}\`}>
                      <span className="text-xs font-medium text-slate-700 mb-1">{date.getDate()}</span>
                      <span className={\`text-sm \${textClass}\`}>{label}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-4 mt-6 text-sm font-medium border-t pt-4 border-slate-100">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div> Present ({attendance.length})</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full"></div> Approved Leave</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-50 border border-red-100 rounded-full"></div> Absent</div>
              </div>
            </div>
            
            {tech.baseSalary && (
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 text-white mt-6">
                <h3 className="font-bold text-lg mb-4 text-blue-200">Current Month Payroll Estimate</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Base Salary</p>
                    <p className="font-bold text-xl">₹{tech.baseSalary}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Days in Month</p>
                    <p className="font-bold text-xl">{currentMonthDays.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Present Days</p>
                    <p className="font-bold text-xl text-green-400">{attendance.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Est. Payout</p>
                    <p className="font-bold text-xl text-yellow-400">₹{Math.round((tech.baseSalary / currentMonthDays.length) * attendance.length)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
`;

code = code.replace(/\{activeTab === 'tasks' && \(/, `${attendanceView}\n\n        {activeTab === 'tasks' && (`);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
