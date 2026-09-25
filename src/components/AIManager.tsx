import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Activity, AlertCircle, CheckCircle, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { Complaint, InventoryItem } from '../types';
import { isPromptInjection } from '../lib/security';

interface AIManagerProps {
  complaints: Complaint[];
  inventory: InventoryItem[];
}

interface DashboardData {
  repairAgent: { status: string; issues: string[]; actionsTaken: string[] };
  inventoryAgent: { status: string; issues: string[]; actionsTaken: string[] };
  billingAgent: { status: string; issues: string[]; actionsTaken: string[] };
  mainSummary: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIManager({ complaints, inventory }: AIManagerProps) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello Admin! I am the MAIN AI ASSISTANT. How can I help you and our sub-agents today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboard();
  }, [complaints, inventory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const response = await fetch('/api/assistant/dash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaints: complaints.slice(0, 100), inventory: inventory.slice(0, 100) })
      });
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error("Error fetching AI dashboard:", error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    if (isPromptInjection(inputValue)) {
      setMessages(prev => [...prev, { role: 'user', text: inputValue }, { role: 'model', text: 'Security Violation: Action Blocked & Logged.' }]);
      setInputValue('');
      return;
    }

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('/api/assistant/cmd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: userMessage.text,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          context: { complaints: complaints.slice(0, 100), inventory: inventory.slice(0, 100) }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error communicating with the Sub-Agents.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const AgentCard = ({ title, agentData, icon: Icon, colorClass }: { title: string, agentData?: { status: string, issues: string[], actionsTaken: string[] }, icon: any, colorClass: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border ${colorClass} overflow-hidden`}>
      <div className={`p-4 border-b ${colorClass} bg-opacity-10 flex items-center gap-3`}>
        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
          <Icon className={`w-5 h-5`} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">{agentData?.status || 'Monitoring'}</p>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Detected Issues
          </p>
          {agentData?.issues && agentData.issues.length > 0 ? (
            <ul className="space-y-1">
              {agentData.issues.map((issue, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No current issues.</p>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Auto-Actions Taken
          </p>
          {agentData?.actionsTaken && agentData.actionsTaken.length > 0 ? (
            <ul className="space-y-1">
              {agentData.actionsTaken.map((action, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No actions required.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Daily Summary Update Center */}
      <div className="lg:col-span-2 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> AI Sub-Agents Dashboard
            </h2>
            <p className="text-sm text-slate-500">Real-time monitoring & auto-correction</p>
          </div>
          <button 
            onClick={fetchDashboard}
            disabled={loadingDashboard}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-5 h-5 ${loadingDashboard ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loadingDashboard && !dashboard ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <p className="font-medium animate-pulse">Sub-Agents are analyzing departments...</p>
            </div>
          ) : (
            <>
              {dashboard?.mainSummary && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5" /> Main Assistant Summary
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">{dashboard.mainSummary}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AgentCard 
                  title="Repair & Technician" 
                  agentData={dashboard?.repairAgent} 
                  icon={Activity} 
                  colorClass="border-orange-200 bg-orange-50 text-orange-600"
                />
                <AgentCard 
                  title="Product & Inventory" 
                  agentData={dashboard?.inventoryAgent} 
                  icon={Activity} 
                  colorClass="border-purple-200 bg-purple-50 text-purple-600"
                />
                <AgentCard 
                  title="Billing & Payment" 
                  agentData={dashboard?.billingAgent} 
                  icon={Activity} 
                  colorClass="border-emerald-200 bg-emerald-50 text-emerald-600"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Admin Command Center */}
      <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold">MAIN AI ASSISTANT</h2>
            <p className="text-xs text-blue-200">Online • Listening for commands</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
              }`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                    <Bot className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Manager</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., Follow up on pending payments..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
              disabled={isSending}
            />
            <button 
              type="submit" 
              disabled={isSending || !inputValue.trim()}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
