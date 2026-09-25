const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

// Restore safeJSONParse
const safeJsonParseRegex = /function safeJSONParse\(val: string \| null, fallback: any\) \{[\s\S]*?\} catch \(error\) \{[\s\S]*?\} finally \{/m;

const restoredSafeJsonParse = `function safeJSONParse(val: string | null, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch (e) { return fallback; }
}

export default function ComplaintForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedComplaints, setTrackedComplaints] = useState<Complaint[] | null>(null);

  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsTracking(true);
    try {
      let complaints: Complaint[] = [];
      const localComplaints = safeJSONParse(localStorage.getItem('app_complaints'), []);
      complaints = localComplaints.filter((c: any) => c.phone === searchTerm || c.id === searchTerm);

      // Also try fetching from RTDB to ensure latest
      try {
        const snapshot = await get(ref(rtdb, 'complaints'));
        if (snapshot.exists()) {
          const val = snapshot.val();
          const rtdbData = Object.keys(val).map(key => ({ id: key, ...val[key] })) as Complaint[];
          const remoteComplaints = rtdbData.filter((c: any) => c.phone === searchTerm || c.id === searchTerm);
          
          // Merge
          const all = [...complaints, ...remoteComplaints];
          complaints = [...new Map(all.map(item => [item.id, item])).values()];
        }
      } catch (e) {
        console.warn('RTDB tracking fetch error', e);
      }

      setTrackedComplaints(complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.warn("Error tracking complaints:", error);
      alert("Failed to find complaints.");
    } finally {`;

code = code.replace(safeJsonParseRegex, restoredSafeJsonParse);

// Check if there are other messed up safeJSONParses or if handleTrackComplaint was already completely overwritten.
// Wait, the regex `try \{[\s\S]*?\/\/ Try searching by phone[\s\S]*?\} catch \(error\) \{\s*console\.error\("Error tracking complaints:", error\);\s*alert\("Failed to find complaints\."\);\s*\} finally \{` matched from the `try` in `safeJSONParse` all the way down to the `catch` in `handleTrackComplaint`. It replaced everything in between!
fs.writeFileSync('src/components/ComplaintForm.tsx', code);
